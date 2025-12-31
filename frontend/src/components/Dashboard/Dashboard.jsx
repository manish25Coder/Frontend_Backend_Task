import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Navbar from '../Layout/Navbar'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  ListTodo
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: ''
  })

  useEffect(() => {
  if (!user) return;   
  fetchTasks();
}, [filters, user]);


  const fetchTasks = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)

    const { data } = await api.get(`/tasks?${params.toString()}`)
    setTasks(Array.isArray(data.tasks) ? data.tasks : [])
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Not authenticated, skipping task fetch')
    } else {
      console.error('Failed to fetch tasks:', error)
    }
    setTasks([])
  } finally {
    setLoading(false)
  }
}


  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData)
    //   setTasks([data, ...tasks])
    setTasks((prevTasks) => [data.task, ...prevTasks])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }




    const handleUpdateTask = async (taskId, taskData) => {
        try {
            const { data } = await api.put(`/tasks/${taskId}`, taskData)

            setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? data.task : task
            )
            )

            
            setFilters((prev) => ({
            ...prev,
            status: ''
            }))

            setEditingTask(null)
            setShowForm(false)
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }


  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(task => task._id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
       
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome back, <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's what you have on your plate today</p>
        </div>

        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            
            <button
              onClick={() => {
                setEditingTask(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary via-secondary to-tertiary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        
        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
          />
        )}

        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={(task) => {
              setEditingTask(task)
              setShowForm(true)
            }}
            onDelete={handleDeleteTask}
            onStatusChange={handleUpdateTask}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
