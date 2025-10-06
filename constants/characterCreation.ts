export interface Option {
  value: string;
  label: string;
  description: string;
}

export const MOTIVATIONS: Option[] = [
  { value: "Tìm kiếm sự khởi đầu mới", label: "Tìm kiếm sự khởi đầu mới", description: "Bạn muốn bỏ lại quá khứ phía sau. Điều này có thể giúp bạn tập trung vào việc điều tra các bí ẩn." },
  { value: "Theo gia đình chuyển đến", label: "Theo gia đình chuyển đến", description: "Bạn dễ dàng thích nghi với môi trường mới và có khả năng thấu hiểu người khác." },
  { value: "Nghe nói về những câu chuyện ma ở đây", label: "Nghe nói về những câu chuyện ma ở đây", description: "Sự tò mò về siêu nhiên chảy trong huyết quản của bạn, giúp bạn nhận ra những điều người thường không thấy." },
  { value: "Bị cuốn hút bởi những điều bí ẩn", label: "Bị cuốn hút bởi những điều bí ẩn", description: "Bạn có một đầu óc logic và luôn tìm kiếm lời giải đáp hợp lý cho mọi việc." },
];

export const SKILLS: Option[] = [
  { value: "Khả năng quan sát tinh tường", label: "Khả năng quan sát tinh tường", description: "Bạn dễ dàng nhận ra những chi tiết nhỏ, những manh mối bị ẩn giấu trong tầm mắt." },
  { value: "Kiến thức rộng về văn hóa dân gian/truyền thuyết", label: "Kiến thức về văn hóa dân gian", description: "Giúp bạn nhận diện các hiện tượng siêu nhiên và ý nghĩa của những biểu tượng kỳ lạ." },
  { value: "Kỹ năng giao tiếp tốt", label: "Kỹ năng giao tiếp tốt", description: "Bạn dễ dàng bắt chuyện và khiến người khác tin tưởng, hé lộ những thông tin quan trọng." },
];

export const FEARS: Option[] = [
  { value: "Sợ bóng tối/không gian kín", label: "Sợ bóng tối/không gian kín", description: "Những nơi tăm tối và chật hẹp sẽ thử thách tinh thần của bạn đến cực hạn." },
  { value: "Dễ bị dao động/lo lắng", label: "Dễ bị dao động/lo lắng", description: "Bạn khó giữ được bình tĩnh dưới áp lực, có thể dẫn đến những quyết định sai lầm." },
  { value: "Không tin vào những điều siêu nhiên", label: "Không tin vào những điều siêu nhiên", description: "Chủ nghĩa hoài nghi của bạn là một tấm khiên, nhưng cũng có thể là một điểm mù chết người." },
];

export const TENDENCIES_APPROACH: Option[] = [
    { value: "action", label: "Hành động trước, tìm kiếm bằng chứng trực tiếp.", description: "Tăng khuynh hướng 'Hành động/Quyết đoán'." },
    { value: "analysis", label: "Suy nghĩ kỹ, phân tích thông tin trước khi hành động.", description: "Tăng khuynh hướng 'Phân tích/Thận trọng'." },
];
export const TENDENCIES_DANGER: Option[] = [
    { value: "calm", label: "Giữ bình tĩnh và tìm cách đối phó.", description: "Tăng khuynh hướng 'Bình tĩnh/Dũng cảm'." },
    { value: "anxious", label: "Dễ lo lắng, cảnh giác và có thể tìm cách tránh né.", description: "Tăng khuynh hướng 'Cảnh giác/Lo âu'." },
];
export const TENDENCIES_SOCIAL: Option[] = [
    { value: "extrovert", label: "Thích nói chuyện và dễ dàng kết bạn mới.", description: "Tăng khuynh hướng 'Hướng ngoại/Thân thiện'." },
    { value: "introvert", label: "Thích quan sát hơn là nói chuyện và hơi dè dặt với người lạ.", description: "Tăng khuynh hướng 'Hướng nội/Thận trọng xã hội'." },
];
export const TENDENCIES_SUPERNATURAL: Option[] = [
    { value: "believer", label: "Tò mò và sẵn sàng tin vào những điều không giải thích được.", description: "Tăng khuynh hướng 'Cởi mở/Tin tưởng'." },
    { value: "skeptic", label: "Hoài nghi và cần bằng chứng vững chắc cho mọi chuyện.", description: "Tăng khuynh hướng 'Hoài nghi/Thực tế'." },
];

export const DEFINING_TRAITS: Option[] = [
    { value: "Lòng trắc ẩn mạnh mẽ", label: "Lòng trắc ẩn mạnh mẽ", description: "Bạn luôn cố gắng giúp đỡ người khác, kể cả những linh hồn." },
    { value: "Ý chí sắt đá", label: "Ý chí sắt đá", description: "Bạn khó bị thao túng, kiên cường trước áp lực tâm lý." },
    { value: "Óc hài hước bất ngờ", label: "Óc hài hước bất ngờ", description: "Bạn có thể dùng sự hài hước để giảm căng thẳng hoặc tạo dựng mối quan hệ." },
    { value: "Sự tò mò không đáy", label: "Sự tò mò không đáy", description: "Bạn sẽ không ngừng tìm kiếm sự thật, dù nguy hiểm đến đâu." },
]
