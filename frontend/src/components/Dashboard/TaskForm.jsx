import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      })
    }
  }, [task])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    
    const submitData = {
      ...formData,
      dueDate: formData.dueDate || undefined
    }

    if (task) {
      await onSubmit(task._id, submitData)
    } else {
      await onSubmit(submitData)
    }
    
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-gradient-to-r from-primary via-secondary to-tertiary p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary/20 transition-all outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-primary/20 transition-all outline-none resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="Add task description (optional)"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          
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
                  {task ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm