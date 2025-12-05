import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del hábito es obligatorio'],
        trim: true
    },
    color: {
        type: String,
        required: [true, 'El color es obligatorio'],
        match: [/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido (ej: #FF5733)'],
        default: '#4CAF50'
    }
}, {
    timestamps: true
});

// Index for faster queries
habitSchema.index({ userId: 1, createdAt: -1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
