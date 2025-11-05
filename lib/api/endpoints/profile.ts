import { apiFetch } from '../core/apiFetch';
import type { 
  UpdateTrainerCoreInfoRequest,
  AddTrainerServiceRequest,
  UpdateTrainerServiceRequest,
  AddTrainerPackageRequest,
  UpdateTrainerPackageRequest,
  AddTrainerTestimonialRequest,
  UpdateTrainerTestimonialRequest,
  UploadTransformationPhotoRequest,
  UpdateProfileTextContentRequest,
  AddSocialLinkRequest,
  UpdateSocialLinkRequest,
  AddExternalLinkRequest,
  UpdateExternalLinkRequest,
  AddProfileBenefitRequest,
  UpdateProfileBenefitRequest,
  OrderProfileBenefitsRequest,
  UpdateProfileAvailabilityRequest,
  AddProfileExerciseRequest,
  UpdateProfileExerciseRequest,
  ProfileCoreInfo,
  ProfileTextContent,
  SocialLink,
  ExternalLink,
  ProfileBenefit,
  ProfileExercise,
  ProfileAvailability,
  TrainerService,
  TrainerPackage,
  TrainerTestimonial
} from '../types';

/**
 * Profile Management API endpoints
 */

/**
 * Get profile information
 * @returns Profile data
 */
export const getProfile = () => 
  apiFetch('/profile/me');

/**
 * Get profile core information
 * @returns Profile core information
 */
export const getProfileCoreInfo = (): Promise<ProfileCoreInfo> => 
  apiFetch('/profile/me/core-info');

/**
 * Update profile core information
 * @param request Core info update data
 * @returns Updated profile core information
 */
export const updateProfileCoreInfo = (request: UpdateTrainerCoreInfoRequest): Promise<ProfileCoreInfo> => 
  apiFetch('/profile/me/core-info', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get profile text content
 * @returns Profile text content
 */
export const getProfileTextContent = (): Promise<ProfileTextContent> => 
  apiFetch('/profile/me/text-content');

/**
 * Update profile text content
 * @param request Text content update data
 * @returns Updated profile text content
 */
export const updateProfileTextContent = (request: UpdateProfileTextContentRequest): Promise<ProfileTextContent> => 
  apiFetch('/profile/me/text-content', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get profile social links
 * @returns List of social links
 */
export const getProfileSocialLinks = (): Promise<SocialLink[]> => 
  apiFetch('/profile/me/social-links');

/**
 * Add social link
 * @param request Social link data
 * @returns Created social link
 */
export const addSocialLink = (request: AddSocialLinkRequest): Promise<SocialLink> => 
  apiFetch('/profile/me/social-links', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update social link
 * @param linkId Link ID
 * @param request Update data
 * @returns Updated social link
 */
export const updateSocialLink = (linkId: string, request: UpdateSocialLinkRequest): Promise<SocialLink> => 
  apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete social link
 * @param linkId Link ID
 * @returns Deletion result
 */
export const deleteSocialLink = (linkId: string): Promise<void> => 
  apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'DELETE'
  });

/**
 * Get profile external links
 * @returns List of external links
 */
export const getProfileExternalLinks = (): Promise<ExternalLink[]> => 
  apiFetch('/profile/me/external-links');

/**
 * Add external link
 * @param request External link data
 * @returns Created external link
 */
export const addExternalLink = (request: AddExternalLinkRequest): Promise<ExternalLink> => 
  apiFetch('/profile/me/external-links', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update external link
 * @param linkId Link ID
 * @param request Update data
 * @returns Updated external link
 */
export const updateExternalLink = (linkId: string, request: UpdateExternalLinkRequest): Promise<ExternalLink> => 
  apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete external link
 * @param linkId Link ID
 * @returns Deletion result
 */
export const deleteExternalLink = (linkId: string): Promise<void> => 
  apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'DELETE'
  });

/**
 * Get profile benefits
 * @returns List of benefits
 */
export const getProfileBenefits = (): Promise<ProfileBenefit[]> => 
  apiFetch('/profile/me/benefits');

/**
 * Add profile benefit
 * @param request Benefit data
 * @returns Created benefit
 */
export const addProfileBenefit = (request: AddProfileBenefitRequest): Promise<ProfileBenefit> => 
  apiFetch('/profile/me/benefits', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update profile benefit
 * @param benefitId Benefit ID
 * @param request Update data
 * @returns Updated benefit
 */
export const updateProfileBenefit = (benefitId: string, request: UpdateProfileBenefitRequest): Promise<ProfileBenefit> => 
  apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete profile benefit
 * @param benefitId Benefit ID
 * @returns Deletion result
 */
export const deleteProfileBenefit = (benefitId: string): Promise<void> => 
  apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'DELETE'
  });

/**
 * Order profile benefits
 * @param request Order data
 * @returns Ordering result
 */
export const orderProfileBenefits = (request: OrderProfileBenefitsRequest): Promise<void> => 
  apiFetch('/profile/me/benefits/order', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get profile availability
 * @returns Profile availability
 */
export const getProfileAvailability = (): Promise<ProfileAvailability[]> => 
  apiFetch('/profile/me/availability');

/**
 * Update profile availability
 * @param request Availability data
 * @returns Updated availability
 */
export const updateProfileAvailability = (request: UpdateProfileAvailabilityRequest): Promise<ProfileAvailability[]> => 
  apiFetch('/profile/me/availability', {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Get profile exercises
 * @returns List of profile exercises
 */
export const getProfileExercises = (): Promise<ProfileExercise[]> => 
  apiFetch('/profile/me/exercises');

/**
 * Add profile exercise
 * @param request Exercise data
 * @returns Created exercise
 */
export const addProfileExercise = (request: AddProfileExerciseRequest): Promise<ProfileExercise> => 
  apiFetch('/profile/me/exercises', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update profile exercise
 * @param exerciseId Exercise ID
 * @param request Update data
 * @returns Updated exercise
 */
export const updateProfileExercise = (exerciseId: string, request: UpdateProfileExerciseRequest): Promise<ProfileExercise> => 
  apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete profile exercise
 * @param exerciseId Exercise ID
 * @returns Deletion result
 */
export const deleteProfileExercise = (exerciseId: string): Promise<void> => 
  apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'DELETE'
  });

/**
 * Get profile transformation photos
 * @returns List of transformation photos
 */
export const getTransformationPhotos = (): Promise<any[]> => 
  apiFetch('/profile/me/transformation-photos');

/**
 * Upload transformation photo
 * @param request Photo upload data
 * @returns Uploaded photo
 */
export const uploadTransformationPhoto = (request: UploadTransformationPhotoRequest): Promise<any> => 
  apiFetch('/profile/me/transformation-photos', {
    method: 'POST',
    body: request.formData
  });

/**
 * Delete transformation photo
 * @param photoId Photo ID
 * @returns Deletion result
 */
export const deleteTransformationPhoto = (photoId: string): Promise<void> => 
  apiFetch(`/profile/me/transformation-photos/${photoId}`, {
    method: 'DELETE'
  });

/**
 * Get profile testimonials
 * @returns List of testimonials
 */
export const getProfileTestimonials = (): Promise<TrainerTestimonial[]> => 
  apiFetch('/profile/me/testimonials');

/**
 * Add testimonial
 * @param request Testimonial data
 * @returns Created testimonial
 */
export const addTrainerTestimonial = (request: AddTrainerTestimonialRequest): Promise<TrainerTestimonial> => 
  apiFetch('/profile/me/testimonials', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update testimonial
 * @param testimonialId Testimonial ID
 * @param request Update data
 * @returns Updated testimonial
 */
export const updateTrainerTestimonial = (testimonialId: string, request: UpdateTrainerTestimonialRequest): Promise<TrainerTestimonial> => 
  apiFetch(`/profile/me/testimonials/${testimonialId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete testimonial
 * @param testimonialId Testimonial ID
 * @returns Deletion result
 */
export const deleteTrainerTestimonial = (testimonialId: string): Promise<void> => 
  apiFetch(`/profile/me/testimonials/${testimonialId}`, {
    method: 'DELETE'
  });

/**
 * Get profile services
 * @returns List of services
 */
export const getProfileServices = (): Promise<TrainerService[]> => 
  apiFetch('/profile/me/services');

/**
 * Add service
 * @param request Service data
 * @returns Created service
 */
export const addTrainerService = (request: AddTrainerServiceRequest): Promise<TrainerService> => 
  apiFetch('/profile/me/services', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update service
 * @param serviceId Service ID
 * @param request Update data
 * @returns Updated service
 */
export const updateTrainerService = (serviceId: string, request: UpdateTrainerServiceRequest): Promise<TrainerService> => 
  apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete service
 * @param serviceId Service ID
 * @returns Deletion result
 */
export const deleteTrainerService = (serviceId: string): Promise<void> => 
  apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'DELETE'
  });

/**
 * Get profile packages
 * @returns List of packages
 */
export const getProfilePackages = (): Promise<TrainerPackage[]> => 
  apiFetch('/profile/me/packages');

/**
 * Add package
 * @param request Package data
 * @returns Created package
 */
export const addTrainerPackage = (request: AddTrainerPackageRequest): Promise<TrainerPackage> => 
  apiFetch('/profile/me/packages', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update package
 * @param packageId Package ID
 * @param request Update data
 * @returns Updated package
 */
export const updateTrainerPackage = (packageId: string, request: UpdateTrainerPackageRequest): Promise<TrainerPackage> => 
  apiFetch(`/profile/me/packages/${packageId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete package
 * @param packageId Package ID
 * @returns Deletion result
 */
export const deleteTrainerPackage = (packageId: string): Promise<void> => 
  apiFetch(`/profile/me/packages/${packageId}`, {
    method: 'DELETE'
  });

/**
 * Send push token
 * @param token Push token
 * @returns Update result
 */
export const sendPushToken = (token: string) => 
  apiFetch('/profile/me/push-token', {
    method: 'POST',
    body: JSON.stringify({ token })
  });