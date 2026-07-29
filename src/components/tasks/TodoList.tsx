import React, { useState } from 'react';
import type { Task, UpdateTaskInput } from '../../types/task';
import { TodoItem } from './TodoItem';
import { Modal } from '../common/Modal';
import { TodoForm } from './TodoForm';
import { CheckCircle2, Inbox } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface TodoListProps {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEditTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (reorderedTasks: Task[]) => Promise<void>;
  isCustomSortActive: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  tasks,
  filteredTasks,
  loading,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
  isCustomSortActive,
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(filteredTasks, oldIndex, newIndex);
      onReorderTasks(reordered);
    }
  };

  const handleUpdateTaskSubmit = async (input: any) => {
    if (!editingTask) return;
    await onEditTask(editingTask.id, input);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="glass-panel"
            style={{
              height: '80px',
              animation: 'pulse 1.5s infinite ease-in-out',
              opacity: 0.6,
            }}
          ></div>
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        {tasks.length === 0 ? (
          <>
            <Inbox size={48} color="var(--color-primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              ¡No tienes tareas aún!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
              Crea tu primera tarea arriba para comenzar a gestionar tus metas de forma estratégica.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 size={48} color="var(--color-secondary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              No se encontraron tareas
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Prueba cambiando o limpiando los filtros de búsqueda.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredTasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={(t) => setEditingTask(t)}
                onDelete={onDeleteTask}
                isDragEnabled={isCustomSortActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit Task Modal */}
      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="Editar Tarea"
      >
        {editingTask && (
          <TodoForm
            initialTask={editingTask}
            onSubmit={handleUpdateTaskSubmit}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </>
  );
};
