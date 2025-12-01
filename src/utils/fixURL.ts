export const fixImageUrl = (url: string | undefined): string => {
    if (!url) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
    // Tìm chuỗi bắt đầu bằng http hoặc https nằm trong string
    const match = url.match(/(https?:\/\/[^\s]+)/);
    if (match) return match[0];

    // Xử lý nếu là đường dẫn tương đối
    if (url.startsWith("/")) return `http://localhost:8080${url}`;

    return url;
};