import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getGoogleDriveStatus } from '../../api/googleDriveApi'
import type { GoogleDriveStatus } from '../../api/googleDriveApi'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export interface DriveOutletContext {
  driveStatus: GoogleDriveStatus | null
  driveLoading: boolean
  driveError: string | null
  refreshDriveStatus: () => Promise<void>
}

export default function AppLayout() {
  const [driveStatus, setDriveStatus] = useState<GoogleDriveStatus | null>(null)
  const [driveLoading, setDriveLoading] = useState(true)
  const [driveError, setDriveError] = useState<string | null>(null)

  const refreshDriveStatus = useCallback(async () => {
    setDriveLoading(true)
    setDriveError(null)
    try {
      setDriveStatus(await getGoogleDriveStatus())
    } catch (error) {
      setDriveStatus(null)
      setDriveError(error instanceof Error ? error.message : 'Could not load Google Drive status.')
    } finally {
      setDriveLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getGoogleDriveStatus().then((status) => {
      if (active) setDriveStatus(status)
    }).catch((error: unknown) => {
      if (active) setDriveError(error instanceof Error ? error.message : 'Could not load Google Drive status.')
    }).finally(() => {
      if (active) setDriveLoading(false)
    })
    return () => { active = false }
  }, [])

  return (
    <>
      <Sidebar connected={driveStatus?.connected ?? null} statusError={Boolean(driveError)} />
      <Topbar />
      <main className="min-h-screen bg-canvas px-4 pt-24 pb-28 sm:px-5 lg:ml-60 lg:px-5 lg:pt-24 lg:pb-8">
        <Outlet context={{ driveStatus, driveLoading, driveError, refreshDriveStatus } satisfies DriveOutletContext} />
      </main>
    </>
  )
}
