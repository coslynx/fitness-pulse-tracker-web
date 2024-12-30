import express from 'express';
const { Router } = express;
import { createProgress, getProgresses, getProgressById, updateProgress, deleteProgress } from '../controllers/progressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

const router = Router();

const validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

// POST /api/progress
router.post('/',
    authMiddleware,
    [
        body('userId').notEmpty().withMessage('userId is required')
        .custom(value => validateObjectId(value)).withMessage('Invalid userId'),
        body('goalId').notEmpty().withMessage('goalId is required')
        .custom(value => validateObjectId(value)).withMessage('Invalid goalId'),
        body('date').notEmpty().withMessage('date is required').isISO8601().toDate().withMessage('Invalid date'),
        body('value').notEmpty().withMessage('value is required').isNumeric().withMessage('value must be a number').custom(value => value > 0).withMessage('value must be a positive number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        createProgress(req, res);
    }
);

// GET /api/progress
router.get('/', getProgresses);

// GET /api/progress/:id
router.get('/:id',
    [
        param('id').notEmpty().withMessage('id is required')
            .custom(value => validateObjectId(value)).withMessage('Invalid progressId'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        getProgressById(req, res);
    }
);

// PUT /api/progress/:id
router.put('/:id',
    authMiddleware,
    [
        param('id').notEmpty().withMessage('id is required')
            .custom(value => validateObjectId(value)).withMessage('Invalid progressId'),
       body('date').optional().isISO8601().toDate().withMessage('Invalid date'),
       body('value').optional().isNumeric().withMessage('value must be a number').custom(value => value > 0).withMessage('value must be a positive number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        updateProgress(req, res);
    }
);


// DELETE /api/progress/:id
router.delete('/:id',
    authMiddleware,
    [
        param('id').notEmpty().withMessage('id is required')
            .custom(value => validateObjectId(value)).withMessage('Invalid progressId'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        deleteProgress(req, res);
    }
);


export default router;
