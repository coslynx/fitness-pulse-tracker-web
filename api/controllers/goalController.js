import Goal from '../models/Goal.js';
import User from '../models/User.js';

const createGoal = async (req, res) => {
  try {
    const { userId, name, description, startDate, targetDate, targetValue, unit } = req.body;

    if (!userId || !name || !startDate || !targetDate || !targetValue || !unit) {
      return res.status(400).json({ message: 'All fields are required' });
    }
      
    if (isNaN(new Date(startDate).getTime())){
      return res.status(400).json({ message: 'Invalid startDate' });
    }

    if (isNaN(new Date(targetDate).getTime())){
      return res.status(400).json({ message: 'Invalid targetDate' });
    }

    if (typeof targetValue !== 'number' || targetValue <= 0){
        return res.status(400).json({ message: 'targetValue must be a positive number' });
    }
      

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' });
    }


    const goal = await Goal.create({
      userId,
      name: name.trim(),
      description: description ? description.trim() : undefined,
      startDate: new Date(startDate),
      targetDate: new Date(targetDate),
      targetValue,
      unit,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    let goals;

      if (userId) {
          goals = await Goal.find({ userId: userId.trim() }).sort({ createdAt: -1 });
        } else {
        goals = await Goal.find({}).sort({ createdAt: -1 });
      }


    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Error fetching goal by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, targetDate, targetValue, unit } = req.body;

     if (startDate && isNaN(new Date(startDate).getTime())){
      return res.status(400).json({ message: 'Invalid startDate' });
    }

    if (targetDate && isNaN(new Date(targetDate).getTime())){
      return res.status(400).json({ message: 'Invalid targetDate' });
    }

      if (targetValue && (typeof targetValue !== 'number' || targetValue <= 0)){
        return res.status(400).json({ message: 'targetValue must be a positive number' });
    }


    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      {
        name: name ? name.trim() : undefined,
        description: description ? description.trim() : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        targetValue,
        unit,
      },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
     if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };
