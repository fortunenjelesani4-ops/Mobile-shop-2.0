/**
 * DRIPLY Luxury App Utilities
 */

export const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
  const event = new CustomEvent('driply-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};
