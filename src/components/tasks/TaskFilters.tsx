import React from 'react';
import type { TaskFilterState, TaskStatus, TaskPriority } from '../../types/task';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  resetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, setFilters, resetFilters }) => {
  const statusTabs: { id: TaskStatus; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'completed', label: 'Completadas' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search input & Status tabs row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar tareas por título o descripción..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="input-field"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters((prev) => ({ ...prev, status: tab.id }))}
                className="btn"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  background: filters.status === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: filters.status === tab.id ? '#ffffff' : 'var(--color-text-secondary)',
                  borderRadius: '6px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority & Sorting dropdowns row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Prioridad:</span>
            <select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as 'all' | TaskPriority }))}
              className="input-field"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="all" style={{ background: '#1e293b' }}>Todas</option>
              <option value="high" style={{ background: '#1e293b' }}>Alta</option>
              <option value="medium" style={{ background: '#1e293b' }}>Media</option>
              <option value="low" style={{ background: '#1e293b' }}>Baja</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Ordenar por:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="input-field"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="order" style={{ background: '#1e293b' }}>Orden (Drag & Drop)</option>
              <option value="createdAt" style={{ background: '#1e293b' }}>Fecha de Creación</option>
              <option value="dueDate" style={{ background: '#1e293b' }}>Fecha de Vencimiento</option>
              <option value="priority" style={{ background: '#1e293b' }}>Prioridad</option>
            </select>
          </div>

          {(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.sortBy !== 'order') && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', marginLeft: 'auto' }}
            >
              <X size={14} /> Limpiar Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
