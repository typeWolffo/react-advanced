import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/api/queries/user'

export default function Profile() {
  const { data: user } = useCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>
          <Button variant="outline" asChild className="border-white/20 hover:bg-white/10">
            <Link to="/dashboard">
              ← Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription className="text-gray-300">
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Email</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">User ID</label>
                <p className="text-white font-medium font-mono text-sm">{user?.id}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Account Status</label>
                <p className="text-green-400 font-medium">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="secondary">
                Change Password
              </Button>
              <Button className="w-full border-white/20 hover:bg-white/10" variant="outline">
                Update Email
              </Button>
              <Button className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10" variant="outline">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
