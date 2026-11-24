// ===== PHẦN 1: Hàm dùng chung =====
const money = n => Number(n).toLocaleString('vi-VN') + '₫';
const products = () => PRODUCTS;   // bước 8 sẽ nâng cấp để đọc từ localStorage
const cart = () => JSON.parse(localStorage.getItem('cart')) || [];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CAT = id => CATS.find(c => c.id === id) || { name: '', icon: '🏅' };

// Khung ảnh tạm (emoji trên nền màu)
const pic = p => `<div class="pic" style="background:${p.color}">${p.icon}</div>`;

// Thẻ sản phẩm, dùng lại ở nhiều trang
const card = p => `
  <div class="col-6 col-lg-3">
    <a class="card h-100 text-decoration-none" href="detail.html?id=${p.id}">
      ${pic(p)}
      <div class="card-body">
        <small class="text-muted">${CAT(p.cat).name}</small>
        <h3 class="h6 text-dark">${esc(p.name)}</h3>
        <strong class="price">${money(p.price)}</strong>
      </div>
    </a>
  </div>`;

// Cập nhật số lượng trên biểu tượng giỏ hàng
const badge = () => $('#cart-count').text(cart().reduce((s, i) => s + i.qty, 0));


// ===== PHẦN 2: Header và footer dùng chung =====
function layout() {
  $('#site-header').html(`
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand brand" href="index.html">Sport<b>Zone</b></a>
        <button class="navbar-toggler bg-light" data-bs-toggle="collapse" data-bs-target="#nv">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nv">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" href="index.html">Trang chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html">Sản phẩm</a></li>
            <li class="nav-item"><a class="nav-link" href="admin.html">Quản trị</a></li>
          </ul>
          <form class="d-flex me-3" action="products.html">
            <input class="form-control" name="q" placeholder="Tìm sản phẩm...">
          </form>
          <a class="nav-link text-white" href="cart.html">
            Giỏ hàng <span id="cart-count" class="badge bg-warning text-dark">0</span>
          </a>
        </div>
      </div>
    </nav>`);

  $('#site-footer').html(`
    <div class="container">
      <strong class="brand fs-4">Sport<b>Zone</b></strong>
      <p class="mb-1">Đồ thể thao cho bóng đá, chạy bộ, cầu lông và gym.</p>
      <small>Đổi trả trong 7 ngày nếu sai size. Hotline 0123 456 789.</small>
    </div>`);

  badge();
}


// ===== PHẦN 3: Trang chủ =====
function home() {
  const ps = products();
  const slides = [
    ['Mùa giải mới, đôi giày mới', 'bongda',  '#1f4fd8'],
    ['Chạy xa hơn, nhẹ hơn',       'chaybo',  '#0e1b33'],
    ['Giảm đến 30% đồ cầu lông',   'caulong', '#b3261e']
  ];

  $('#app').html(`
    <div id="hero" class="carousel slide mb-4" data-bs-ride="carousel">
      <div class="carousel-inner rounded">
        ${slides.map((s, i) => `
          <div class="carousel-item ${i ? '' : 'active'}">
            <a href="products.html?cat=${s[1]}" class="slide text-decoration-none" style="background:${s[2]}">
              <h1>${s[0]}</h1>
              <span class="btn btn-warning align-self-start mt-3">Xem ngay</span>
            </a>
          </div>`).join('')}
      </div>
    </div>

    <h2>Chọn theo môn</h2>
    <div class="row g-3 mb-4">
      ${CATS.map(c => `
        <div class="col-6 col-md-3">
          <a class="card text-center p-3 text-decoration-none" href="products.html?cat=${c.id}">
            <div class="fs-1">${c.icon}</div>
            <h3 class="h5 text-dark mb-0">${c.name}</h3>
          </a>
        </div>`).join('')}
    </div>

    <h2>Sản phẩm mới về</h2>
    <div class="row g-3 mb-4">${ps.filter(p => p.isNew).slice(0, 4).map(card).join('')}</div>

    <h2>Bán chạy nhất</h2>
    <div class="row g-3">${ps.filter(p => p.hot).slice(0, 4).map(card).join('')}</div>`);
}


// ===== Khởi chạy =====
$(function () {
  layout();
  const page = document.body.dataset.page;
  if (page === 'home') home();
});