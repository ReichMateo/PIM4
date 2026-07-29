/**
 * Maps Firebase Auth and Firestore error codes to friendly Spanish messages.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Ha ocurrido un error inesperado.';

  const code = typeof error === 'string' ? error : error?.code || error?.message || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'El formato de correo electrónico no es válido.';
    case 'auth/user-disabled':
      return 'Esta cuenta de usuario ha sido deshabilitada.';
    case 'auth/user-not-found':
      return 'No existe ninguna cuenta registrada con este correo.';
    case 'auth/wrong-password':
      return 'La contraseña ingresada es incorrecta.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta asociada a este correo electrónico.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'El inicio de sesión con Google fue cancelado antes de completar.';
    case 'auth/network-request-failed':
      return 'Error de red. Verifica tu conexión a internet e intentalo nuevamente.';
    case 'auth/requires-recent-login':
      return 'Esta operación requiere volver a autenticarse por seguridad.';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Por favor verifica tu correo y contraseña.';
    case 'permission-denied':
      return 'No tienes permisos para realizar esta operación en la base de datos.';
    case 'unavailable':
      return 'El servicio de base de datos no está disponible en este momento.';
    default:
      return error?.message || 'Ocurrió un error procesando tu solicitud. Por favor intenta de nuevo.';
  }
}
