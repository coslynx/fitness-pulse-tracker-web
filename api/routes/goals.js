import express from 'express';
const { Router } = express;
import { createGoal, getGoals, getGoalById, updateGoal, deleteGoal } from '../controllers/goalController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';


const router = Router();

const validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

// POST /api/goals
router.post('/',
    authMiddleware,
    [
        body('userId').notEmpty().withMessage('userId is required')
        .custom(value => validateObjectId(value)).withMessage('Invalid userId'),
        body('name').notEmpty().withMessage('name is required').trim().isLength({max: 255}).withMessage('name must be less than 255 characters'),
        body('description').optional().trim(),
        body('startDate').notEmpty().withMessage('startDate is required').isISO8601().toDate().withMessage('Invalid startDate'),
        body('targetDate').notEmpty().withMessage('targetDate is required').isISO8601().toDate().withMessage('Invalid targetDate'),
        body('targetValue').notEmpty().withMessage('targetValue is required').isNumeric().withMessage('targetValue must be a number').custom(value => value > 0).withMessage('targetValue must be a positive number'),
        body('unit').notEmpty().withMessage('unit is required').isIn(['kg', 'lbs', 'km', 'miles', 'steps', 'calories', 'minutes', 'other']).withMessage('Invalid unit'),

    ],
    async (req, res) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }
        createGoal(req, res);
    }
);


// GET /api/goals
router.get('/', getGoals);


// GET /api/goals/:id
router.get('/:id',
    [
        param('id').notEmpty().withMessage('id is required')
        .custom(value => validateObjectId(value)).withMessage('Invalid goalId'),
    ],
    async (req, res) => {
         const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        getGoalById(req, res);
    }
);

// PUT /api/goals/:id
router.put('/:id',
    authMiddleware,
    [
        param('id').notEmpty().withMessage('id is required')
            .custom(value => validateObjectId(value)).withMessage('Invalid goalId'),
        body('name').optional().trim().isLength({max: 255}).withMessage('name must be less than 255 characters'),
        body('description').optional().trim(),
        body('startDate').optional().isISO8601().toDate().withMessage('Invalid startDate'),
        body('targetDate').optional().isISO8601().toDate().withMessage('Invalid targetDate'),
         body('targetValue').optional().isNumeric().withMessage('targetValue must be a number').custom(value => value > 0).withMessage('targetValue must be a positive number'),
        body('unit').optional().isIn(['kg', 'lbs', 'km', 'miles', 'steps', 'calories', 'minutes', 'other']).withMessage('Invalid unit'),
    ],
   async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        updateGoal(req, res);
    }
);

// DELETE /api/goals/:id
router.delete('/:id',
    authMiddleware,
    [
        param('id').notEmpty().withMessage('id is required')
        .custom(value => validateObjectId(value)).withMessage('Invalid goalId'),
    ],
    async (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        deleteGoal(req, res);
    }
);



export default router;
