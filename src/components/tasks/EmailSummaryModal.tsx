import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Task } from '../../types/task';
import { sendEmailSummary } from '../../services/emailService';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  userEmail: string;
  userName?: string;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const EmailSummaryModal: React.FC<EmailSummaryModalProps> = ({
  isOpen,
  onClose,
  tasks,
  userEmail,
  userName,
  addToast,
}) => {
  const [recipient, setRecipient] = useState(userEmail);
  const [isSending, setIsSending] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient.trim()) {
      addToast('Ingresa una dirección de correo válida.', 'error');
      return;
    }

    try {
      setIsSending(true);

      const payload = {
        toEmail: recipient.trim(),
        userName: userName || recipient.split('@')[0],
        tasks: tasks.map((t) => ({
          title: t.title,
          description: t.description,
          completed: t.completed,
          priority: t.priority,
          dueDate: t.dueDate,
        })),
      };

      const result = await sendEmailSummary(payload);

      if (result.success) {
        addToast(result.message || 'Resumen de tareas enviado correctamente.', 'success');
        onClose();
      } else {
        addToast(result.error || result.message || 'No se pudo enviar el correo.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Error al conectar con la función serverless de correo.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Resumen de Tareas">
      <form onSubmit={handleSendEmail}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <Mail size={28} />
          </div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Resumen por Correo Electrónico</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Recibe una confirmación formal en tu bandeja de entrada con el estado actual de tus tareas.
          </p>
        </div>

        {/* Task Stats Brief */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{tasks.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Tareas</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>{completedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Completadas</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pendientes</div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="recipient-email" className="form-label">
            Correo de Destino
          </label>
          <input
            id="recipient-email"
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input-field"
            required
            disabled={isSending}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={15} color="#10b981" />
          <span>El correo será procesado en Vercel Serverless mediante AWS SES.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSending}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSending || tasks.length === 0}>
            {isSending ? (
              'Enviando...'
            ) : (
              <>
                <Send size={16} /> Enviar Ahora
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
