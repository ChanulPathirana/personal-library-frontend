import { useEffect, useState } from 'react'

interface LoadingStateProps {
  label?: string
}

export default function LoadingState({ label = 'Loading your library…' }: LoadingStateProps) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 8000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div role="status" aria-live="polite" className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <span className="mx-auto mb-4 block h-7 w-7 animate-spin rounded-full border-2 border-pale-strong border-t-accent" aria-hidden="true" />
      <p className="text-sm font-medium">{label}</p>
      {slow && <p className="mt-2 text-sm text-muted">The server may be waking up…</p>}
    </div>
  )
}
