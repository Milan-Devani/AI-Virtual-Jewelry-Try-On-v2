import { AdminUser, PaymentVerification, MembershipPlan, DashboardStats, AuditLog } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const ADMIN_TOKEN_KEY = "jewelai_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    if (response.status === 401 || response.status === 403) {
      if (window.location.pathname !== "/login") {
        clearAdminToken();
        window.location.href = "/login";
      }
    }
    throw new Error(data.error?.message || data.message || "Request failed");
  }

  return data.data;
}

// Admin Auth
export async function adminLoginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Invalid email or password");
  }
  if (data.data?.user?.role !== "ADMIN") {
    throw new Error("Access denied: You do not have administrator permissions.");
  }
  setAdminToken(data.data.token);
  return data.data;
}

// Dashboard
export async function getDashboardStatsApi(): Promise<DashboardStats> {
  return fetchWithAuth("/admin/dashboard");
}

// Users
export async function getUsersApi(params: {
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}): Promise<{
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.filter && params.filter !== "all") query.set("filter", params.filter);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return fetchWithAuth(`/admin/users?${query.toString()}`);
}

export async function getUserDetailApi(id: string): Promise<any> {
  return fetchWithAuth(`/admin/users/${id}`);
}

export async function grantMembershipApi(userId: string, planId: string, durationDays: number = 30) {
  return fetchWithAuth(`/admin/users/${userId}/grant-membership`, {
    method: "POST",
    body: JSON.stringify({ planId, durationDays }),
  });
}

export async function revokeMembershipApi(userId: string, reason?: string) {
  return fetchWithAuth(`/admin/users/${userId}/revoke-membership`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function updateUserApi(
  userId: string,
  payload: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    planId?: string;
  }
): Promise<any> {
  return fetchWithAuth(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUserApi(userId: string): Promise<any> {
  return fetchWithAuth(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}

// Verifications & Payments
export async function getPendingVerificationsApi(): Promise<PaymentVerification[]> {
  return fetchWithAuth("/admin/payments/verifications");
}

export async function getAllPaymentsApi(status?: string): Promise<PaymentVerification[]> {
  const query = status ? `?status=${status}` : "";
  return fetchWithAuth(`/admin/payments${query}`);
}

export async function approveVerificationApi(id: string, notes?: string) {
  return fetchWithAuth(`/admin/payments/verifications/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}

export async function rejectVerificationApi(id: string, reason?: string) {
  return fetchWithAuth(`/admin/payments/verifications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// Plans
export async function getAdminPlansApi(): Promise<MembershipPlan[]> {
  return fetchWithAuth("/admin/plans");
}

export async function createPlanApi(data: Partial<MembershipPlan>) {
  return fetchWithAuth("/admin/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePlanApi(id: string, data: Partial<MembershipPlan>) {
  return fetchWithAuth(`/admin/plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePlanApi(id: string) {
  return fetchWithAuth(`/admin/plans/${id}`, {
    method: "DELETE",
  });
}

// Audit Logs & Subscriptions
export async function getAuditLogsApi(page: number = 1, limit: number = 50): Promise<{
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
}> {
  return fetchWithAuth(`/admin/audit-logs?page=${page}&limit=${limit}`);
}

export async function getAllSubscriptionsApi(): Promise<any[]> {
  return fetchWithAuth("/admin/subscriptions");
}
