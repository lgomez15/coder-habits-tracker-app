import { useState, useEffect } from 'react';
import './ContributionGrid.css';

const ContributionGrid = ({ habitId, habitColor, onRefresh }) => {
    const [yearData, setYearData] = useState([]);
    const [hoveredDay, setHoveredDay] = useState(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (habitId) {
            fetchYearData();
        }
    }, [habitId]);

    // Expose refresh function to parent
    useEffect(() => {
        if (onRefresh) {
            onRefresh.current = fetchYearData;
        }
    }, [onRefresh]);

    const fetchYearData = async () => {
        try {
            const response = await fetch(`http://localhost:5001/habits/${habitId}/track?year=${currentYear}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setYearData(data.records || []);
        } catch (error) {
            console.error('Error fetching year data:', error);
        }
    };

    // Generate all 365 days of the year
    const generateYearDays = () => {
        const days = [];
        const startDate = new Date(currentYear, 0, 1);

        for (let i = 0; i < 365; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }

        return days;
    };

    // Get intensity level for a specific date
    const getIntensityLevel = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const record = yearData.find(r => r.fecha === dateStr);
        return record ? record.intensityLevel : 0;
    };

    // Get count for a specific date
    const getCount = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const record = yearData.find(r => r.fecha === dateStr);
        return record ? record.contador : 0;
    };

    // Get color based on intensity
    const getCellColor = (intensityLevel) => {
        if (intensityLevel === 0) return 'var(--empty-cell)';

        // Convert hex to RGB
        const hex = habitColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Different opacity levels
        const opacities = [0, 0.25, 0.5, 0.75, 1.0];
        const opacity = opacities[intensityLevel];

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const days = generateYearDays();

    // Group days by week
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="contribution-grid-container">
            <div className="contribution-grid">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid-week">
                        {week.map((day, dayIndex) => {
                            const intensityLevel = getIntensityLevel(day);
                            const count = getCount(day);

                            return (
                                <div
                                    key={dayIndex}
                                    className="grid-cell"
                                    style={{ backgroundColor: getCellColor(intensityLevel) }}
                                    onMouseEnter={() => setHoveredDay({ date: day, count })}
                                    onMouseLeave={() => setHoveredDay(null)}
                                    title={`${formatDate(day)}: ${count} ${count === 1 ? 'vez' : 'veces'}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {hoveredDay && (
                <div className="grid-tooltip">
                    <strong>{formatDate(hoveredDay.date)}</strong>
                    <br />
                    {hoveredDay.count} {hoveredDay.count === 1 ? 'vez' : 'veces'}
                </div>
            )}

            <div className="grid-legend">
                <span className="legend-label">Menos</span>
                {[0, 1, 2, 3, 4].map(level => (
                    <div
                        key={level}
                        className="legend-cell"
                        style={{ backgroundColor: getCellColor(level) }}
                    />
                ))}
                <span className="legend-label">Más</span>
            </div>
        </div>
    );
};

export default ContributionGrid;
