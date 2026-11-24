// Danh mục theo môn thể thao
const CATS = [
  { id: 'bongda',  name: 'Bóng đá',  icon: '⚽' },
  { id: 'chaybo',  name: 'Chạy bộ',  icon: '🏃' },
  { id: 'caulong', name: 'Cầu lông', icon: '🏸' },
  { id: 'gym',     name: 'Gym',      icon: '🏋️' }
];

// Nhóm kích cỡ dùng lại cho nhiều sản phẩm
const SIZE_AO   = ['S', 'M', 'L', 'XL', 'XXL'];
const SIZE_GIAY = ['39', '40', '41', '42', '43', '44'];
const SIZE_FREE = ['Free size'];

// Danh sách sản phẩm
const PRODUCTS = [
  { id: 1, name: 'Áo đấu CLB sân nhà 2026', cat: 'bongda', price: 450000, material: 'Polyester thoáng khí', desc: 'Áo thi đấu form regular, thấm hút mồ hôi nhanh.', sizes: SIZE_AO, icon: '👕', color: '#dbe5ff', isNew: true, hot: true },
  { id: 2, name: 'Giày đá bóng sân cỏ nhân tạo', cat: 'bongda', price: 890000, material: 'Da tổng hợp, đế TF', desc: 'Đinh thấp bám sân cỏ nhân tạo, ôm chân.', sizes: SIZE_GIAY, icon: '👟', color: '#ffe9b8', isNew: true, hot: false },
  { id: 3, name: 'Giày chạy bộ đệm êm', cat: 'chaybo', price: 1250000, material: 'Lưới mesh, đế foam', desc: 'Đệm êm cho cự ly 10–21km, trọng lượng nhẹ.', sizes: SIZE_GIAY, icon: '👟', color: '#ffd9d9', isNew: true, hot: true },
  { id: 4, name: 'Quần short chạy bộ 2 lớp', cat: 'chaybo', price: 240000, material: 'Polyester co giãn', desc: 'Lớp lót trong chống cọ xát, có túi khóa kéo.', sizes: SIZE_AO, icon: '🩳', color: '#ede9fe', isNew: false, hot: true },
  { id: 5, name: 'Vợt cầu lông carbon', cat: 'caulong', price: 780000, material: 'Khung carbon', desc: 'Vợt nhẹ 4U, thiên về công, kèm bao vợt.', sizes: SIZE_FREE, icon: '🏸', color: '#fde68a', isNew: true, hot: true },
  { id: 6, name: 'Giày cầu lông chống trượt', cat: 'caulong', price: 950000, material: 'Mesh, đế cao su', desc: 'Đế chống trượt, hỗ trợ cổ chân khi di chuyển.', sizes: SIZE_GIAY, icon: '👟', color: '#fecaca', isNew: false, hot: false },
  { id: 7, name: 'Áo tập gym ôm co giãn', cat: 'gym', price: 260000, material: 'Cotton pha spandex', desc: 'Ôm dáng, co giãn tốt khi tập tạ.', sizes: SIZE_AO, icon: '👕', color: '#e2e8f0', isNew: true, hot: false },
  { id: 8, name: 'Quần jogger tập gym', cat: 'gym', price: 420000, material: 'Nỉ da cá', desc: 'Bo gấu, túi hai bên, mặc tập và đi chơi.', sizes: SIZE_AO, icon: '👖', color: '#fbcfe8', isNew: false, hot: true }
];