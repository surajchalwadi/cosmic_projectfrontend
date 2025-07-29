// Environment configuration for Vercel deployment

interface EnvironmentConfig {
  API_BASE_URL: string;
  SOCKET_URL: string;
  FILE_BASE_URL: string;
  NODE_ENV: string;
}

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  return import.meta.env[key] || fallback;
};

// Development environment (localhost)
const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
  SOCKET_URL: getEnvVar('VITE_SOCKET_URL', 'http://localhost:5000'),
  FILE_BASE_URL: getEnvVar('VITE_FILE_BASE_URL', 'http://localhost:5000'),
  NODE_ENV: 'development'
};

// Production environment (Vercel + Render)
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://your-render-app.onrender.com/api'),
  SOCKET_URL: getEnvVar('VITE_SOCKET_URL', 'https://your-render-app.onrender.com'),
  FILE_BASE_URL: getEnvVar('VITE_FILE_BASE_URL', 'https://your-render-app.onrender.com'),
  NODE_ENV: 'production'
};

// Determine current environment
const getCurrentEnvironment = (): EnvironmentConfig => {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

// Export current environment config
export const env = getCurrentEnvironment();

// Export individual values for convenience
export const API_BASE_URL = env.API_BASE_URL;
export const SOCKET_URL = env.SOCKET_URL;
export const FILE_BASE_URL = env.FILE_BASE_URL;
export const NODE_ENV = env.NODE_ENV;

// Utility functions
export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production';

// Debug logging (only in development)
if (isDevelopment()) {
  console.log('🌍 Environment Configuration:', {
    API_BASE_URL,
    SOCKET_URL,
    FILE_BASE_URL,
    NODE_ENV
  });
}

export default env; 