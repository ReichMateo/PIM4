/**
 * Formats ISO date string or YYYY-MM-DD string to user-friendly Spanish date representation.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Sin fecha';
  
  try {
    // If YYYY-MM-DD
    const date = dateString.includes('T') ? new Date(dateString) : new Date(`${dateString}T00:00:00`);
    
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Checks if a YYYY-MM-DD date string is overdue relative to today.
 */
export function isOverdue(dueDateString?: string, completed?: boolean): boolean {
  if (!dueDateString || completed) return false;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(`${dueDateString}T00:00:00`);
    return due < today;
  } catch {
    return false;
  }
}
