import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class GenericToast {
  static showToast(message: string, options?: ToastOptions) {
    toast(message, options);
  }

  static showError(message: string, options?: ToastOptions) {
    toast.error(message, options);
  }

  static showSuccess(message: string, options?: ToastOptions) {
    toast.success(message, options);
  }

  static showWarning(message: string, options?: ToastOptions) {
    toast.warning(message, options);
  }

  static showInfo(message: string, options?: ToastOptions) {
    toast.info(message, options);
  }

  static showDefault(message: string, options?: ToastOptions) {
    toast(message, options);
  }
}

const GenericToastComponent: React.FC = () => {
  return <ToastContainer />;
};

export { GenericToast, GenericToastComponent };