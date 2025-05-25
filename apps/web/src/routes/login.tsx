import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'
import { useLoginUser } from '../api/mutations/useLoginUser'
import { LoginBody } from '../api/generated-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginBody>()

  const loginMutation = useLoginUser()

  const onSubmit = async (data: LoginBody) => {
    setIsLoading(true)

    try {
      await loginMutation.mutateAsync({
        data,
        setError
      })

      // Redirect to intended page or dashboard
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
      sessionStorage.removeItem('redirectAfterLogin')
      navigate(redirectTo)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-400 text-sm">
                Don't have an account?
              </p>
              <Button variant="link" asChild className="text-blue-400 hover:text-blue-300">
                <Link to="/register">
                  Create account here
                </Link>
              </Button>
              <div className="pt-2">
                <Button variant="link" asChild className="text-gray-400 hover:text-gray-300">
                  <Link to="/">
                    ← Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
