const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();


const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status. Must be: pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority. Must be: low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];


router.use(protect);


router.get('/stats', getTaskStats);


router.route('/')
  .get(getTasks)                   
  .post(taskValidation, createTask); 

router.route('/:id')
  .get(getTask)                      
  .put(updateTask)                   
  .delete(deleteTask);               

module.exports = router;