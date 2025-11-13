import { apiFetch } from '../core/apiFetch';
import type { 
  CreateClientRequest,
  RequestClientLinkRequest,
  LogClientExerciseRequest,
  Client,
  ClientAssessment,
  ClientMeasurement,
  ClientPhoto,
  ClientExerciseLog,
  ProgressData
} from '../types';

/**
 * Client Management API endpoints
 */

/**
 * Get all clients
 * @returns List of clients
 */
export const getClients = (): Promise<Client[]> => 
  apiFetch('/clients').then(res => {
    // console.log('api response for getClients', JSON.stringify(res.data.clients, null, 2));
    return res.data.clients;
  });

/**
 * Create a new client
 * @param request Client creation data
 * @returns Created client
 */
export const createClient = (request: CreateClientRequest): Promise<Client> => 
  apiFetch('/clients', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get client details by ID
 * @param clientId Client ID
 * @returns Client details
 */
export const getClientDetails = (clientId: string): Promise<Client> => 
  apiFetch(`/clients/${clientId}`);

/**
 * Update client details
 * @param clientId Client ID
 * @param request Client update data
 * @returns Updated client
 */
export const updateClient = (clientId: string, request: Partial<Client>): Promise<Client> => 
  apiFetch(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete a client
 * @param clientId Client ID
 * @returns Deletion result
 */
export const deleteClient = (clientId: string) => 
  apiFetch(`/clients/${clientId}`, {
    method: 'DELETE'
  });

/**
 * Request client link
 * @param request Link request data
 * @returns Link result
 */
export const requestClientLink = (request: RequestClientLinkRequest) => 
  apiFetch('/clients/request-link', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get client photos
 * @param clientId Client ID
 * @returns List of client photos
 */
export const getClientPhotos = (clientId: string): Promise<ClientPhoto[]> => 
  apiFetch(`/clients/${clientId}/photos`);

/**
 * Upload client photo
 * @param clientId Client ID
 * @param formData Photo data
 * @returns Uploaded photo
 */
export const uploadClientPhoto = (clientId: string, formData: FormData): Promise<ClientPhoto> => 
  apiFetch(`/clients/${clientId}/photos`, {
    method: 'POST',
    body: formData
  });

/**
 * Delete client photo
 * @param clientId Client ID
 * @param photoId Photo ID
 * @returns Deletion result
 */
export const deleteClientPhoto = (clientId: string, photoId: string) => 
  apiFetch(`/clients/${clientId}/photos/${photoId}`, {
    method: 'DELETE'
  });

/**
 * Get client measurements
 * @param clientId Client ID
 * @returns List of client measurements
 */
export const getClientMeasurements = (clientId: string): Promise<ClientMeasurement[]> => 
  apiFetch(`/clients/${clientId}/measurements`);

/**
 * Add client measurement
 * @param clientId Client ID
 * @param request Measurement data
 * @returns Created measurement
 */
export const addClientMeasurement = (clientId: string, request: Omit<ClientMeasurement, 'id' | 'client_id' | 'measured_at'>): Promise<ClientMeasurement> => 
  apiFetch(`/clients/${clientId}/measurements`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update client measurement
 * @param clientId Client ID
 * @param measurementId Measurement ID
 * @param request Measurement update data
 * @returns Updated measurement
 */
export const updateClientMeasurement = (clientId: string, measurementId: string, request: Partial<ClientMeasurement>): Promise<ClientMeasurement> => 
  apiFetch(`/clients/${clientId}/measurements/${measurementId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete client measurement
 * @param clientId Client ID
 * @param measurementId Measurement ID
 * @returns Deletion result
 */
export const deleteClientMeasurement = (clientId: string, measurementId: string) => 
  apiFetch(`/clients/${clientId}/measurements/${measurementId}`, {
    method: 'DELETE'
  });

/**
 * Get client assessments
 * @param clientId Client ID
 * @returns List of client assessments
 */
export const getClientAssessments = (clientId: string): Promise<ClientAssessment[]> => 
  apiFetch(`/clients/${clientId}/assessments`);

/**
 * Add client assessment
 * @param clientId Client ID
 * @param request Assessment data
 * @returns Created assessment
 */
export const addClientAssessment = (clientId: string, request: Omit<ClientAssessment, 'id' | 'client_id' | 'assessment_date'>): Promise<ClientAssessment> => 
  apiFetch(`/clients/${clientId}/assessments`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update client assessment
 * @param clientId Client ID
 * @param assessmentId Assessment ID
 * @param request Assessment update data
 * @returns Updated assessment
 */
export const updateClientAssessment = (clientId: string, assessmentId: string, request: Partial<ClientAssessment>): Promise<ClientAssessment> => 
  apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete client assessment
 * @param clientId Client ID
 * @param assessmentId Assessment ID
 * @returns Deletion result
 */
export const deleteClientAssessment = (clientId: string, assessmentId: string) => 
  apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, {
    method: 'DELETE'
  });

/**
 * Log client exercise
 * @param request Exercise log data
 * @returns Created exercise log
 */
export const logClientExercise = (request: LogClientExerciseRequest): Promise<ClientExerciseLog> => 
  apiFetch(`/clients/${request.client_id}/exercise-logs`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get client progress data
 * @param clientId Client ID
 * @param params Progress parameters
 * @returns Progress data
 */
export const getProgressData = (clientId?: string, params?: { period?: 'week' | 'month' | 'quarter' | 'year' }): Promise<ProgressData> => 
  apiFetch(clientId ? `/clients/${clientId}/progress` : '/client/progress', {
    params
  });

/**
 * Get client dashboard
 * @returns Client dashboard data
 */
export const getClientDashboard = () => 
  apiFetch('/client/dashboard');

/**
 * Link client to trainer
 * @param request Link data
 * @returns Link result
 */
export const linkToTrainer = (request: { trainer_id: string }) => 
  apiFetch('/client/trainer/link', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Unlink client from trainer
 * @returns Unlink result
 */
export const unlinkFromTrainer = () => 
  apiFetch('/client/trainer/link', {
    method: 'DELETE'
  });

/**
 * Get client's trainer
 * @returns Trainer information
 */
export const getMyTrainer = () => 
  apiFetch('/client/trainer');