import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value instanceof Date,
            message: 'startDate must be a valid Date'
        }
    },
    targetDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value instanceof Date,
            message: 'targetDate must be a valid Date'
        }
    },
    targetValue: {
        type: Number,
        required: true,
         validate: {
            validator: (value) => value > 0,
            message: 'targetValue must be a positive number'
        }
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'lbs', 'km', 'miles', 'steps', 'calories', 'minutes', 'other']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

GoalSchema.virtual('id').get(function() {
    return this._id.toString();
});

GoalSchema.pre('save', function(next) {
    this.set({ updatedAt: Date.now() });
      for (const key in this) {
      if (typeof this[key] === 'string') {
        this[key] = this[key].trim();
      }
    }
    next();
});

GoalSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

GoalSchema.pre('updateOne', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});


const Goal = mongoose.model('Goal', GoalSchema);

export default Goal;
