
import React, { useEffect, useState } from 'react';
import './Styles.css'; 

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (event) => {
      const { message, type } = event.detail;
      setToasts((prevToasts) => [...prevToasts, { message, type }]);
    };

    window.addEventListener('show-toast', handleToastEvent);

    return () => {
      window.removeEventListener('show-toast', handleToastEvent);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div key={index} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
