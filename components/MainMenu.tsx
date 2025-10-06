
import React from 'react';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  hasSaveData: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onLoadGame, hasSaveData }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-serif-display text-red-500 mb-4 tracking-wider">Câu Lạc Bộ Truyện Ma</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-serif-display italic">Nỗi sợ không đến từ những gì bạn thấy...</p>
        <p className="text-gray-400 mb-12 leading-relaxed">
          Bạn là thành viên mới của câu lạc bộ bí ẩn nhất trường cấp ba Cheongrim. Mỗi hành lang, mỗi lớp học đều ẩn giấu một câu chuyện chưa kể, một bí mật kinh hoàng. Lựa chọn của bạn sẽ quyết định số phận, hé lộ sự thật, hoặc nhấn chìm bạn vào bóng tối vĩnh viễn.
        </p>
        <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
          <button
            onClick={onNewGame}
            className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Trò Chơi Mới
          </button>
          {hasSaveData && (
            <button
              onClick={onLoadGame}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Tiếp Tục
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
