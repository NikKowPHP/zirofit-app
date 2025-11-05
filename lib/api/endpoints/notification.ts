import { apiFetch } from '../core/apiFetch';
import type { 
  UpdateNotificationRequest,
  HandleStripeWebhookRequest,
  Notification
} from '../types';

/**
 * Notification & Webhook API endpoints
 */

/**
 * Get notifications
 * @returns List of notifications
 */
export const getNotifications = (): Promise<Notification[]> => 
  apiFetch('/notifications');

/**
 * Get notification details
 * @param notificationId Notification ID
 * @returns Notification details
 */
export const getNotificationDetails = (notificationId: string): Promise<Notification> => 
  apiFetch(`/notifications/${notificationId}`);

/**
 * Update notification
 * @param notificationId Notification ID
 * @param request Update data
 * @returns Updated notification
 */
export const updateNotification = (notificationId: string, request: UpdateNotificationRequest): Promise<Notification> => 
  apiFetch(`/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Mark notification as read
 * @param notificationId Notification ID
 * @returns Update result
 */
export const markNotificationAsRead = (notificationId: string): Promise<void> => 
  apiFetch(`/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify({ is_read: true })
  });

/**
 * Mark all notifications as read
 * @returns Update result
 */
export const markAllNotificationsAsRead = (): Promise<void> => 
  apiFetch('/notifications/read-all', {
    method: 'PUT'
  });

/**
 * Delete notification
 * @param notificationId Notification ID
 * @returns Deletion result
 */
export const deleteNotification = (notificationId: string): Promise<void> => 
  apiFetch(`/notifications/${notificationId}`, {
    method: 'DELETE'
  });

/**
 * Handle Stripe webhook
 * @param request Webhook data
 * @returns Webhook handling result
 */
export const handleStripeWebhook = (request: HandleStripeWebhookRequest) => 
  apiFetch('/webhooks/stripe', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get webhook logs
 * @returns List of webhook logs
 */
export const getWebhookLogs = () => 
  apiFetch('/webhooks/logs');

/**
 * Get webhook log details
 * @param logId Log ID
 * @returns Webhook log details
 */
export const getWebhookLogDetails = (logId: string) => 
  apiFetch(`/webhooks/logs/${logId}`);

/**
 * Retry webhook
 * @param logId Log ID
 * @returns Retry result
 */
export const retryWebhook = (logId: string) => 
  apiFetch(`/webhooks/logs/${logId}/retry`, {
    method: 'POST'
  });

/**
 * Get notification settings
 * @returns Notification settings
 */
export const getNotificationSettings = () => 
  apiFetch('/profile/me/notification-settings');

/**
 * Update notification settings
 * @param request Settings data
 * @returns Updated settings
 */
export const updateNotificationSettings = (request: any) => 
  apiFetch('/profile/me/notification-settings', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get notification preferences
 * @returns Notification preferences
 */
export const getNotificationPreferences = () => 
  apiFetch('/profile/me/notification-preferences');

/**
 * Update notification preferences
 * @param request Preferences data
 * @returns Updated preferences
 */
export const updateNotificationPreferences = (request: any) => 
  apiFetch('/profile/me/notification-preferences', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Subscribe to notifications
 * @param request Subscription data
 * @returns Subscription result
 */
export const subscribeToNotifications = (request: { type: string; endpoint: string; keys: any }) => 
  apiFetch('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Unsubscribe from notifications
 * @param subscriptionId Subscription ID
 * @returns Unsubscription result
 */
export const unsubscribeFromNotifications = (subscriptionId: string): Promise<void> => 
  apiFetch(`/notifications/unsubscribe/${subscriptionId}`, {
    method: 'DELETE'
  });

/**
 * Get notification templates
 * @returns List of notification templates
 */
export const getNotificationTemplates = () => 
  apiFetch('/notifications/templates');

/**
 * Create notification template
 * @param request Template data
 * @returns Created template
 */
export const createNotificationTemplate = (request: any) => 
  apiFetch('/notifications/templates', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update notification template
 * @param templateId Template ID
 * @param request Update data
 * @returns Updated template
 */
export const updateNotificationTemplate = (templateId: string, request: any) => 
  apiFetch(`/notifications/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete notification template
 * @param templateId Template ID
 * @returns Deletion result
 */
export const deleteNotificationTemplate = (templateId: string): Promise<void> => 
  apiFetch(`/notifications/templates/${templateId}`, {
    method: 'DELETE'
  });