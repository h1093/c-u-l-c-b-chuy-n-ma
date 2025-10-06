import React, { useState } from 'react';
import type { GameState, PlayerTendencies } from '../types';

type CharacterData = Omit<GameState, 'playerStats' | 'relationships' | 'inventory' | 'storyFlags' | 'currentSceneId' | 'journal' | 'mentalState' | 'mentalStateDescription' | 'memoryFragments' | 'hubActionsRemaining'>;

interface CharacterCreationScreenProps {
  prologueDescription: string;
  onConfirm: (characterData: CharacterData) => void;
}

interface Option {
  value: string;
  label: string;
  description: string;
}

const MOTIVATIONS: Option[] = [
  { value: "Tìm kiếm sự khởi đầu mới", label: "Tìm kiếm sự khởi đầu mới", description: "Bạn muốn bỏ lại quá khứ phía sau. Điều này có thể giúp bạn tập trung vào việc điều tra các bí ẩn." },
  { value: "Theo gia đình chuyển đến", label: "Theo gia đình chuyển đến", description: "Bạn dễ dàng thích nghi với môi trường mới và có khả năng thấu hiểu người khác." },
  { value: "Nghe nói về những câu chuyện ma ở đây", label: "Nghe nói về những câu chuyện ma ở đây", description: "Sự tò mò về siêu nhiên chảy trong huyết quản của bạn, giúp bạn nhận ra những điều người thường không thấy." },
  { value: "Bị cuốn hút bởi những điều bí ẩn", label: "Bị cuốn hút bởi những điều bí ẩn", description: "Bạn có một đầu óc logic và luôn tìm kiếm lời giải đáp hợp lý cho mọi việc." },
];

const SKILLS: Option[] = [
  { value: "Khả năng quan sát tinh tường", label: "Khả năng quan sát tinh tường", description: "Bạn dễ dàng nhận ra những chi tiết nhỏ, những manh mối bị ẩn giấu trong tầm mắt." },
  { value: "Kiến thức rộng về văn hóa dân gian/truyền thuyết", label: "Kiến thức về văn hóa dân gian", description: "Giúp bạn nhận diện các hiện tượng siêu nhiên và ý nghĩa của những biểu tượng kỳ lạ." },
  { value: "Kỹ năng giao tiếp tốt", label: "Kỹ năng giao tiếp tốt", description: "Bạn dễ dàng bắt chuyện và khiến người khác tin tưởng, hé lộ những thông tin quan trọng." },
];

const FEARS: Option[] = [
  { value: "Sợ bóng tối/không gian kín", label: "Sợ bóng tối/không gian kín", description: "Những nơi tăm tối và chật hẹp sẽ thử thách tinh thần của bạn đến cực hạn." },
  { value: "Dễ bị dao động/lo lắng", label: "Dễ bị dao động/lo lắng", description: "Bạn khó giữ được bình tĩnh dưới áp lực, có thể dẫn đến những quyết định sai lầm." },
  { value: "Không tin vào những điều siêu nhiên", label: "Không tin vào những điều siêu nhiên", description: "Chủ nghĩa hoài nghi của bạn là một tấm khiên, nhưng cũng có thể là một điểm mù chết người." },
];

const TENDENCIES_APPROACH: Option[] = [
    { value: "action", label: "Hành động trước, tìm kiếm bằng chứng trực tiếp.", description: "Tăng khuynh hướng 'Hành động/Quyết đoán'." },
    { value: "analysis", label: "Suy nghĩ kỹ, phân tích thông tin trước khi hành động.", description: "Tăng khuynh hướng 'Phân tích/Thận trọng'." },
];
const TENDENCIES_DANGER: Option[] = [
    { value: "calm", label: "Giữ bình tĩnh và tìm cách đối phó.", description: "Tăng khuynh hướng 'Bình tĩnh/Dũng cảm'." },
    { value: "anxious", label: "Dễ lo lắng, cảnh giác và có thể tìm cách tránh né.", description: "Tăng khuynh hướng 'Cảnh giác/Lo âu'." },
];
const TENDENCIES_SOCIAL: Option[] = [
    { value: "extrovert", label: "Thích nói chuyện và dễ dàng kết bạn mới.", description: "Tăng khuynh hướng 'Hướng ngoại/Thân thiện'." },
    { value: "introvert", label: "Thích quan sát hơn là nói chuyện và hơi dè dặt với người lạ.", description: "Tăng khuynh hướng 'Hướng nội/Thận trọng xã hội'." },
];
const TENDENCIES_SUPERNATURAL: Option[] = [
    { value: "believer", label: "Tò mò và sẵn sàng tin vào những điều không giải thích được.", description: "Tăng khuynh hướng 'Cởi mở/Tin tưởng'." },
    { value: "skeptic", label: "Hoài nghi và cần bằng chứng vững chắc cho mọi chuyện.", description: "Tăng khuynh hướng 'Hoài nghi/Thực tế'." },
];

const DEFINING_TRAITS: Option[] = [
    { value: "Lòng trắc ẩn mạnh mẽ", label: "Lòng trắc ẩn mạnh mẽ", description: "Bạn luôn cố gắng giúp đỡ người khác, kể cả những linh hồn." },
    { value: "Ý chí sắt đá", label: "Ý chí sắt đá", description: "Bạn khó bị thao túng, kiên cường trước áp lực tâm lý." },
    { value: "Óc hài hước bất ngờ", label: "Óc hài hước bất ngờ", description: "Bạn có thể dùng sự hài hước để giảm căng thẳng hoặc tạo dựng mối quan hệ." },
    { value: "Sự tò mò không đáy", label: "Sự tò mò không đáy", description: "Bạn sẽ không ngừng tìm kiếm sự thật, dù nguy hiểm đến đâu." },
]


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
