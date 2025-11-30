import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for httpOnly cookies
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // No need to manually add JWT - it's sent automatically via httpOnly cookie
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<any>) => {
        let errorMessage = 'Đã xảy ra lỗi khi kết nối với server';

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    errorMessage = data?.message || 'Dữ liệu không hợp lệ';
                    break;
                case 401:
                    errorMessage = 'Bạn cần đăng nhập để thực hiện thao tác này';

                    // Only redirect to login for protected routes (admin/staff routes)
                    // Public client routes should not redirect
                    const isProtectedRoute = window.location.pathname.startsWith('/admin') ||
                        window.location.pathname.startsWith('/staff');

                    if (isProtectedRoute && window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
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
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
        } else {
            errorMessage = error.message || errorMessage;
        }

        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

export default apiClient;
