const API_KEY_SESSION_STORAGE_KEY = 'gemini_api_key';

/**
 * Cung cấp một nguồn đáng tin cậy duy nhất cho khóa API.
 * Ưu tiên biến môi trường cho các môi trường sản xuất/bảo mật,
 * nhưng dự phòng vào sessionStorage để phát triển và thử nghiệm cục bộ thuận tiện.
 */
export const getApiKey = (): string | undefined => {
  // 1. Thử lấy khóa từ biến môi trường (an toàn nhất)
  // Trong môi trường development của aistudio, process.env.API_KEY được điền tự động.
  const envKey = process.env.API_KEY;
  if (envKey) {
    return envKey;
  }

  // 2. Dự phòng vào session storage để thử nghiệm cục bộ
  try {
    const sessionKey = sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY);
    if (sessionKey) {
      return sessionKey;
    }
  } catch (e) {
    console.error('Không thể truy cập session storage:', e);
  }

  return undefined;
};

/**
 * Cho phép giao diện người dùng đặt khóa API cho phiên hiện tại.
 */
export const setApiKey = (key: string): void => {
  try {
    sessionStorage.setItem(API_KEY_SESSION_STORAGE_KEY, key);
  } catch (e)
    {
    console.error('Không thể đặt khóa API vào session storage:', e);
  }
};
