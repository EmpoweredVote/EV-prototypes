/**
 * Backend API Client
 *
 * Replaces the Google Apps Script API with calls to EV-Backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.empowered.vote';

interface FetchOptions extends RequestInit {
  body?: string;
}

/**
 * Helper function for API requests with session authentication
 */
async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Include session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json();
}

// Types matching the backend models
export interface StagingStance {
  id: string;
  context_key: string;
  politician_external_id?: string;
  politician_name: string;
  topic_key: string;
  value: number;
  reasoning: string;
  sources: string[];
  status: 'draft' | 'needs_review' | 'approved' | 'rejected';
  added_by: string;
  review_count: number;
  reviewed_by: string[];
  locked_by?: string;
  locked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactEntry {
  type: string;
  value: string;
  source?: string;
}

export interface DegreeEntry {
  degree: string;
  major?: string;
  school: string;
  grad_year?: string;
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  type?: string;
  start?: string;
  end?: string;
}

export interface StagingPolitician {
  id: string;
  external_id?: string;
  full_name: string;
  party: string;
  office: string;
  office_level: string;
  state: string;
  district: string;
  bio_text?: string;
  photo_url?: string;
  contacts?: ContactEntry[];
  degrees?: DegreeEntry[];
  experiences?: ExperienceEntry[];
  // Extended fields
  urls?: string[];
  web_form_url?: string;
  images?: Array<{ url: string; type: string }>;
  addresses?: Array<{
    address_1?: string;
    address_2?: string;
    state?: string;
    postal_code?: string;
    phone_1?: string;
    phone_2?: string;
  }>;
  valid_from?: string;
  valid_to?: string;
  total_years_in_office?: number;
  office_description?: string;
  office_seats?: number;
  partisan_type?: string;
  salary?: string;
  normalized_position_name?: string;
  district_type?: string;
  district_ocd_id?: string;
  district_geo_id?: string;
  chamber_name?: string;
  term_limit?: string;
  term_length?: string;
  election_frequency?: string;
  is_appointed?: boolean;
  is_vacant?: boolean;
  status: 'draft' | 'pending' | 'needs_review' | 'approved' | 'rejected' | 'merged';
  added_by: string;
  review_count: number;
  reviewed_by: string[];
  last_reviewed_at?: string;
  locked_by?: string;
  locked_at?: string;
  approved_at?: string;
  merged_to_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EssentialsPoliticianFull {
  // Core identity
  id: string;
  external_id: number;
  first_name: string;
  middle_initial: string;
  last_name: string;
  preferred_name: string;
  name_suffix: string;
  full_name: string;
  party: string;
  party_short_name?: string;

  // Photos & links
  photo_origin_url: string;
  web_form_url: string;
  urls: string[];
  email_addresses: string[];

  // Office
  office_title: string;
  representing_state: string;
  representing_city: string;
  office_description?: string;
  seats?: number;
  normalized_position_name?: string;
  partisan_type?: string;
  salary?: string;

  // District/Geo
  district_type: string;
  district_label: string;
  district_id?: string;
  geo_id?: string;
  ocd_id?: string;
  mtfcc?: string;
  is_judicial?: boolean;

  // Chamber/Government
  chamber_name: string;
  chamber_name_formal: string;
  government_name: string;
  election_frequency?: string;

  // Status flags
  is_elected: boolean;
  is_appointed?: boolean;
  is_vacant?: boolean;
  is_off_cycle?: boolean;
  specificity?: string;

  // Bio
  bio_text?: string;
  bioguide_id?: string;
  slug?: string;
  total_years_in_office?: number;

  // Term dates
  term_start?: string;
  term_end?: string;

  // Related data
  images?: Array<{ url: string; type: string }>;
  degrees?: Array<{ degree: string; major: string; school: string; grad_year: number }>;
  experiences?: Array<{ title: string; organization: string; type: string; start: string; end: string }>;
  committees?: Array<{ name: string; position: string; urls: string[] }>;

  // Profile-specific (from PoliticianProfileOut)
  addresses?: Array<{
    id: string;
    address_1: string;
    address_2: string;
    address_3: string;
    state: string;
    postal_code: string;
    phone_1: string;
    phone_2: string;
  }>;
  identifiers?: Array<{
    identifier_type: string;
    identifier_value: string;
  }>;
  notes?: string[];
}

export interface Topic {
  id: string;
  topic_key: string;
  title: string;
  short_title: string;
  start_phrase: string;
  stances: Array<{ id: string; value: number; text: string }>;
}

export interface AllData {
  stances: StagingStance[];
  politicians: StagingPolitician[];
  topics: Topic[];
}

/**
 * Fetch all data (politicians, stances, topics)
 */
export async function getData(): Promise<AllData> {
  return fetchAPI<AllData>('/staging/data');
}

/**
 * Fetch full essentials politician data (all fields from BallotReady)
 */
export async function getEssentialsPolitician(id: string): Promise<EssentialsPoliticianFull> {
  return fetchAPI<EssentialsPoliticianFull>(`/essentials/politician/${id}`);
}

/**
 * Add a new politician
 */
export async function addPolitician(data: {
  external_id?: string;
  full_name: string;
  party: string;
  office: string;
  office_level: string;
  state: string;
  district: string;
  bio_text?: string;
  photo_url?: string;
  contacts?: ContactEntry[];
  degrees?: DegreeEntry[];
  experiences?: ExperienceEntry[];
  urls?: string[];
  web_form_url?: string;
  images?: Array<{ url: string; type: string }>;
  addresses?: Array<{ address_1?: string; address_2?: string; state?: string; postal_code?: string; phone_1?: string; phone_2?: string }>;
  valid_from?: string;
  valid_to?: string;
  total_years_in_office?: number;
  office_description?: string;
  office_seats?: number;
  partisan_type?: string;
  salary?: string;
  normalized_position_name?: string;
  district_type?: string;
  district_ocd_id?: string;
  district_geo_id?: string;
  chamber_name?: string;
  term_limit?: string;
  term_length?: string;
  election_frequency?: string;
  is_appointed?: boolean;
  is_vacant?: boolean;
}): Promise<StagingPolitician> {
  return fetchAPI<StagingPolitician>('/staging/politicians', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing staged politician
 */
export async function updatePolitician(
  id: string,
  data: {
    full_name?: string;
    party?: string;
    office?: string;
    office_level?: string;
    state?: string;
    district?: string;
    bio_text?: string;
    photo_url?: string;
    contacts?: ContactEntry[];
    degrees?: DegreeEntry[];
    experiences?: ExperienceEntry[];
    urls?: string[];
    web_form_url?: string;
    images?: Array<{ url: string; type: string }>;
    addresses?: Array<{ address_1?: string; address_2?: string; state?: string; postal_code?: string; phone_1?: string; phone_2?: string }>;
    valid_from?: string;
    valid_to?: string;
    total_years_in_office?: number;
    office_description?: string;
    office_seats?: number;
    partisan_type?: string;
    salary?: string;
    normalized_position_name?: string;
    district_type?: string;
    district_ocd_id?: string;
    district_geo_id?: string;
    chamber_name?: string;
    term_limit?: string;
    term_length?: string;
    election_frequency?: string;
    is_appointed?: boolean;
    is_vacant?: boolean;
  }
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/politicians/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Add a new stance
 */
export async function addStance(data: {
  politician_external_id?: string;
  politician_name: string;
  topic_key: string;
  value: number;
  reasoning: string;
  sources: string[];
}): Promise<StagingStance> {
  return fetchAPI<StagingStance>('/staging/stances', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing stance
 */
export async function updateStance(
  id: string,
  data: {
    value?: number;
    reasoning?: string;
    sources?: string[];
  }
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/stances/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Submit a stance for review
 */
export async function submitForReview(id: string): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/stances/${id}/submit`, {
    method: 'POST',
  });
}

/**
 * Acquire a lock on a stance
 */
export async function acquireLock(id: string): Promise<{
  locked: boolean;
  locked_by: string;
  expires_at: string;
}> {
  return fetchAPI(`/staging/stances/${id}/lock`, {
    method: 'POST',
  });
}

/**
 * Release a lock on a stance
 */
export async function releaseLock(id: string): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/stances/${id}/lock`, {
    method: 'DELETE',
  });
}

/**
 * Approve a review
 */
export async function approveReview(id: string): Promise<{
  status: string;
  review_count: number;
  approved: boolean;
}> {
  return fetchAPI(`/staging/stances/${id}/approve`, {
    method: 'POST',
  });
}

/**
 * Reject a stance
 */
export async function rejectStance(
  id: string,
  comment?: string
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/stances/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

/**
 * Edit and resubmit a stance
 */
export async function editAndResubmit(
  id: string,
  data: {
    value: number;
    reasoning: string;
    sources: string[];
  }
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/stances/${id}/edit-resubmit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get the review queue (stances needing review)
 */
export async function getReviewQueue(): Promise<StagingStance[]> {
  return fetchAPI<StagingStance[]>('/staging/stances/review-queue');
}

/**
 * Submit a politician for review
 */
export async function submitPoliticianForReview(id: string): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/politicians/${id}/submit`, {
    method: 'POST',
  });
}

/**
 * Approve a politician directly (self-approve flow)
 */
export async function approvePoliticianDirect(id: string): Promise<{
  status: string;
  review_count: number;
  approved: boolean;
}> {
  return fetchAPI(`/staging/politicians/${id}/review-approve`, {
    method: 'POST',
  });
}

/**
 * Get the politician review queue
 */
export async function getPoliticianReviewQueue(): Promise<StagingPolitician[]> {
  return fetchAPI<StagingPolitician[]>('/staging/politicians/review-queue');
}

/**
 * Acquire a lock on a politician
 */
export async function acquirePoliticianLock(id: string): Promise<{
  locked: boolean;
  locked_by: string;
  expires_at: string;
}> {
  return fetchAPI(`/staging/politicians/${id}/lock`, {
    method: 'POST',
  });
}

/**
 * Release a lock on a politician
 */
export async function releasePoliticianLock(id: string): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/politicians/${id}/lock`, {
    method: 'DELETE',
  });
}

/**
 * Approve a politician review
 */
export async function approvePoliticianReview(id: string): Promise<{
  status: string;
  review_count: number;
  approved: boolean;
}> {
  return fetchAPI(`/staging/politicians/${id}/review-approve`, {
    method: 'POST',
  });
}

/**
 * Reject a politician during review
 */
export async function rejectPolitician(
  id: string,
  comment?: string
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/politicians/${id}/review-reject`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

/**
 * Edit and resubmit a politician
 */
export async function editAndResubmitPolitician(
  id: string,
  data: {
    full_name?: string;
    party?: string;
    office?: string;
    office_level?: string;
    state?: string;
    district?: string;
    bio_text?: string;
    photo_url?: string;
    contacts?: ContactEntry[];
    degrees?: DegreeEntry[];
    experiences?: ExperienceEntry[];
    urls?: string[];
    web_form_url?: string;
    images?: Array<{ url: string; type: string }>;
    addresses?: Array<{ address_1?: string; address_2?: string; state?: string; postal_code?: string; phone_1?: string; phone_2?: string }>;
    valid_from?: string;
    valid_to?: string;
    total_years_in_office?: number;
    office_description?: string;
    office_seats?: number;
    partisan_type?: string;
    salary?: string;
    normalized_position_name?: string;
    district_type?: string;
    district_ocd_id?: string;
    district_geo_id?: string;
    chamber_name?: string;
    term_limit?: string;
    term_length?: string;
    election_frequency?: string;
    is_appointed?: boolean;
    is_vacant?: boolean;
  }
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/politicians/${id}/edit-resubmit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Check if user is authenticated
 */
export async function checkAuth(): Promise<{ user_id: string; username: string; completed_onboarding: boolean } | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Register a new account
 */
export async function register(
  username: string,
  password: string
): Promise<{ user_id: string }> {
  return fetchAPI<{ user_id: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

/**
 * Login
 */
export async function login(
  username: string,
  password: string
): Promise<{ user_id: string }> {
  return fetchAPI<{ user_id: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

// Building photo types
export interface JurisdictionGap {
  geo_id: string;
  city: string;
  state: string;
  district_type: string;
  politician_count: number;
}

export interface StagingBuildingPhoto {
  id: string;
  place_geoid: string;
  place_name: string;
  state: string;
  url: string;
  source_url?: string;
  license: string;
  attribution: string;
  status: 'draft' | 'needs_review' | 'approved' | 'rejected';
  added_by: string;
  review_count: number;
  reviewed_by: string[];
  last_reviewed_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get jurisdictions missing building photos
 */
export async function getBuildingPhotoGaps(state?: string): Promise<JurisdictionGap[]> {
  const params = state ? `?state=${encodeURIComponent(state)}` : '';
  return fetchAPI<JurisdictionGap[]>(`/staging/building-photos/gaps${params}`);
}

/**
 * Create a new staging building photo
 */
export async function createBuildingPhoto(data: {
  place_geoid: string;
  place_name: string;
  state: string;
  url: string;
  source_url?: string;
  license: string;
  attribution: string;
}): Promise<StagingBuildingPhoto> {
  return fetchAPI<StagingBuildingPhoto>('/staging/building-photos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * List staging building photos
 */
export async function listBuildingPhotos(status?: string): Promise<StagingBuildingPhoto[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : '';
  return fetchAPI<StagingBuildingPhoto[]>(`/staging/building-photos${params}`);
}

/**
 * Submit a building photo for review
 */
export async function submitBuildingPhotoForReview(id: string): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/building-photos/${id}/submit`, {
    method: 'POST',
  });
}

/**
 * Get building photo review queue
 */
export async function getBuildingPhotoReviewQueue(): Promise<StagingBuildingPhoto[]> {
  return fetchAPI<StagingBuildingPhoto[]>('/staging/building-photos/review-queue');
}

/**
 * Approve a building photo (peer review)
 */
export async function approveBuildingPhotoReview(id: string): Promise<{
  status: string;
  review_count: number;
  approved: boolean;
}> {
  return fetchAPI(`/staging/building-photos/${id}/review-approve`, {
    method: 'POST',
  });
}

/**
 * Reject a building photo
 */
export async function rejectBuildingPhoto(
  id: string,
  comment?: string
): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(`/staging/building-photos/${id}/review-reject`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

/**
 * Admin approve a building photo (skip peer review)
 */
export async function adminApproveBuildingPhoto(id: string): Promise<{
  status: string;
  approved: boolean;
}> {
  return fetchAPI(`/staging/building-photos/${id}/approve`, {
    method: 'POST',
  });
}
