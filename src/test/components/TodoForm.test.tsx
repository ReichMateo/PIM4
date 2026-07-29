import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoForm } from '../../components/tasks/TodoForm';

describe('TodoForm Component Tests', () => {
  it('renders form inputs correctly', () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Título de la tarea/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Vencimiento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Tarea/i })).toBeInTheDocument();
  });

  it('shows error validation message when title is empty', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(<TodoForm onSubmit={handleSubmit} />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(await screen.findByText(/El título de la tarea es obligatorio/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit callback with correct task data when valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Título de la tarea/i);
    const descInput = screen.getByLabelText(/Descripción/i);

    fireEvent.change(titleInput, { target: { value: 'Completar pruebas unitarias' } });
    fireEvent.change(descInput, { target: { value: 'Usar Vitest y RTL' } });

    const submitBtn = screen.getByRole('button', { name: /Crear Tarea/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Completar pruebas unitarias',
      description: 'Usar Vitest y RTL',
      priority: 'medium',
      dueDate: undefined,
    });
  });
});
