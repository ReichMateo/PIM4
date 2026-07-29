import React from 'react';
import type { TaskPriority } from '../../types/task';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const labels: Record<TaskPriority, string> = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  return <span className={`badge badge-${priority}`}>{labels[priority]}</span>;
};

interface StatusBadgeProps {
  completed: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ completed }) => {
  return (
    <span className={`badge ${completed ? 'badge-completed' : 'badge-pending'}`}>
      {completed ? 'Completada' : 'Pendiente'}
    </span>
  );
};
