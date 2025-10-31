import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL; // e.g., your Next.js API

const api = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch API:", error);
    throw error;
  }
};

export default api;
      