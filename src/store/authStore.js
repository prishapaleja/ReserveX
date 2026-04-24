import { create } from 'zustand';
import api from '../api/axios';

// Helper to safely parse user from localStorage on refresh
const getInitialUser = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

const useAuthStore = create((set) => ({
    // Load from localStorage on fresh page reloads
    user: getInitialUser(),
    token: localStorage.getItem('token') || null,

    checkAuth: async () => {
        try {
            const response = await api.get('/auth/me');
            set({ user: response.data });
        } catch (error) {
            set({ user: null, token: null });
        }
    },

    login: (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, token: token });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
