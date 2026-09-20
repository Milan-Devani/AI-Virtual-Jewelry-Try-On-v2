import {
  TryOnGenerationResult,
  GenerationRecord,
  BackgroundType,
  AspectRatio,
  ImageSizeQuality,
  AiModelConfig,
  TryOnMode,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const LOCAL_STORAGE_HISTORY_KEY = "jewelai_history_records";
const TOKEN_KEY = "jewelai_auth_token";
const USER_KEY = "jewelai_cached_user";
const MEMBERSHIP_KEY = "jewelai_cached_membership";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getCachedUser(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: any | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {}
}

export function getCachedMembership(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MEMBERSHIP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedMembership(membership: any | null) {
  if (typeof window === "undefined") return;
  try {
    if (membership) {
      localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
    } else {
      localStorage.removeItem(MEMBERSHIP_KEY);
    }
  } catch {}
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(MEMBERSHIP_KEY);
    dispatchAuthChange(null);
  }
}

export interface GenerateTryOnPayload {
  modelFile?: File | null;
  jewelryFile: File;
  category: string;
  mode?: TryOnMode;
  modelConfig?: AiModelConfig;
  customCategoryName?: string;
  customPlacement?: string;
  background: BackgroundType;
  aspectRatio: AspectRatio;
  imageSize: ImageSizeQuality;
  userId?: string;
}

export interface ApiErrorWithDetails extends Error {
  code?: string;
  details?: {
    suggestedCategory?: string;
    detectedModelRegions?: string[];
    detectedJewelryType?: string;
    upgradeUrl?: string;
    status?: string;
    remaining?: number;
  };
}

export async function generateTryOnApi(
  payload: GenerateTryOnPayload,
  signal?: AbortSignal
): Promise<TryOnGenerationResult> {
  const formData = new FormData();

  formData.append("mode", payload.mode || "custom-model");
  formData.append("category", payload.category);

  if (payload.modelConfig) {
    formData.append("modelConfig", JSON.stringify(payload.modelConfig));
  }

  if (payload.customCategoryName) {
    formData.append("customCategoryName", payload.customCategoryName);
  }
  if (payload.customPlacement) {
    formData.append("customPlacement", payload.customPlacement);
  }

  formData.append("background", payload.background);
  formData.append("aspectRatio", payload.aspectRatio);
  formData.append("imageSize", payload.imageSize);

  if (payload.modelFile) {
    formData.append("modelImage", payload.modelFile);
  }

  formData.append("jewelryImage", payload.jewelryFile);

  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/try-on`, {
    method: "POST",
    body: formData,
    headers,
    signal,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = new Error(
      data.error?.message || data.message || "Failed to generate virtual try-on."
    ) as ApiErrorWithDetails;
    error.code = data.error?.code || "TRYON_FAILED";
    error.details = data.error?.details || data.details;
    throw error;
  }

  // Save to client offline history
  saveToLocalHistory({
    id: data.data.id,
    userId: payload.userId || "anonymous",
    category: data.data.categoryName || payload.category,
    background: payload.background,
    aspectRatio: payload.aspectRatio,
    imageSize: payload.imageSize,
    modelImageUrl: data.data.modelImageUrl || "",
    jewelryImageUrl: data.data.jewelryImageUrl,
    generatedImageUrl: data.data.imageUrl,
    status: "completed",
    createdAt: data.data.createdAt,
    updatedAt: data.data.createdAt,
    durationMs: data.data.durationMs,
  });

  return data.data;
}

// ==================== AUTH APIS ====================
export const AUTH_CHANGE_EVENT = "jewelai_auth_changed";
export const OPEN_AUTH_EVENT = "jewelai_open_auth";

export function dispatchAuthChange(user?: any) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user } }));
  }
}

export function dispatchOpenAuth(mode: "login" | "register" = "login") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_AUTH_EVENT, { detail: { mode } }));
  }
}

async function safeJsonParse(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function registerApi(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await safeJsonParse(res);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || data?.message || "Registration failed. Please check your details and try again.");
  }
  if (data.data?.token) {
    setAuthToken(data.data.token);
    if (data.data.user) {
      setCachedUser(data.data.user);
    }
    dispatchAuthChange(data.data.user);
  }
  return data.data;
}

export async function loginApi(payload: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await safeJsonParse(res);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || data?.message || "Invalid email or password. Please try again.");
  }
  if (data.data?.token) {
    setAuthToken(data.data.token);
    if (data.data.user) {
      setCachedUser(data.data.user);
      if (data.data.user.activeSubscription) {
        const sub = data.data.user.activeSubscription;
        const plan = sub.plan || null;
        setCachedMembership({
          status: sub.status || "active",
          plan: plan,
          totalCredits: plan?.generationLimit || 0,
          usedCredits: 0,
          remainingCredits: plan?.generationLimit || 0,
          isActive: sub.status === "active",
        });
      }
    }
    dispatchAuthChange(data.data.user);
  }
  return data.data;
}

export async function getMeApi() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJsonParse(res);
    if (!res.ok || !data?.success) {
      // ONLY invalidate token if backend explicitly responded with 401 Unauthorized.
      // Do NOT clear token on 500, 502, 503, 504, or network glitches.
      if (res.status === 401) {
        clearAuthToken();
        dispatchAuthChange(null);
      }
      return null;
    }
    if (data.data?.user) {
      setCachedUser(data.data.user);
    }
    if (data.data?.membership) {
      setCachedMembership(data.data.membership);
    }
    return data.data;
  } catch {
    // Network timeout or cold start: preserve token & cached data in localStorage
    return null;
  }
}

// ==================== MEMBERSHIP & PLANS ====================
export async function getPlansApi() {
  const res = await fetch(`${API_BASE_URL}/membership/plans`);
  const data = await safeJsonParse(res);
  if (!res.ok || !data?.success) {
    throw new Error("Failed to fetch membership plans");
  }
  return data.data;
}

export async function getMyMembershipApi() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/me/membership`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJsonParse(res);
    if (!res.ok || !data?.success) return null;
    return data.data;
  } catch {
    return null;
  }
}

// ==================== PAYMENTS & UPI ====================
export async function getUpiDetailsApi(planId: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/payments/upi-details/${planId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await safeJsonParse(res);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || "Failed to load payment details");
  }
  return data.data;
}

export async function submitVerificationApi(formData: FormData) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/payments/submit-verification`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await safeJsonParse(res);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error?.message || "Failed to submit payment verification");
  }
  return data.data;
}

export async function getMyVerificationsApi() {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/payments/my-verifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJsonParse(res);
    if (!res.ok || !data?.success) return [];
    return data.data;
  } catch {
    return [];
  }
}

// ==================== LOCAL HISTORY HELPERS ====================
export function getLocalHistory(): GenerationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocalHistory(record: GenerationRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalHistory();
    const updated = [record, ...current.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export async function fetchHistoryApi(
  userId: string = "anonymous",
  category?: string
): Promise<GenerationRecord[]> {
  try {
    const url = new URL(`${API_BASE_URL}/try-on/ai-jewelry/history`);
    if (userId) url.searchParams.append("userId", userId);
    if (category && category !== "all") url.searchParams.append("category", category);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url.toString(), { headers });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {}

  // Fallback to local offline history
  const local = getLocalHistory();
  if (category && category !== "all") {
    return local.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }
  return local;
}

export function deleteFromLocalHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalHistory();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export async function deleteHistoryApi(id: string): Promise<void> {
  deleteFromLocalHistory(id);
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch(`${API_BASE_URL}/try-on/ai-jewelry/${id}`, {
      method: "DELETE",
      headers,
    });
  } catch {}
}
