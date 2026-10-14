/**
 * API Client for E-Cell public website.
 * Connects to the Flask backend REST API.
 */

export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes and builds the target API URL.
 * Prevents double slashes, duplicate /api/api paths, and respects VITE_API_BASE_URL.
 */
export function buildApiUrl(endpoint: string, baseUrl?: string): string {
  const envBase = (
    baseUrl !== undefined
      ? baseUrl
      : (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || ""
  ).trim();

  // Strip trailing slashes
  const base = envBase.replace(/\/+$/, "");
  // Ensure endpoint starts with a slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!base) {
    return path;
  }

  // Prevent /api/api/collaborate if base already ends with /api and path starts with /api/
  if (base.endsWith("/api") && path.startsWith("/api/")) {
    return `${base}${path.slice(4)}`;
  }

  return `${base}${path}`;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  headers?: Record<string, string>;
}

export async function postJson<T = unknown>(
  endpoint: string,
  body: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(endpoint);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
      ...options,
    });
  } catch (err: unknown) {
    throw new ApiClientError(
      "Unable to connect to the backend server. Please check your internet connection or verify the server is running.",
      0,
      "NETWORK_ERROR",
      err
    );
  }

  let data: any = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorDetailMessage: string | null = null;
    if (data?.error) {
      if (typeof data.error === "string") {
        errorDetailMessage = data.error;
      } else if (typeof data.error?.message === "string") {
        errorDetailMessage = data.error.message;
      }
    }
    if (!errorDetailMessage && data?.message) {
      errorDetailMessage = typeof data.message === "string" ? data.message : null;
    }
    if (!errorDetailMessage && Array.isArray(data?.errors)) {
      errorDetailMessage = data.errors
        .map((e: any) => e?.message || e?.msg || String(e))
        .join(", ");
    } else if (
      !errorDetailMessage &&
      typeof data?.errors === "object" &&
      data?.errors !== null
    ) {
      errorDetailMessage = Object.entries(data.errors)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }

    const errorMessage =
      errorDetailMessage ||
      (response.status === 409
        ? "A pending collaboration request already exists for this contact"
        : response.status === 422
        ? "Please check your submission details and try again."
        : `Request failed with status ${response.status}`);

    const errorCode =
      data?.error?.code ||
      data?.code ||
      (response.status === 409
        ? "CONFLICT"
        : response.status === 422
        ? "VALIDATION_ERROR"
        : "SERVER_ERROR");

    throw new ApiClientError(errorMessage, response.status, errorCode, data);
  }

  return data as ApiResponse<T>;
}

export const api = {
  buildApiUrl,
  post: postJson,
};

export default api;
