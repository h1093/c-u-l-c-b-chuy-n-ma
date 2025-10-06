import React, { useState } from 'react';
import type { GameState, PlayerTendencies } from '../types';
import { 
    MOTIVATIONS, 
    SKILLS, 
    FEARS, 
    TENDENCIES_APPROACH, 
    TENDENCIES_DANGER, 
    TENDENCIES_SOCIAL, 
    TENDENCIES_SUPERNATURAL, 
    DEFINING_TRAITS,
    type Option
} from '../constants/characterCreation';

type CharacterData = Omit<GameState, 'playerStats' | 'relationships' | 'inventory' | 'storyFlags' | 'currentSceneId' | 'journal' | 'mentalState' | 'mentalStateDescription' | 'memoryFragments' | 'hubActionsRemaining'>;

interface CharacterCreationScreenProps {
  prologueDescription: string;
  onConfirm: (characterData: CharacterData) => void;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ prologueDescription, onConfirm }) => {
  const [step, setStep] = useState(0);
  const [character, setCharacter] = useState<CharacterData>({
    playerName: '',
    playerGender: '',
    playerMotivation: '',
    playerSkill: '',
    playerFear: '',
    playerTendencies: { approach: '', danger: '', social: '', supernatural: ''},
    playerDefiningTrait: '',
    // FIX: Added missing 'knownCharacters' property to satisfy the CharacterData type.
    knownCharacters: [],
  });

  const handleNextStep = () => setStep(prev => prev + 1);

  const handleConfirm = () => {
    onConfirm(character);
  };

  const isStep0Complete = character.playerName && character.playerGender && character.playerMotivation && character.playerSkill && character.playerFear;
  const isStep1Complete = character.playerTendencies.approach && character.playerTendencies.danger && character.playerTendencies.social && character.playerTendencies.supernatural && character.playerDefiningTrait;


  const renderOption = (
    option: Option,
    stateKey: keyof Omit<CharacterData, 'playerTendencies'>,
    singleChoice: boolean = true,
  ) => (
    <button
      key={option.value}
      onClick={() => setCharacter(prev => ({ ...prev, [stateKey]: option.value }))}
      className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${character[stateKey] === option.value ? 'bg-red-800 border-red-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'} ${singleChoice ? 'md:col-span-1' : ''}`}
    >
      <p className="font-bold text-lg text-gray-100">{option.label}</p>
      <p className="text-sm text-gray-400 mt-1">{option.description}</p>
    </button>
  );

   const renderTendencyOption = (
    option: Option,
    tendencyKey: keyof PlayerTendencies,
  ) => (
    <button
      key={option.value}
      onClick={() => setCharacter(prev => ({ ...prev, playerTendencies: {...prev.playerTendencies, [tendencyKey]: option.value } }))}
      className={`w-full text-left p-3 border rounded-lg transition-colors duration-200 ${character.playerTendencies[tendencyKey] === option.value ? 'bg-red-800 border-red-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
    >
      <p className="font-semibold text-gray-100">{option.label}</p>
    </button>
  );

  const getTendencyText = (tendencyKey: keyof PlayerTendencies) => {
    const value = character.playerTendencies[tendencyKey];
    switch (tendencyKey) {
        case 'approach': return value === 'action' ? 'hành động trước' : 'suy nghĩ kỹ';
        case 'danger': return value === 'calm' ? 'giữ bình tĩnh' : 'cảnh giác cao độ';
        case 'social': return value === 'extrovert' ? 'cởi mở với người khác' : 'thích quan sát';
        case 'supernatural': return value === 'believer' ? 'tin vào siêu nhiên' : 'hoài nghi mọi thứ';
        default: return '';
    }
  }

  const renderContent = () => {
    switch (step) {
      case 0: // Basic Info
        return (
             <div className="space-y-8 bg-black bg-opacity-20 p-6 rounded-lg">
                <div>
                    <label className="block text-xl font-bold text-red-400 mb-2">Tên của bạn là gì?</label>
                    <p className="text-sm text-gray-400 mb-3">Một cái tên để những bóng ma thì thầm trong đêm.</p>
                    <input 
                        type="text" 
                        value={character.playerName}
                        onChange={(e) => setCharacter(prev => ({ ...prev, playerName: e.target.value }))}
                        placeholder="Nhập tên nhân vật..."
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Giới tính</h2>
                    <div className="flex space-x-4">
                        {["Nam", "Nữ", "Khác"].map(gender => (
                            <button key={gender} onClick={() => setCharacter(prev => ({ ...prev, playerGender: gender }))}
                            className={`px-6 py-2 border rounded-lg transition ${character.playerGender === gender ? 'bg-red-800 border-red-600' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}>
                                {gender}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Lý do bạn đến Cheongrim?</h2>
                    <p className="text-sm text-gray-400 mb-3">Mỗi người đều có một lý do, một động lực đẩy họ vào bóng tối.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{MOTIVATIONS.map(opt => renderOption(opt, 'playerMotivation'))}</div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Bạn có tài năng đặc biệt nào?</h2>
                    <p className="text-sm text-gray-400 mb-3">Một chút lợi thế có thể là ranh giới giữa sống và chết.</p>
                    <div className="space-y-4">{SKILLS.map(opt => renderOption(opt, 'playerSkill'))}</div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Điều gì khiến bạn sợ hãi?</h2>
                    <p className="text-sm text-gray-400 mb-3">Biết rõ điểm yếu của mình là bước đầu tiên để đối mặt với nó... hoặc bị nó nuốt chửng.</p>
                    <div className="space-y-4">{FEARS.map(opt => renderOption(opt, 'playerFear'))}</div>
                </div>
                <div className="pt-4 text-center">
                    <button onClick={handleNextStep} disabled={!isStep0Complete} className="px-10 py-4 bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
                        Tiếp tục định hình tính cách
                    </button>
                </div>
            </div>
        );
      case 1: // Personality
        return (
            <div className="space-y-8 bg-black bg-opacity-20 p-6 rounded-lg">
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Khi đối mặt với một bí ẩn...</h2>
                    <div className="grid grid-cols-2 gap-4">{TENDENCIES_APPROACH.map(opt => renderTendencyOption(opt, 'approach'))}</div>
                </div>
                 <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Khi gặp nguy hiểm...</h2>
                    <div className="grid grid-cols-2 gap-4">{TENDENCIES_DANGER.map(opt => renderTendencyOption(opt, 'danger'))}</div>
                </div>
                 <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Trong các mối quan hệ xã hội...</h2>
                    <div className="grid grid-cols-2 gap-4">{TENDENCIES_SOCIAL.map(opt => renderTendencyOption(opt, 'social'))}</div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Thái độ của bạn với siêu nhiên...</h2>
                    <div className="grid grid-cols-2 gap-4">{TENDENCIES_SUPERNATURAL.map(opt => renderTendencyOption(opt, 'supernatural'))}</div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Đặc điểm nổi bật nhất của bạn là gì?</h2>
                    <p className="text-sm text-gray-400 mb-3">Điều này sẽ là cốt lõi trong con người bạn.</p>
                    <div className="space-y-4">{DEFINING_TRAITS.map(opt => renderOption(opt, 'playerDefiningTrait'))}</div>
                </div>
                 <div className="pt-4 text-center">
                    <button onClick={handleNextStep} disabled={!isStep1Complete} className="px-10 py-4 bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
                        Hoàn tất và Xác nhận
                    </button>
                </div>
            </div>
        );
      case 2: // Confirmation
        return (
            <div className="max-w-2xl w-full bg-black bg-opacity-30 p-8 rounded-xl shadow-2xl shadow-red-900/20">
                <h1 className="text-4xl font-serif-display text-red-500 mb-6 text-center">Xác Nhận Nhân Vật</h1>
                <div className="space-y-2 text-lg text-gray-300 leading-relaxed">
                    <p>Bạn là <strong className="text-white">{character.playerName}</strong>, một học sinh <strong className="text-white">{character.playerGender.toLowerCase()}</strong> mới của trường Cheongrim, chuyển đến đây để <strong className="text-white">{character.playerMotivation.toLowerCase()}</strong>.</p>
                    <p>Với kỹ năng đặc biệt là <strong className="text-white">{character.playerSkill.toLowerCase()}</strong> và đặc điểm nổi bật <strong className="text-white">"{character.playerDefiningTrait}"</strong>, bạn có xu hướng <strong className="text-white">{getTendencyText('approach')}</strong> khi gặp bí ẩn và <strong className="text-white">{getTendencyText('danger')}</strong> khi đối mặt nguy hiểm. Bạn là người <strong className="text-white">{getTendencyText('social')}</strong> và <strong className="text-white">{getTendencyText('supernatural')}</strong>.</p>
                    <p>Tuy nhiên, sâu thẳm bên trong, bạn luôn mang theo nỗi sợ về <strong className="text-white">{character.playerFear.toLowerCase()}</strong>.</p>
                </div>
                <p className="text-center text-gray-400 italic mt-8">
                    "Đây là con người bạn. Số phận của bạn tại ngôi trường Cheongrim bắt đầu từ đây. Sẽ không có đường lui."
                </p>
                <div className="mt-8 text-center">
                    <button
                        onClick={handleConfirm}
                        className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        Bắt đầu cuộc hành trình
                    </button>
                </div>
            </div>
        );
    }
  }


  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full">
         {step < 2 ? (
            <>
                <h1 className="text-4xl md:text-5xl font-serif-display text-red-500 mb-6 text-center">
                    {step === 0 ? "Tạo Dựng Nhân Vật" : "Định Hình Tính Cách"}
                </h1>
                <div className="text-lg leading-relaxed text-gray-400 whitespace-pre-wrap font-serif-display mb-8 p-4 bg-black bg-opacity-20 rounded-lg italic border-l-4 border-red-800">
                    {step === 0 ? prologueDescription : "Các lựa chọn tính cách sẽ định hình cách nhân vật phản ứng với các sự kiện, cách các NPC nhìn nhận bạn, và có thể mở ra hoặc đóng lại một số con đường cốt truyện nhất định."}
                </div>
            </>
         ) : null}
        {renderContent()}
      </div>
    </div>
  );
};

export default CharacterCreationScreen;