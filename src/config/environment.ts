// Environment configuration for Vercel deployment
interface EnvironmentConfig {
  API_BASE_URL: string;
  SOCKET_URL: string;
  FILE_BASE_URL: string;
  NODE_ENV: string;
}

// Get environment variables with proper fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  return fallback;
};

// Check if we're in production based on multiple indicators
const isProductionEnv = (): boolean => {
  // Check Vite mode
  if (import.meta.env?.MODE === 'production') return true;
  
  // Check if we're on Vercel (production deployment)
  if (import.meta.env?.VITE_VERCEL_ENV === 'production') return true;
  
  // Check if we're accessing from a production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') return true;
  }
  
  // Check NODE_ENV
  if (import.meta.env?.NODE_ENV === 'production') return true;
  
  return false;
};

// Production environment (Vercel + Render)
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://cosmicproject-backend-1.onrender.com/api',
  SOCKET_URL: 'https://cosmicproject-backend-1.onrender.com',
  FILE_BASE_URL: 'https://cosmicproject-backend-1.onrender.com',
  NODE_ENV: 'production'
};

// Development environment (localhost)
const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:5000/api',
  SOCKET_URL: 'http://localhost:5000',
  FILE_BASE_URL: 'http://localhost:5000',
  NODE_ENV: 'development'
};

// Determine current environment config
const getCurrentEnvironment = (): EnvironmentConfig => {
  // Force production config if environment variables are set
  const viteApiUrl = getEnvVar('VITE_API_BASE_URL', '');
  const viteSocketUrl = getEnvVar('VITE_SOCKET_URL', '');
  const viteFileUrl = getEnvVar('VITE_FILE_BASE_URL', '');
  
  if (viteApiUrl && viteSocketUrl && viteFileUrl) {
    return {
      API_BASE_URL: viteApiUrl,
      SOCKET_URL: viteSocketUrl,
      FILE_BASE_URL: viteFileUrl,
      NODE_ENV: 'production'
    };
  }
  
  // Otherwise use environment detection
  return isProductionEnv() ? productionConfig : developmentConfig;
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

// Debug logging
console.log('🌍 Environment Configuration:', {
  API_BASE_URL,
  SOCKET_URL,
  FILE_BASE_URL,
  NODE_ENV,
  MODE: import.meta.env?.MODE,
  VITE_API_BASE_URL: import.meta.env?.VITE_API_BASE_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
});

export default env;