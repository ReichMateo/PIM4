export interface SendEmailPayload {
  toEmail: string;
  userName?: string;
  tasks: {
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    dueDate?: string;
  }[];
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}
