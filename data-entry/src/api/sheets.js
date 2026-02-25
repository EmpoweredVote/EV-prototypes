/**
 * API Module - Re-exports from backend.ts
 *
 * This file is kept for backwards compatibility.
 * New code should import directly from './backend.ts'
 *
 * The app has been migrated from Google Apps Script to the EV-Backend.
 */

export {
  getData,
  getEssentialsPolitician,
  addPolitician,
  updatePolitician,
  addStance,
  updateStance,
  submitForReview,
  acquireLock,
  releaseLock,
  approveReview,
  editAndResubmit,
  getReviewQueue,
  submitPoliticianForReview,
  approvePoliticianDirect,
  getPoliticianReviewQueue,
  acquirePoliticianLock,
  releasePoliticianLock,
  approvePoliticianReview,
  rejectPolitician,
  editAndResubmitPolitician,
  checkAuth,
  login,
  logout,
  register,
} from './backend';
