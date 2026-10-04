import { API_BASE_URL, apiRequest } from './client'

export interface GoogleDriveStatus {
  connected: boolean
}

const googleDrivePath = '/api/google-drive'

export function getGoogleDriveStatus(): Promise<GoogleDriveStatus> {
  return apiRequest(`${googleDrivePath}/status`)
}

export function disconnectGoogleDrive(): Promise<void> {
  return apiRequest(`${googleDrivePath}/disconnect`, { method: 'POST' })
}

export function connectGoogleDrive(): void {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured. Set it to the public backend URL.')
  }
  window.location.assign(`${API_BASE_URL}${googleDrivePath}/connect`)
}
