import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out max-w-sm";
    
    const typeStyles = {
      success: "bg-green-50/90 border-green-200 text-green-800",
      error: "bg-red-50/90 border-red-200 text-red-800",
      info: "bg-blue-50/90 border-blue-200 text-blue-800",
      warning: "bg-yellow-50/90 border-yellow-200 text-yellow-800"
    };

    const positionStyles = "bottom-4 right-4 md:bottom-6 md:right-6 top-4 md:top-auto left-4 md:left-auto";
    
    const animationStyles = isAnimating 
      ? "transform translate-y-0 opacity-100 scale-100" 
      : "transform translate-y-2 opacity-0 scale-95";

    return `${baseStyles} ${typeStyles[type]} ${positionStyles} ${animationStyles}`;
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: "flex-shrink-0" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'info':
        return <AlertCircle {...iconProps} className="text-blue-600" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-yellow-600" />;
      default:
        return <CheckCircle {...iconProps} className="text-green-600" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <p className="text-sm font-medium flex-1 leading-5">{message}</p>
      <button
        onClick={() => {
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
