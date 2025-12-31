import { Edit2, Trash2, Calendar, Flag } from 'lucide-react'

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200'
  }

  const priorityColors = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  }

  const priorityIcons = {
    low: '○',
    medium: '◐',
    high: '●'
  }

  const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
    
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {task.description}
            </p>
          )}
        </div>
      </div>

      
      <div className="mb-4">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, { status: e.target.value })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 cursor-pointer transition-colors ${statusColors[task.status]}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

     
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className={`flex items-center gap-1.5 font-semibold ${priorityColors[task.priority]}`}>
          <Flag className="w-4 h-4" />
          <span className="capitalize">{task.priority}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard