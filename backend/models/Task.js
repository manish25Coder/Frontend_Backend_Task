const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  }
}, {
  timestamps: true 
});

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });


taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.status !== 'completed';
});


taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);