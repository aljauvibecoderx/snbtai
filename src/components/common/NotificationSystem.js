import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove, index }) => {
  const { id, message, type } = notification;

  const config = {
    success: { icon: CheckCircle, bg: 'bg-teal-50', border: 'border-teal-500', text: 'text-teal-800', iconColor: 'text-teal-600' },
    error: { icon: XCircle, bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-800', iconColor: 'text-rose-600' },
    warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-800', iconColor: 'text-amber-600' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', iconColor: 'text-blue-600' }
  };

  const { icon: Icon, bg, border, text, iconColor } = config[type] || config.info;

  return (
    <div
      className={`${bg} ${text} border-l-4 ${border} rounded-lg shadow-lg p-4 min-w-[300px] max-w-md pointer-events-auto animate-slide-in-right`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
