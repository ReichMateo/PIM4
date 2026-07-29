import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/layout/Navbar';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TodoForm } from '../components/tasks/TodoForm';
import { TodoList } from '../components/tasks/TodoList';
import { EmailSummaryModal } from '../components/tasks/EmailSummaryModal';
import { ToastContainer } from '../components/common/Toast';
import type { CreateTaskInput } from '../types/task';

export const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const {
    tasks,
    filteredTasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    addTask,
    editTask,
    toggleComplete,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const { toasts, addToast, removeToast } = useToast();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      await addTask(input);
      addToast('Tarea creada exitosamente.', 'success');
    } catch (err: any) {
      addToast(err.message || 'No se pudo crear la tarea.', 'error');
      throw err;
    }
  };

  const handleToggleComplete = async (taskId: string, currentCompleted: boolean) => {
    try {
      await toggleComplete(taskId, currentCompleted);
      addToast(
        currentCompleted ? 'Tarea marcada como pendiente.' : '¡Excelente trabajo! Tarea completada. 🎉',
        currentCompleted ? 'info' : 'success'
      );
    } catch (err: any) {
      addToast(err.message || 'Error al cambiar estado de la tarea.', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    try {
      await deleteTask(taskId);
      addToast('Tarea eliminada.', 'info');
    } catch (err: any) {
      addToast(err.message || 'No se pudo eliminar la tarea.', 'error');
    }
  };

  const handleReorderTasks = async (reordered: any) => {
    try {
      await reorderTasks(reordered);
    } catch (err: any) {
      addToast('No se pudo guardar el nuevo orden de tareas.', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenEmailModal={() => setIsEmailModalOpen(true)} />

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
              }}
            >
              <strong>Error en la sincronización:</strong> {error}
            </div>
          )}

          {/* Statistics summary */}
          <TaskStats stats={stats} />

          {/* New Task creation form */}
          <TodoForm onSubmit={handleCreateTask} />

          {/* Filters & Search */}
          <TaskFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

          {/* Tasks List */}
          <TodoList
            tasks={tasks}
            filteredTasks={filteredTasks}
            loading={loading}
            onToggleComplete={handleToggleComplete}
            onEditTask={editTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
            isCustomSortActive={filters.sortBy === 'order' && !filters.search}
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Email Summary Modal */}
      {userProfile && (
        <EmailSummaryModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          tasks={tasks}
          userEmail={userProfile.email || ''}
          userName={userProfile.displayName || ''}
          addToast={addToast}
        />
      )}
    </div>
  );
};
