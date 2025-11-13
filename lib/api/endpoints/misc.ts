import { apiFetch } from '../core/apiFetch';
import type { 
  ConfirmBookingRequest,
  DeclineBookingRequest,
  Booking,
  DashboardData
} from '../types';

/**
 * Booking & Miscellaneous API endpoints
 */

/**
 * Create checkout session
 * @param packageId Package ID
 * @returns Checkout session data
 */
export const createCheckoutSession = (packageId: string) => 
  apiFetch('/checkout/session', {
    method: 'POST',
    body: JSON.stringify({ packageId })
  });

/**
 * Get dashboard data
 * @returns Dashboard data
 */
export const getDashboard = (): Promise<DashboardData> => 
  apiFetch('/dashboard').then(res => {
    // console.log('api response for getDashboard', JSON.stringify(res.data, null, 2));
    return res.data;
  });

/**
 * Get client dashboard
 * @returns Client dashboard data
 */
export const getClientDashboard = () => 
  apiFetch('/client/dashboard').then(res => {
    console.log('api response for getClientDashboard', JSON.stringify(res.data, null, 2));
    return res.data;
  });

/**
 * Create booking
 * @param request Booking data
 * @returns Created booking
 */
export const createBooking = (request: any): Promise<Booking> => 
  apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get booking details
 * @param bookingId Booking ID
 * @returns Booking details
 */
export const getBookingDetails = (bookingId: string): Promise<Booking> => 
  apiFetch(`/bookings/${bookingId}`);

/**
 * Get user bookings
 * @returns List of user bookings
 */
export const getUserBookings = () => 
  apiFetch('/bookings/my-bookings');

/**
 * Confirm booking
 * @param bookingId Booking ID
 * @returns Confirmation result
 */
export const confirmBooking = (bookingId: string): Promise<void> => 
  apiFetch(`/bookings/${bookingId}/confirm`, {
    method: 'PUT'
  });

/**
 * Decline booking
 * @param bookingId Booking ID
 * @returns Declination result
 */
export const declineBooking = (bookingId: string): Promise<void> => 
  apiFetch(`/bookings/${bookingId}/decline`, {
    method: 'PUT'
  });

/**
 * Cancel booking
 * @param bookingId Booking ID
 * @returns Cancellation result
 */
export const cancelBooking = (bookingId: string): Promise<void> => 
  apiFetch(`/bookings/${bookingId}/cancel`, {
    method: 'PUT'
  });

/**
 * Reschedule booking
 * @param bookingId Booking ID
 * @param request Reschedule data
 * @returns Rescheduled booking
 */
export const rescheduleBooking = (bookingId: string, request: { new_date: string; new_time: string }): Promise<Booking> => 
  apiFetch(`/bookings/${bookingId}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get available time slots for booking
 * @param date Date to check
 * @param trainerId Trainer ID
 * @returns Available time slots
 */
export const getAvailableTimeSlots = (date: string, trainerId: string) => 
  apiFetch(`/trainers/${trainerId}/availability`, {
    params: { date }
  });

/**
 * Get booking packages
 * @returns List of booking packages
 */
export const getBookingPackages = () => 
  apiFetch('/packages');

/**
 * Get package details
 * @param packageId Package ID
 * @returns Package details
 */
export const getPackageDetails = (packageId: string) => 
  apiFetch(`/packages/${packageId}`);

/**
 * Process payment
 * @param request Payment data
 * @returns Payment result
 */
export const processPayment = (request: { amount: number; currency: string; payment_method_id: string }) => 
  apiFetch('/payments/process', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get payment methods
 * @returns List of payment methods
 */
export const getPaymentMethods = () => 
  apiFetch('/payment-methods');

/**
 * Add payment method
 * @param request Payment method data
 * @returns Added payment method
 */
export const addPaymentMethod = (request: { payment_method_id: string }) => 
  apiFetch('/payment-methods', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Remove payment method
 * @param paymentMethodId Payment method ID
 * @returns Removal result
 */
export const removePaymentMethod = (paymentMethodId: string): Promise<void> => 
  apiFetch(`/payment-methods/${paymentMethodId}`, {
    method: 'DELETE'
  });

/**
 * Get payment history
 * @returns Payment history
 */
export const getPaymentHistory = () => 
  apiFetch('/payments/history');

/**
 * Get payment details
 * @param paymentId Payment ID
 * @returns Payment details
 */
export const getPaymentDetails = (paymentId: string) => 
  apiFetch(`/payments/${paymentId}`);

/**
 * Refund payment
 * @param paymentId Payment ID
 * @param request Refund data
 * @returns Refund result
 */
export const refundPayment = (paymentId: string, request: { amount?: number; reason?: string }) => 
  apiFetch(`/payments/${paymentId}/refund`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get refund history
 * @returns Refund history
 */
export const getRefundHistory = () => 
  apiFetch('/refunds');

/**
 * Get refund details
 * @param refundId Refund ID
 * @returns Refund details
 */
export const getRefundDetails = (refundId: string) => 
  apiFetch(`/refunds/${refundId}`);

/**
 * Get system settings
 * @returns System settings
 */
export const getSystemSettings = () => 
  apiFetch('/settings');

/**
 * Update system settings
 * @param request Settings data
 * @returns Updated settings
 */
export const updateSystemSettings = (request: any) => 
  apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get system status
 * @returns System status
 */
export const getSystemStatus = () => 
  apiFetch('/status');

/**
 * Get system logs
 * @returns System logs
 */
export const getSystemLogs = () => 
  apiFetch('/logs');

/**
 * Get log details
 * @param logId Log ID
 * @returns Log details
 */
export const getLogDetails = (logId: string) => 
  apiFetch(`/logs/${logId}`);

/**
 * Download log file
 * @param logId Log ID
 * @returns Log file download
 */
export const downloadLogFile = (logId: string) => 
  apiFetch(`/logs/${logId}/download`);

/**
 * Get analytics data
 * @param params Analytics parameters
 * @returns Analytics data
 */
export const getAnalytics = (params?: { 
  start_date?: string; 
  end_date?: string; 
  metric?: string; 
  group_by?: string 
}) => 
  apiFetch('/analytics', {
    params
  });

/**
 * Get analytics summary
 * @param params Summary parameters
 * @returns Analytics summary
 */
export const getAnalyticsSummary = (params?: { 
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year'; 
  start_date?: string; 
  end_date?: string 
}) => 
  apiFetch('/analytics/summary', {
    params
  });

/**
 * Export analytics data
 * @param params Export parameters
 * @returns Export result
 */
export const exportAnalytics = (params: { 
  format: 'csv' | 'json' | 'pdf'; 
  start_date: string; 
  end_date: string; 
  metrics: string[] 
}) => 
  apiFetch('/analytics/export', {
    method: 'POST',
    body: JSON.stringify(params)
  });

/**
 * Get system metrics
 * @returns System metrics
 */
export const getSystemMetrics = () => 
  apiFetch('/metrics');

/**
 * Get real-time metrics
 * @returns Real-time metrics
 */
export const getRealTimeMetrics = () => 
  apiFetch('/metrics/realtime');

/**
 * Get metric history
 * @param metric Metric name
 * @param params History parameters
 * @returns Metric history
 */
export const getMetricHistory = (metric: string, params?: { 
  start_date?: string; 
  end_date?: string; 
  interval?: 'minute' | 'hour' | 'day' 
}) => 
  apiFetch(`/metrics/${metric}/history`, {
    params
  });