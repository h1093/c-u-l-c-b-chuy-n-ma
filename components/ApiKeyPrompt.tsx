import React, { useState } from 'react';

interface ApiKeyPromptProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="text-center max-w-lg w-full bg-black bg-opacity-30 p-8 rounded-lg border border-red-800 shadow-lg shadow-red-900/20">
        <h1 className="text-3xl font-serif-display text-red-500 mb-4">Yêu Cầu Khóa API</h1>
        <p className="text-gray-400 mb-6">
          Để bắt đầu trò chơi, vui lòng cung cấp khóa API Gemini của bạn. Khóa sẽ chỉ được lưu trong phiên duyệt web này và sẽ tự động bị xóa khi bạn đóng tab.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Dán khóa API của bạn vào đây..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            autoFocus
          />
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Lưu và Bắt Đầu
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-6">
          Bạn có thể lấy khóa API của mình từ Google AI Studio.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
