import mongoose from 'mongoose';

const habitRecordSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
        index: true
    },
    fecha: {
        type: Date,
        required: true,
        index: true
    },
    contador: {
        type: Number,
        default: 1,
        min: [1, 'El contador debe ser al menos 1']
    }
}, {
    timestamps: true
});

// Compound index for unique habit-date combinations and faster queries
habitRecordSchema.index({ habitId: 1, fecha: 1 }, { unique: true });

// Method to calculate intensity level (0-4)
habitRecordSchema.methods.getIntensityLevel = function () {
    if (this.contador === 0) return 0;
    if (this.contador === 1) return 1;
    if (this.contador === 2) return 2;
    if (this.contador === 3) return 3;
    return 4; // 4 or more
};

const HabitRecord = mongoose.model('HabitRecord', habitRecordSchema);

export default HabitRecord;
