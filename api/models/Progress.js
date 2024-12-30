import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Goal',
        index: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
         validate: {
            validator: (value) => value instanceof Date,
            message: 'date must be a valid Date'
        }
    },
    value: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: 'value must be a positive number'
        }
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

ProgressSchema.virtual('id').get(function() {
    return this._id.toString();
});


ProgressSchema.pre('save', function(next) {
    this.set({ updatedAt: Date.now() });
    for (const key in this) {
      if (typeof this[key] === 'string') {
        this[key] = this[key].trim();
      }
    }
    next();
});


ProgressSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

ProgressSchema.pre('updateOne', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});


const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress;
