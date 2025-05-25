import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/api/queries/user'

export default function Dashboard() {
  const { data: user } = useCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user?.email}!</p>
          </div>
          <Button variant="outline" asChild className="border-white/20 hover:bg-white/10">
            <Link to="/">
              ← Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-200">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-gray-200">
                  <span className="font-medium">ID:</span> {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-gray-300">
                View your activity stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sessions</span>
                  <span className="text-white font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Login</span>
                  <span className="text-white font-semibold">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="secondary" asChild>
                <Link to="/profile">
                  Update Profile
                </Link>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link to="/chat">
                  AI Todo Assistant
                </Link>
              </Button>
              <Button className="w-full border-white/20 hover:bg-white/10" variant="secondary">
                View Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Logged in successfully</p>
                  <p className="text-gray-400 text-sm">2 minutes ago</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Profile updated</p>
                  <p className="text-gray-400 text-sm">1 hour ago</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Password changed</p>
                  <p className="text-gray-400 text-sm">2 days ago</p>
                </div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
