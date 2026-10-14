import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApiUrl, apiClient, ApiError } from "@/lib/api";

describe("API Client & URL Builder", () => {
  describe("buildApiUrl", () => {
    it("handles empty base URL by returning clean relative path", () => {
      vi.stubEnv("VITE_API_BASE_URL", "");
      expect(buildApiUrl("/api/collaborate")).toBe("/api/collaborate");
      expect(buildApiUrl("api/collaborate")).toBe("/api/collaborate");
    });

    it("appends endpoint to base URL without duplicate slashes", () => {
      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:5000");
      expect(buildApiUrl("/api/collaborate")).toBe("http://localhost:5000/api/collaborate");

      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:5000/");
      expect(buildApiUrl("/api/collaborate")).toBe("http://localhost:5000/api/collaborate");
    });

    it("prevents double /api/api if base URL ends with /api", () => {
      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:5000/api");
      expect(buildApiUrl("/api/collaborate")).toBe("http://localhost:5000/api/collaborate");

      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:5000/api/");
      expect(buildApiUrl("/api/collaborate")).toBe("http://localhost:5000/api/collaborate");
    });
  });

  describe("apiClient", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("successfully unwraps backend envelope { success: true, data: { ... } }", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "670cfa3198e72b4859a45612",
          status: "PENDING",
          submittedAt: "2026-10-14T16:30:00Z",
          message: "Collaboration request submitted successfully.",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockResponse,
      });

      const result = await apiClient("/api/collaborate", { method: "POST" });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("throws ApiError with status 409 and duplicate message on conflict", async () => {
      const mockConflict = {
        success: false,
        error: {
          code: "CONFLICT",
          message: "A pending collaboration request already exists for this contact",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockConflict,
      });

      await expect(apiClient("/api/collaborate", { method: "POST" })).rejects.toThrow(
        "A pending collaboration request already exists for this contact"
      );

      try {
        await apiClient("/api/collaborate", { method: "POST" });
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(409);
        expect(err.code).toBe("CONFLICT");
      }
    });

    it("throws ApiError with status 422 on validation failure", async () => {
      const mockValidationError = {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid email address",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockValidationError,
      });

      try {
        await apiClient("/api/collaborate", { method: "POST" });
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(422);
        expect(err.message).toBe("Invalid email address");
      }
    });

    it("throws ApiError with status 0 on network connection failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

      try {
        await apiClient("/api/collaborate", { method: "POST" });
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(0);
        expect(err.code).toBe("NETWORK_ERROR");
      }
    });
  });
});
