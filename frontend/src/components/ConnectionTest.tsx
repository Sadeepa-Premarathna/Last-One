import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface ConnectionStatus {
  backend: 'checking' | 'connected' | 'disconnected';
  message: string;
}

export const ConnectionTest = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    backend: 'checking',
    message: 'Checking connection...'
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ROOT);
        if (response.ok) {
          const data = await response.json();
          setStatus({
            backend: 'connected',
            message: `Connected to ${data.message || 'Backend API'}`
          });
        } else {
          throw new Error('Backend responded with error');
        }
      } catch (error) {
        setStatus({
          backend: 'disconnected',
          message: error instanceof Error ? error.message : 'Failed to connect to backend'
        });
      }
    };

    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    checking: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    connected: 'bg-green-100 text-green-800 border-green-300',
    disconnected: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusIcon = {
    checking: '⏳',
    connected: '✅',
    disconnected: '❌'
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg border-2 shadow-lg transition-all duration-300 ${statusColor[status.backend]} z-50`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl">{statusIcon[status.backend]}</span>
        <div className="text-sm">
          <div className="font-semibold">Backend Status</div>
          <div className="text-xs">{status.message}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
