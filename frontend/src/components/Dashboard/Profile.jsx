// frontend/src/components/Dashboard/Profile.jsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { User, Mail, Lock, Save, X, AlertCircle, CheckCircle } from 'lucide-react'

const Profile = ({ onClose }) => {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters')
      return false
    }

    // Email validation
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Password validation (if changing password)
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password')
        return false
      }
      if (!formData.newPassword) {
        setError('New password is required')
        return false
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters')
        return false
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email
      }

      // Add password if changing
      if (showPasswordFields && formData.newPassword) {
        updateData.password = formData.newPassword
      }

      // Update profile
      const { data } = await api.put('/auth/profile', updateData)

      // Update local storage with new user data
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        token: data.token
      }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem('token', data.token)

      // Update auth context (trigger re-render)
      await login(formData.email, showPasswordFields ? formData.newPassword : formData.currentPassword)

      setSuccess('Profile updated successfully!')
      
      // Reset password fields
      if (showPasswordFields) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setShowPasswordFields(false)
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (error) {
      console.error('Update profile error:', error)
      setError(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary via-secondary to-tertiary p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <p className="text-white/80 text-sm">Update your account information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Display */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full ring-4 ring-primary/20"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-primary to-secondary rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Change Password Toggle */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="flex items-center gap-2 text-primary hover:text-secondary font-semibold transition-colors"
            >
              <Lock className="w-4 h-4" />
              {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
            </button>
          </div>

          {/* Password Fields (Conditional) */}
          {showPasswordFields && (
            <div className="space-y-4 pt-2">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After changing your password, you'll need to login again with your new password.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-tertiary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile