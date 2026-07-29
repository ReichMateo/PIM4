import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido. Utilice POST.' });
  }

  try {
    const { toEmail, userName, tasks } = req.body || {};

    if (!toEmail || typeof toEmail !== 'string') {
      return res.status(400).json({ success: false, message: 'El correo de destino (toEmail) es obligatorio.' });
    }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ success: false, message: 'Se requiere una lista válida de tareas.' });
    }

    // Retrieve environment variables
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const senderEmail = process.env.AWS_SES_SENDER_EMAIL || toEmail;

    if (!accessKeyId || !secretAccessKey) {
      // In development / demo mode where AWS keys are not configured, return simulated success with info
      console.warn('AWS SES credentials not found in environment variables. Running in simulation mode.');
      return res.status(200).json({
        success: true,
        message: `[Modo Simulación] Resumen de ${tasks.length} tareas enviado exitosamente a ${toEmail}. Configura tus credenciales en Vercel para producción.`,
        messageId: `simulated-ses-${Date.now()}`,
      });
    }

    // Initialize AWS SES Client
    const sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high' && !t.completed).length;

    const userDisplayName = userName || toEmail.split('@')[0];

    // Build HTML email template
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 30px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
            .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 24px; }
            .stats-grid { display: table; width: 100%; margin-bottom: 24px; }
            .stat-box { display: table-cell; width: 33%; text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
            .stat-num { font-size: 22px; font-weight: bold; color: #4f46e5; }
            .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
            .task-list { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .task-item { border-bottom: 1px solid #e2e8f0; }
            .task-item td { padding: 12px 8px; vertical-align: top; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
            .badge-completed { background-color: #dcfce7; color: #166534; }
            .badge-pending { background-color: #fef3c7; color: #92400e; }
            .badge-high { background-color: #fee2e2; color: #991b1b; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📌 Resumen de Tareas</h1>
              <p>MateCode - Gestor Estratégico de Tareas</p>
            </div>
            <div class="content">
              <p>Hola <strong>${userDisplayName}</strong>,</p>
              <p>Aquí tienes el estado consolidado de tus tareas diarias:</p>
              
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-num">${totalTasks}</div>
                  <div class="stat-label">Total</div>
                </div>
                <div class="stat-box" style="margin: 0 8px;">
                  <div class="stat-num" style="color: #10b981;">${completedTasks}</div>
                  <div class="stat-label">Completadas</div>
                </div>
                <div class="stat-box">
                  <div class="stat-num" style="color: #f59e0b;">${pendingTasks}</div>
                  <div class="stat-label">Pendientes</div>
                </div>
              </div>

              ${highPriorityTasks > 0 ? `<p style="color: #dc2626; font-weight: 600;">⚠️ Tienes ${highPriorityTasks} tarea(s) de Alta Prioridad pendiente(s).</p>` : ''}

              <h3>Detalle de Tareas:</h3>
              <table class="task-list">
                ${tasks.map((task: any) => `
                  <tr class="task-item">
                    <td style="width: 24px; text-align: center;">
                      ${task.completed ? '✅' : '⏳'}
                    </td>
                    <td>
                      <strong style="${task.completed ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${escapeHtml(task.title)}</strong>
                      ${task.description ? `<br/><span style="font-size: 13px; color: #64748b;">${escapeHtml(task.description)}</span>` : ''}
                      ${task.dueDate ? `<br/><span style="font-size: 12px; color: #8b5cf6;">📅 Vence: ${task.dueDate}</span>` : ''}
                    </td>
                    <td style="text-align: right; width: 100px;">
                      <span class="badge ${task.completed ? 'badge-completed' : 'badge-pending'}">
                        ${task.completed ? 'Hecha' : 'Pendiente'}
                      </span>
                      ${task.priority === 'high' ? `<br/><span class="badge badge-high" style="margin-top: 4px;">Alta</span>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </table>
            </div>
            <div class="footer">
              Enviado automáticamente por MateCode Task Manager &bull; Servidor AWS SES
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `Hola ${userDisplayName},\n\nResumen de tus tareas:\nTotal: ${totalTasks} | Completadas: ${completedTasks} | Pendientes: ${pendingTasks}\n\nTareas:\n` +
      tasks.map((t: any) => `- [${t.completed ? 'X' : ' '}] ${t.title} (${t.priority.toUpperCase()})${t.dueDate ? ` - Vence: ${t.dueDate}` : ''}`).join('\n');

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
          Text: { Data: textBody, Charset: 'UTF-8' },
        },
        Subject: {
          Data: `📌 Resumen de Tareas (${completedTasks}/${totalTasks} completadas) - MateCode`,
          Charset: 'UTF-8',
        },
      },
      Source: senderEmail,
    });

    const response = await sesClient.send(command);

    return res.status(200).json({
      success: true,
      message: `Resumen enviado exitosamente a ${toEmail}.`,
      messageId: response.MessageId,
    });
  } catch (error: any) {
    console.error('Error sending email via AWS SES:', error);
    return res.status(500).json({
      success: false,
      message: 'Falló el envío de correo a través de AWS SES.',
      error: error.message || 'Error interno del servidor.',
    });
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
