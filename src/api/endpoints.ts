/**
 * REST paths mirroring Tailor-Track server-action contracts.
 * Replace the base URL in `.env` — keep these paths aligned with the backend.
 */
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
  },
  customers: {
    list: '/api/customers',
    detail: (id: string) => `/api/customers/${id}`,
  },
  measurements: {
    list: '/api/measurements',
    detail: (id: string) => `/api/measurements/${id}`,
  },
  orders: {
    list: '/api/orders',
    detail: (id: string) => `/api/orders/${id}`,
  },
  jobs: {
    list: '/api/jobs',
    create: '/api/jobs',
    detail: (id: string) => `/api/jobs/${id}`,
  },
  users: {
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
    profile: '/api/users/profile',
  },
  support: {
    contact: '/api/support',
  },
} as const;
