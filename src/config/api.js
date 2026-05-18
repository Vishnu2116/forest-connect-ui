const isLocalhost = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost ? 'http://localhost:3000' : null;

export const USE_REAL_API = isLocalhost;
