import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);

// Profile
export const getProfile    = ()       => api.get('/profile');
export const updateProfile = (data)   => api.put('/profile', data);

// Skills
export const getSkills   = ()       => api.get('/skills');
export const addSkill    = (data)   => api.post('/skills', data);
export const deleteSkill = (id)     => api.delete(`/skills/${id}`);

// Projects
export const getProjects    = ()          => api.get('/projects');
export const addProject     = (data)      => api.post('/projects', data);
export const updateProject  = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject  = (id)       => api.delete(`/projects/${id}`);

// Experience
export const getExperience   = ()     => api.get('/experience');
export const addExperience   = (data) => api.post('/experience', data);
export const deleteExperience = (id)  => api.delete(`/experience/${id}`);

// Contact
export const sendContact = (data) => api.post('/contact', data);

export default api;
