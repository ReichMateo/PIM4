import React, { useState } from 'react';
import type { CreateTaskInput, TaskPriority, Task } from '../../types/task';
import { Plus, Save, Calendar, Flag, AlignLeft, Sparkles } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  initialTask?: Task | null;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialTask, onCancel }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
      });

      if (!isEditing) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar la tarea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Sparkles size={20} color="var(--color-primary)" />
        <h3 style={{ fontSize: '1.15rem' }}>{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h3>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Título de la tarea *
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="Ej. Revisar propuesta del cliente MateCode..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          disabled={isSubmitting}
          maxLength={120}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlignLeft size={15} /> Descripción (opcional)
        </label>
        <textarea
          id="task-description"
          placeholder="Añade detalles, notas o instrucciones adicionales..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          style={{ minHeight: '80px', resize: 'vertical' }}
          disabled={isSubmitting}
          rows={3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="task-priority" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flag size={15} /> Prioridad
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="input-field"
            disabled={isSubmitting}
          >
            <option value="low" style={{ background: '#1e293b' }}>🟢 Baja</option>
            <option value="medium" style={{ background: '#1e293b' }}>🟡 Media</option>
            <option value="high" style={{ background: '#1e293b' }}>🔴 Alta</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="task-duedate" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} /> Fecha de Vencimiento
          </label>
          <input
            id="task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            'Guardando...'
          ) : isEditing ? (
            <>
              <Save size={18} /> Actualizar Tarea
            </>
          ) : (
            <>
              <Plus size={18} /> Crear Tarea
            </>
          )}
        </button>
      </div>
    </form>
  );
};
