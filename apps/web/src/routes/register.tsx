import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'
import { useRegisterUser } from '../api/mutations/useRegisterUser'
import { RegisterBody } from '../api/generated-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<RegisterBody>()

  const registerMutation = useRegisterUser()
  const password = watch('password')

  const onSubmit = async (data: RegisterBody) => {
    setIsLoading(true)

    try {
      await registerMutation.mutateAsync({
        data: {
          email: data.email,
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword
        },
        setError
      })

      // Redirect to login after successful registration
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      })
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-300">
              Sign up for a new account
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
                <Label htmlFor="username" className="text-gray-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 1,
                      message: 'Username must be at least 1 character'
                    },
                    maxLength: {
                      value: 64,
                      message: 'Username must be less than 64 characters'
                    }
                  })}
                  className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-blue-500 ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-sm text-red-400">{errors.username.message}</p>
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
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number'
                    }
                  })}
                  className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-blue-500 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-400 text-sm">
                Already have an account?
              </p>
              <Button variant="link" asChild className="text-blue-400 hover:text-blue-300">
                <Link to="/login">
                  Sign in here
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
