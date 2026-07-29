import type { SendEmailPayload, SendEmailResponse } from '../types/email';

/**
 * Calls serverless function (/api/send-email) to send task summary email via AWS SES.
 */
export async function sendEmailSummary(payload: SendEmailPayload): Promise<SendEmailResponse> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al enviar el correo.');
    }

    return data as SendEmailResponse;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Ocurrió un error al intentar enviar el correo.',
      error: err.message,
    };
  }
}
