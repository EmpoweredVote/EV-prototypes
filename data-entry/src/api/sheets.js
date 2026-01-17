import { APPS_SCRIPT_URL } from '../config'

/**
 * Helper function for GET requests to Google Apps Script
 * Google Apps Script requires the redirect to be followed
 */
async function fetchGet(params) {
  const url = new URL(APPS_SCRIPT_URL)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    })

    // Handle both ok and redirected responses
    const text = await response.text()

    try {
      return JSON.parse(text)
    } catch {
      console.error('Failed to parse response:', text.substring(0, 500))
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('Fetch GET error:', error)
    throw error
  }
}

/**
 * Helper function for POST requests to Google Apps Script
 * Using text/plain content type to avoid CORS preflight requests
 */
async function fetchPost(data) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data)
    })

    const text = await response.text()

    try {
      return JSON.parse(text)
    } catch {
      console.error('Failed to parse response:', text.substring(0, 500))
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('Fetch POST error:', error)
    throw error
  }
}

/**
 * Fetch all data from Google Sheets
 */
export async function getData() {
  return fetchGet({ action: 'getData' })
}

/**
 * Add a new politician
 */
export async function addPolitician(data) {
  return fetchPost({
    action: 'addPolitician',
    ...data
  })
}

/**
 * Add a new stance
 */
export async function addStance(data) {
  return fetchPost({
    action: 'addStance',
    ...data
  })
}

/**
 * Update an existing stance
 */
export async function updateStance(data) {
  return fetchPost({
    action: 'updateStance',
    ...data
  })
}

/**
 * Submit a stance for review
 */
export async function submitForReview(contextKey) {
  return fetchPost({
    action: 'submitForReview',
    context_key: contextKey
  })
}

/**
 * Acquire a lock on a stance row
 */
export async function acquireLock(contextKey, volunteerName) {
  return fetchPost({
    action: 'acquireLock',
    context_key: contextKey,
    volunteer_name: volunteerName
  })
}

/**
 * Release a lock on a stance row
 */
export async function releaseLock(contextKey) {
  return fetchPost({
    action: 'releaseLock',
    context_key: contextKey
  })
}

/**
 * Approve a review
 */
export async function approveReview(contextKey, volunteerName) {
  return fetchPost({
    action: 'approveReview',
    context_key: contextKey,
    volunteer_name: volunteerName
  })
}

/**
 * Edit and resubmit a stance
 */
export async function editAndResubmit(data) {
  return fetchPost({
    action: 'editAndResubmit',
    ...data
  })
}
