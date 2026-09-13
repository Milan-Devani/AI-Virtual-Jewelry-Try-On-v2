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

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
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
export async function registerApi(payload: {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || data.message || "Registration failed");
  }
  if (data.data?.token) {
    setAuthToken(data.data.token);
  }
  return data.data;
}

export async function loginApi(payload: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || data.message || "Login failed");
  }
  if (data.data?.token) {
    setAuthToken(data.data.token);
  }
  return data.data;
}

export async function getMeApi() {
  const token = getAuthToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    clearAuthToken();
    return null;
  }
  return data.data;
}

// ==================== MEMBERSHIP & PLANS ====================
export async function getPlansApi() {
  const res = await fetch(`${API_BASE_URL}/membership/plans`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error("Failed to fetch membership plans");
  }
  return data.data;
}

export async function getMyMembershipApi() {
  const token = getAuthToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/me/membership`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) return null;
  return data.data;
}

// ==================== PAYMENTS & UPI ====================
export async function getUpiDetailsApi(planId: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/payments/upi-details/${planId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to load payment details");
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
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to submit payment verification");
  }
  return data.data;
}

export async function getMyVerificationsApi() {
  const token = getAuthToken();
  if (!token) return [];

  const res = await fetch(`${API_BASE_URL}/payments/my-verifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) return [];
  return data.data;
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
