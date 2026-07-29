import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoList } from '../../components/tasks/TodoList';
import { mockTasks } from '../mocks/firebaseMock';

describe('TodoList Component Tests', () => {
  it('renders list of tasks correctly', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filteredTasks={mockTasks}
        loading={false}
        onToggleComplete={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onReorderTasks={vi.fn()}
        isCustomSortActive={true}
      />
    );

    expect(screen.getByText('Diseñar wireframes en Figma')).toBeInTheDocument();
    expect(screen.getByText('Configurar Firebase Auth')).toBeInTheDocument();
  });

  it('renders empty state message when filteredTasks is empty', () => {
    render(
      <TodoList
        tasks={[]}
        filteredTasks={[]}
        loading={false}
        onToggleComplete={vi.fn()}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onReorderTasks={vi.fn()}
        isCustomSortActive={true}
      />
    );

    expect(screen.getByText(/¡No tienes tareas aún!/i)).toBeInTheDocument();
  });

  it('triggers onToggleComplete when checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TodoList
        tasks={mockTasks}
        filteredTasks={mockTasks}
        loading={false}
        onToggleComplete={handleToggle}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onReorderTasks={vi.fn()}
        isCustomSortActive={true}
      />
    );

    const toggleButtons = screen.getAllByRole('button', { name: /Marcar como/i });
    fireEvent.click(toggleButtons[0]);

    expect(handleToggle).toHaveBeenCalledWith('task-1', false);
  });
});
