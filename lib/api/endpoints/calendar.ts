import { apiFetch } from '../core/apiFetch';
import type { 
  PlanSessionRequest,
  UpdateCalendarSessionRequest,
  DeleteCalendarSessionRequest,
  SendSessionReminderRequest,
  CalendarEvent
} from '../types';

/**
 * Calendar Management API endpoints
 */

/**
 * Get calendar events
 * @param params Calendar parameters
 * @returns List of calendar events
 */
export const getCalendarEvents = (params: { startDate: string; endDate: string }) =>
  apiFetch('/trainer/calendar', {
    params
  });
/**
 * Plan a new session
 * @param request Session planning data
 * @returns Created calendar event
 */
export const planSession = (request: PlanSessionRequest): Promise<CalendarEvent> => 
  apiFetch('/trainer/calendar', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update calendar session
 * @param sessionId Session ID
 * @param request Update data
 * @returns Updated calendar event
 */
export const updateCalendarSession = (sessionId: string, request: UpdateCalendarSessionRequest): Promise<CalendarEvent> => 
  apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete calendar session
 * @param sessionId Session ID
 * @returns Deletion result
 */
export const deleteCalendarSession = (sessionId: string): Promise<void> => 
  apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'DELETE'
  });

/**
 * Send session reminder
 * @param sessionId Session ID
 * @returns Reminder result
 */
export const sendSessionReminder = (sessionId: string): Promise<void> => 
  apiFetch(`/trainer/calendar/sessions/${sessionId}/remind`, {
    method: 'POST'
  });

/**
 * Get upcoming sessions
 * @returns List of upcoming sessions
 */
export const getUpcomingSessions = () => 
  apiFetch('/trainer/calendar/upcoming');

/**
 * Get session details
 * @param sessionId Session ID
 * @returns Session details
 */
export const getSessionDetails = (sessionId: string): Promise<CalendarEvent> => 
  apiFetch(`/trainer/calendar/${sessionId}`);

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
 * Get available time slots
 * @param date Date to check
 * @param trainerId Trainer ID
 * @returns List of available time slots
 */
export const getAvailableTimeSlots = (date: string, trainerId: string) => 
  apiFetch(`/trainer/${trainerId}/availability`, {
    params: { date }
  });

/**
 * Block time slot
 * @param request Time slot data
 * @returns Blocking result
 */
export const blockTimeSlot = (request: { date: string; startTime: string; endTime: string; reason?: string }) => 
  apiFetch('/trainer/availability', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Unblock time slot
 * @param availabilityId Availability ID
 * @returns Unblocking result
 */
export const unblockTimeSlot = (availabilityId: string): Promise<void> => 
  apiFetch(`/trainer/availability/${availabilityId}`, {
    method: 'DELETE'
  });

/**
 * Get trainer availability
 * @param trainerId Trainer ID
 * @param dateRange Date range
 * @returns Trainer availability
 */
export const getTrainerAvailability = (trainerId: string, dateRange?: { start_date: string; end_date: string }) => 
  apiFetch(`/trainer/${trainerId}/availability`, {
    params: dateRange
  });