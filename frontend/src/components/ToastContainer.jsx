import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </>
  );
};

export default ToastContainer;
