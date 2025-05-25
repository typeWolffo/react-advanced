import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useCurrentUser } from '@/api/queries/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const location = useLocation()
  const { data: user, isLoading, error, refetch, isError } = useCurrentUser()

  // Store the attempted URL for redirect after login
  useEffect(() => {
    if (isError && !user) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search)
    }
  }, [isError, user, location])

  // Loading state with better UX
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h3 className="text-white font-medium">Authenticating...</h3>
                <p className="text-gray-400 text-sm">Please wait while we verify your session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state with retry option
  if (isError && error) {
    // Check if it's an auth error (401/403) vs network error
    const isAuthError = error.message?.includes('401') ||
                       error.message?.includes('403') ||
                       error.message?.includes('Unauthorized')

    if (isAuthError) {
      // Clear any stale tokens and redirect
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      return <Navigate to={redirectTo} replace state={{ from: location }} />
    }

    // Network or other errors - show retry option
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Connection Error</CardTitle>
            <CardDescription className="text-gray-300">
              Unable to verify your authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                {error.message || 'Something went wrong. Please try again.'}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => refetch()}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = redirectTo}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  // Authenticated - render children
  return <>{children}</>
}
