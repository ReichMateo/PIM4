import React from 'react';
import type { Task } from '../../types/task';
import { PriorityBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/dateFormatter';
import { Check, Edit2, Trash2, Calendar, GripVertical, AlertTriangle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragEnabled?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isDragEnabled = true,
}) => {
  const overdue = isOverdue(task.dueDate, task.completed);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !isDragEnabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    borderLeft: overdue
      ? '4px solid var(--color-priority-high)'
      : task.completed
      ? '4px solid var(--color-priority-low)'
      : '4px solid var(--color-border)',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card ${task.completed ? 'task-completed-card' : ''}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          padding: '1.1rem 1.25rem',
        }}
      >
        {/* Drag handle */}
        {isDragEnabled && (
          <button
            {...attributes}
            {...listeners}
            className="btn btn-icon"
            style={{
              cursor: 'grab',
              color: 'var(--color-text-muted)',
              padding: '0.2rem',
              marginTop: '0.2rem',
              background: 'transparent',
              border: 'none',
            }}
            aria-label="Reordenar tarea"
          >
            <GripVertical size={18} />
          </button>
        )}

        {/* Custom Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id, task.completed)}
          aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: task.completed ? 'none' : '2px solid var(--color-border)',
            background: task.completed
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '0.2rem',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {task.completed && <Check size={16} color="#ffffff" strokeWidth={3} />}
        </button>

        {/* Task Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h4
              style={{
                fontSize: '1.05rem',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </h4>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p
              style={{
                fontSize: '0.875rem',
                color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                whiteSpace: 'pre-line',
              }}
            >
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {task.dueDate && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: overdue ? '#fca5a5' : 'var(--color-text-secondary)',
                  fontWeight: overdue ? 700 : 400,
                }}
              >
                {overdue ? <AlertTriangle size={14} color="#ef4444" /> : <Calendar size={14} />}
                {overdue ? `¡Venció el ${formatDate(task.dueDate)}!` : `Vence: ${formatDate(task.dueDate)}`}
              </span>
            )}
            <span>Creada: {formatDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => onEdit(task)}
            className="btn btn-secondary btn-icon"
            aria-label="Editar tarea"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-danger btn-icon"
            aria-label="Eliminar tarea"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
