/**
<<<<<<< HEAD
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
=======
 * API Client & Network Utilities for E-Cell Portal
 */

export class ApiError extends Error {
  status: number;
  code?: string;
  data: any;

  constructor(message: string, status: number, code?: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
  }
}

/**
<<<<<<< HEAD
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
=======
 * Normalizes the API base URL configured via environment variables.
 */
export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  return envUrl;
}

/**
 * Constructs a fully qualified API URL or relative path while preventing
 * accidental double `/api/api/...` occurrences.
 */
export function buildApiUrl(endpoint: string): string {
  const rawBase = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!rawBase) {
    return cleanEndpoint;
  }

  const baseWithoutTrailing = rawBase.replace(/\/+$/, "");

  // Prevent duplicate `/api` if base URL ends in `/api` and endpoint starts with `/api/`
  if (baseWithoutTrailing.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    return `${baseWithoutTrailing}${cleanEndpoint.slice(4)}`;
  }

  return `${baseWithoutTrailing}${cleanEndpoint}`;
}

/**
 * Standard fetch-based API client for REST communications.
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint);

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    throw new ApiError(
      networkErr?.message || "Unable to reach the server. Please check your network connection.",
      0,
      "NETWORK_ERROR"
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
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
<<<<<<< HEAD
  }

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      data?.message ||
      (response.status === 409
        ? "A pending collaboration request already exists for this contact"
        : response.status === 422
        ? "Please check your submission details and try again."
        : `Request failed with status ${response.status}`);

    const errorCode =
      data?.error?.code ||
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
=======
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = "An error occurred while processing your request.";
    let errorCode: string | undefined;

    if (data && typeof data === "object") {
      if (data.error && typeof data.error === "object") {
        errorMessage = data.error.message || errorMessage;
        errorCode = data.error.code;
      } else if (typeof data.error === "string") {
        errorMessage = data.error;
      } else if (typeof data.message === "string") {
        errorMessage = data.message;
      }
    } else if (typeof data === "string" && data.trim()) {
      errorMessage = data.trim();
    }

    // Specific HTTP status codes fallback messages
    if (response.status === 409 && (!errorCode || errorCode === "CONFLICT")) {
      errorMessage =
        errorMessage !== "An error occurred while processing your request."
          ? errorMessage
          : "A pending collaboration request already exists for this contact.";
      errorCode = "CONFLICT";
    } else if (response.status === 422) {
      errorMessage =
        errorMessage !== "An error occurred while processing your request."
          ? errorMessage
          : "Validation failed on the submitted information. Please check your inputs.";
      errorCode = errorCode || "VALIDATION_ERROR";
    }

    throw new ApiError(errorMessage, response.status, errorCode, data);
  }

  // Handle standard backend envelope: { success: true, data: { ... } }
  if (data && typeof data === "object" && "success" in data && "data" in data && data.success === true) {
    return data.data as T;
  }

  return data as T;
}
>>>>>>> 1b801bd94473a8e512166fe75ce7bef6184a8b01
