import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';

const createProgress = async (req, res) => {
  try {
    const { userId, goalId, date, value } = req.body;

    if (!userId || !goalId || !date || value === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const goal = await Goal.findById(goalId);
     if (!goal) {
      return res.status(400).json({ message: 'Invalid goalId' });
    }


     if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    if (typeof value !== 'number' || value <= 0) {
      return res.status(400).json({ message: 'Value must be a positive number' });
    }

    const progress = await Progress.create({
      userId,
      goalId,
      date: new Date(date),
      value,
    });

    res.status(201).json(progress);
  } catch (error) {
    console.error('Error creating progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProgresses = async (req, res) => {
  try {
    const { userId } = req.query;
    let progresses;

    if (userId) {
      progresses = await Progress.find({ userId: userId.trim() })
        .sort({ createdAt: -1 });
    } else {
      progresses = await Progress.find({})
        .sort({ createdAt: -1 });
    }

    res.status(200).json(progresses);
  } catch (error) {
    console.error('Error fetching progresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    const progress = await Progress.findById(id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching progress by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, value } = req.body;

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    if (value && (typeof value !== 'number' || value <= 0)) {
      return res.status(400).json({ message: 'Value must be a positive number' });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      id,
      {
        date: date ? new Date(date) : undefined,
        value,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error('Error updating progress:', error);
     if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProgress = await Progress.findByIdAndDelete(id);

    if (!deletedProgress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createProgress, getProgresses, getProgressById, updateProgress, deleteProgress };
