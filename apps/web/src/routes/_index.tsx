import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-105 transition-transform">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-105 transition-transform">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Vite + React + React Router v7
      </h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl mb-8">
        <Button
          onClick={() => setCount((count) => count + 1)}
          className="mb-4"
          size="lg"
        >
          count is {count}
        </Button>
        <p className="text-gray-300 text-center">
          Edit <code className="bg-gray-700 px-2 py-1 rounded text-blue-300">src/routes/_index.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-gray-400 text-center mb-8">
        Click on the Vite and React logos to learn more
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild>
          <Link to="/login">
            Sign In
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/register">
            Sign Up
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
