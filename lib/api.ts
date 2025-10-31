import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'; // Mock URL for now

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        // Attempt to parse error JSON from backend
        try {
            const errorJson = JSON.parse(errorBody);
            throw new Error(errorJson.message || `Network response was not ok: ${response.statusText}`);
        } catch (e) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    }

    if (response.status === 204) { // No Content
        return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch API:", error);
    throw error;
  }
};

// == Client API ==
export const getMe = async () => {
    console.log('Fetching user profile from /api/auth/me');
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return { role: 'client' }; // Mock response, change to 'trainer' to test trainer flow
};

export const register = async (payload: Record<string, any>) => {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

// == Trainer API ==
export const getTrainerDashboard = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { upcomingAppointments: 5, activeClients: 10 };
}

export const getClients = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Array.from({ length: 15 }, (_, i) => ({
        id: `client_${i}`,
        name: `Client #${i + 1}`,
        avatar_url: `https://i.pravatar.cc/150?u=client${i}`
    }))
}

export const getCalendarEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    return {
        [dateString]: [{ name: 'Session with Client #1' }, { name: 'Check-in with Client #3' }]
    }
}

export const planSession = async (payload: { date: string, title: string }) => {
    console.log("Planning session:", payload);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, ...payload };
};

// == Payments API ==
export const createCheckoutSession = async (packageId: string) => {
    console.log(`Requesting checkout session for package: ${packageId}`);
    // This would typically return a real Stripe URL
    // return apiFetch('/checkout/session', { method: 'POST', body: JSON.stringify({ packageId }) });
    await new Promise(resolve => setTimeout(resolve, 700));
    return { url: 'https://stripe.com/docs/testing' }; // Mock Stripe URL
};

// == Notifications API ==
export const sendPushToken = async (token: string) => {
    console.log(`Sending push token to backend: ${token}`);
    // return apiFetch('/profile/me/push-token', { method: 'POST', body: JSON.stringify({ token }) });
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
};
      