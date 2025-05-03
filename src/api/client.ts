import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('VITE_API_URL is not defined in environment variables');
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

class ApiClient {
  private token: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 10000 // Add timeout to prevent long-hanging requests
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Response error:', error);
        
        if (axios.isAxiosError(error)) {
          // Network error (no response received)
          if (!error.response) {
            let message = 'Unable to connect to the server.';
            
            // Check if it's a CORS error
            if (error.message.includes('Network Error')) {
              message = 'Network error: Please check your internet connection and try again. If the problem persists, contact support.';
            } else if (error.code === 'ECONNABORTED') {
              message = 'The server is taking too long to respond. Please try again later.';
            }
            
            toast.error(message);
            return Promise.reject(new Error(message));
          }
          
          // Server responded with error
          if (error.response.status === 401) {
            this.clearToken();
            window.location.href = '/';
            return Promise.reject(error);
          }

          // Handle specific HTTP status codes
          switch (error.response.status) {
            case 404:
              toast.error('The requested resource was not found.');
              break;
            case 500:
              toast.error('An internal server error occurred. Please try again later.');
              break;
            default:
              toast.error(error.response.data?.message || 'An unexpected error occurred');
          }
          
          return Promise.reject(error);
        }
        
        // Non-Axios error
        toast.error('An unexpected error occurred. Please try again.');
        return Promise.reject(error);
      }
    );
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<ApiResponse<T>> {
    if (response.status === 204) {
      return {};
    }
    return response.data;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(endpoint);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    delete this.axiosInstance.defaults.headers.common.Authorization;
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
  }
}

export const api = new ApiClient();