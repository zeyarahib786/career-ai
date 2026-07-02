import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  r => r,
  err => {
    const msg = err.response?.data?.error || err.message || 'Unexpected error';
    const e   = new Error(msg);
    e.statusCode = err.response?.status;
    e.details    = err.response?.data?.details;
    return Promise.reject(e);
  }
);

export default api;

export const certificationService = {
  getAll:     l => api.get(`/certifications?locale=${l||'en'}`),
  getOne:     (code,l) => api.get(`/certifications/${code}?locale=${l||'en'}`),
  getByTrack: (id,l)   => api.get(`/certifications/track/${id}?locale=${l||'en'}`),
};

export const trackService = {
  getAll: l => api.get(`/tracks?locale=${l||'en'}`),
  getOne: (id,l) => api.get(`/tracks/${id}?locale=${l||'en'}`),
};

export const pricingService = {
  calculate: d => api.post('/pricing/calculate', d),
  getRules:  ()  => api.get('/pricing/rules'),
};

export const enrollmentService = {
  create:    d   => api.post('/enrollments', d),
  getByRef:  ref => api.get(`/enrollments/${ref}`),
};
