import express from 'express';
import Habit from '../models/Habit.js';
import HabitRecord from '../models/HabitRecord.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /habits - Get all habits for authenticated user
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({ habits });
    } catch (error) {
        console.error('Error al obtener hábitos:', error);
        res.status(500).json({
            error: 'Error al obtener hábitos',
            details: error.message
        });
    }
});

// POST /habits - Create new habit
router.post('/', async (req, res) => {
    try {
        const { nombre, color } = req.body;

        if (!nombre || !color) {
            return res.status(400).json({
                error: 'Por favor proporciona nombre y color'
            });
        }

        const habit = new Habit({
            userId: req.userId,
            nombre,
            color
        });

        await habit.save();

        res.status(201).json({
            message: 'Hábito creado exitosamente',
            habit
        });
    } catch (error) {
        console.error('Error al crear hábito:', error);
        res.status(500).json({
            error: 'Error al crear hábito',
            details: error.message
        });
    }
});

// PUT /habits/:id - Update habit
router.put('/:id', async (req, res) => {
    try {
        const { nombre, color } = req.body;

        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Hábito no encontrado' });
        }

        if (nombre) habit.nombre = nombre;
        if (color) habit.color = color;

        await habit.save();

        res.json({
            message: 'Hábito actualizado exitosamente',
            habit
        });
    } catch (error) {
        console.error('Error al actualizar hábito:', error);
        res.status(500).json({
            error: 'Error al actualizar hábito',
            details: error.message
        });
    }
});

// DELETE /habits/:id - Delete habit
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Hábito no encontrado' });
        }

        // Delete all records for this habit
        await HabitRecord.deleteMany({ habitId: habit._id });

        // Delete the habit
        await Habit.deleteOne({ _id: habit._id });

        res.json({ message: 'Hábito eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar hábito:', error);
        res.status(500).json({
            error: 'Error al eliminar hábito',
            details: error.message
        });
    }
});

// POST /habits/:id/track - Track a day (increment counter)
router.post('/:id/track', async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Por favor proporciona una fecha' });
        }

        // Verify habit belongs to user
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Hábito no encontrado' });
        }

        // Parse date and set to start of day
        const trackDate = new Date(date);
        trackDate.setHours(0, 0, 0, 0);

        // Find or create record for this date
        let record = await HabitRecord.findOne({
            habitId: habit._id,
            fecha: trackDate
        });

        if (record) {
            // Increment counter
            record.contador += 1;
            await record.save();
        } else {
            // Create new record
            record = new HabitRecord({
                habitId: habit._id,
                fecha: trackDate,
                contador: 1
            });
            await record.save();
        }

        res.json({
            message: 'Día registrado exitosamente',
            record: {
                fecha: record.fecha,
                contador: record.contador,
                intensityLevel: record.getIntensityLevel()
            }
        });
    } catch (error) {
        console.error('Error al registrar día:', error);
        res.status(500).json({
            error: 'Error al registrar día',
            details: error.message
        });
    }
});

// GET /habits/:id/track - Get all tracking data for a year
router.get('/:id/track', async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        // Verify habit belongs to user
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!habit) {
            return res.status(404).json({ error: 'Hábito no encontrado' });
        }

        // Get all records for the year
        const startDate = new Date(targetYear, 0, 1);
        const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

        const records = await HabitRecord.find({
            habitId: habit._id,
            fecha: { $gte: startDate, $lte: endDate }
        }).sort({ fecha: 1 });

        // Format records with intensity levels
        const formattedRecords = records.map(record => ({
            fecha: record.fecha.toISOString().split('T')[0],
            contador: record.contador,
            intensityLevel: record.getIntensityLevel()
        }));

        res.json({
            habit: {
                id: habit._id,
                nombre: habit.nombre,
                color: habit.color
            },
            year: targetYear,
            records: formattedRecords
        });
    } catch (error) {
        console.error('Error al obtener registros:', error);
        res.status(500).json({
            error: 'Error al obtener registros',
            details: error.message
        });
    }
});

export default router;
