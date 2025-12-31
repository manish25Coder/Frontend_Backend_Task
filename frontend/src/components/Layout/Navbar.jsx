// frontend/src/components/Layout/Navbar.jsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, Menu, X, Settings } from 'lucide-react'
import Profile from '../Dashboard/Profile'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary via-secondary to-tertiary rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent hidden sm:block">
                TaskManager
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Info Card */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ring-2 ring-white"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
              </div>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
                title="Edit Profile"
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Profile Button */}
              <button
                onClick={() => {
                  setShowProfile(true)
                  setShowMenu(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium mb-3"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout()
                  setShowMenu(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

export default Navbar