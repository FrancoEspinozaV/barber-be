export const endpointRoute = {
  base: '/api',
  barber: {
    base: '/api/barbers',
  },
  auth: {
    base: '/api/auth',
    login: {
      absolute: '/api/auth/login',
      relative: '/login',
    },
    register: {
      absolute: '/api/auth/register',
      relative: '/register',
    },
    verifyEmail: {
      absolute: '/api/auth/verify-email',
      relative: '/verify-email',
    },
    logout: {
      absolute: '/api/auth/logout',
      relative: '/logout',
    },
    generateLink: {
      absolute: '/api/auth/generate-link',
      relative: '/generate-link',
    },
  },
}
