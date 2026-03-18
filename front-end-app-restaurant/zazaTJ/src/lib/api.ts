// --------------------------------------------------------
// Базовый API клиент для ZAZA Restaurant Web App
// Все запросы идут на Laravel бэкенд.
// --------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const resp = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await resp.json();

  if (!resp.ok) {
    throw new ApiError(resp.status, json.message ?? 'Ошибка сервера', json.errors);
  }

  return json as ApiResponse<T>;
}

export const api = {
  get:    <T>(path: string) => request<T>('GET', path),
  post:   <T>(path: string, body: Record<string, unknown>) => request<T>('POST', path, body),
  put:    <T>(path: string, body: Record<string, unknown>) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// ─── Partner Request endpoints ────────────────────────
export interface RestaurantPartnerPayload {
  merchant_name: string;
  contact_name?: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
}

export interface B2BPartnerPayload {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  city?: string;
  description?: string;
}

export const partnerApi = {
  /** POST /api/v1/partner-request/restaurant */
  submitRestaurant: (data: RestaurantPartnerPayload) =>
    api.post('/partner-request/restaurant', data as unknown as Record<string, unknown>),

  /** POST /api/v1/partner-request/b2b */
  submitB2B: (data: B2BPartnerPayload) =>
    api.post('/partner-request/b2b', data as unknown as Record<string, unknown>),
};
