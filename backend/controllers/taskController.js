const Task = require('../models/Task');
const { validationResult } = require('express-validator');


const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sort = '-createdAt' } = req.query;
    
    
    const query = { user: req.user._id };

    
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

   
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort(sort);
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const createTask = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Create task
    const task = await Task.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const updateTask = async (req, res) => {
  try {
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Update task fields
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      'in-progress': 0,
      completed: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json({
      success: true,
      stats: formattedStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};