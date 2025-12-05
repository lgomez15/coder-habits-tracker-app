import { useState, useRef } from 'react';
import ContributionGrid from './ContributionGrid';
import api from '../services/api';
import './HabitCard.css';

const HabitCard = ({ habit, onEdit, onDelete, onUpdate }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarking, setIsMarking] = useState(false);
    const gridRefreshRef = useRef(null);

    const handleMarkToday = async () => {
        setIsMarking(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post(`/habits/${habit._id}/track`, { date: today });

            // Refresh the grid
            if (gridRefreshRef.current) {
                await gridRefreshRef.current();
            }

            onUpdate();
        } catch (error) {
            console.error('Error marking today:', error);
            alert('Error al marcar el hábito de hoy');
        } finally {
            setIsMarking(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Estás seguro de eliminar "${habit.nombre}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/habits/${habit._id}`);
            onDelete(habit._id);
        } catch (error) {
            console.error('Error deleting habit:', error);
            alert('Error al eliminar el hábito');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="habit-card card fade-in">
            <div className="habit-header">
                <div className="habit-title-section">
                    <div
                        className="habit-color-indicator"
                        style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="habit-name">{habit.nombre}</h3>
                </div>
                <div className="habit-actions">
                    <button
                        className="btn btn-mark-today"
                        onClick={handleMarkToday}
                        disabled={isMarking}
                        title="Marcar como completado hoy"
                    >
                        {isMarking ? '⏳' : '✓'} Marcar Hoy
                    </button>
                    <button
                        className="btn btn-sm"
                        onClick={() => onEdit(habit)}
                        title="Editar hábito"
                    >
                        ✏️
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Eliminar hábito"
                    >
                        {isDeleting ? '...' : '🗑️'}
                    </button>
                </div>
            </div>

            <ContributionGrid
                habitId={habit._id}
                habitColor={habit.color}
                onRefresh={gridRefreshRef}
            />
        </div>
    );
};

export default HabitCard;
