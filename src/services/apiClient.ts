import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add authentication tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Extract data from successful responses
        return response;
    },
    (error: AxiosError<any>) => {
        // Handle errors globally
        let errorMessage = 'Đã xảy ra lỗi khi kết nối với server';

        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    errorMessage = data?.message || 'Dữ liệu không hợp lệ';
                    break;
                case 401:
                    errorMessage = 'Bạn cần đăng nhập để thực hiện thao tác này';
                    break;
                case 403:
                    errorMessage = 'Bạn không có quyền truy cập';
                    break;
                case 404:
                    errorMessage = data?.message || 'Không tìm thấy dữ liệu';
                    break;
                case 500:
                    errorMessage = 'Lỗi server. Vui lòng thử lại sau';
                    break;
                default:
                    errorMessage = data?.message || errorMessage;
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
        } else {
            // Something else happened
            errorMessage = error.message || errorMessage;
        }

        // Show error toast
        toast.error(errorMessage);

        return Promise.reject(error);
    }
);

export default apiClient;
