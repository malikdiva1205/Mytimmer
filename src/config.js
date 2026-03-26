// If running locally, hit localhost:5001. If on Vercel, hit the same domain (/api/...) 
export const API_BASE = import.meta.env.DEV ? 'http://localhost:5001' : '';
