import TaskCard from './TaskCard'

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 rounded-3xl mb-4">
          <svg className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

export default TaskList