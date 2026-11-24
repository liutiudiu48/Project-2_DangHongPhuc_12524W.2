// ===== PHẦN 1: Hàm dùng chung =====
const money = n => Number(n).toLocaleString('vi-VN') + '₫';
// Lấy danh sách sản phẩm từ localStorage; lần đầu chưa có thì nạp dữ liệu mẫu
const products = () => {
  let p = JSON.parse(localStorage.getItem('products'));
  if (!p) {
    p = PRODUCTS;
    localStorage.setItem('products', JSON.stringify(p));
  }
  return p;
};
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
const badge = () => $('#cart-count').text(lines().reduce((s, l) => s + l.qty, 0));
// Ghép dữ liệu giỏ hàng với thông tin sản phẩm (tên, giá lấy từ PRODUCTS)
// k = vị trí của dòng trong giỏ, dùng để biết đang sửa dòng nào
const lines = () => cart()
  .map((i, k) => ({ ...i, k, p: products().find(x => x.id === i.id) }))
  .filter(l => l.p);   // bỏ dòng mà sản phẩm không còn tồn tại

// Tổng tiền cả giỏ
const total = () => lines().reduce((s, l) => s + l.p.price * l.qty, 0);

// Hiện thông báo nhỏ ở góc màn hình trong gần 2 giây
const toast = t => $('#msg').stop(true, true).text(t).fadeIn(150).delay(1800).fadeOut(300);

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
  $('body').append('<div id="msg" class="toast-msg"></div>');
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
    <div class="row g-3 mb-4">${ps.filter(p => p.isNew).slice(-4).reverse().map(card).join('')}</div>

    <h2>Bán chạy nhất</h2>
    <div class="row g-3">${ps.filter(p => p.hot).slice(0, 4).map(card).join('')}</div>`);
}

// ===== PHẦN 4: Trang danh mục =====
function productsPage() {
  // Đọc tham số trên địa chỉ, ví dụ products.html?cat=gym&q=áo
  const q = new URLSearchParams(location.search);

  // Gom tất cả kích cỡ đang có để làm danh sách chọn (loại trùng bằng Set)
  const sizes = [...new Set(products().flatMap(p => p.sizes))];

  // Vẽ khung trang: cột bộ lọc bên trái, lưới sản phẩm bên phải
  $('#app').html(`
    <div class="row">
      <aside class="col-md-3 mb-3">
        <form id="f" class="card p-3">
          <h2 class="h5">Bộ lọc</h2>

          <label class="form-label">Từ khóa</label>
          <input id="fq" class="form-control mb-3" value="${esc(q.get('q') || '')}">

          <label class="form-label">Môn thể thao</label>
          <select id="fc" class="form-select mb-3">
            <option value="">Tất cả</option>
            ${CATS.map(c => `<option value="${c.id}" ${q.get('cat') === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <label class="form-label">Khoảng giá</label>
          <select id="fp" class="form-select mb-3">
            <option value="">Tất cả</option>
            <option value="0-300000">Dưới 300.000₫</option>
            <option value="300000-700000">300.000₫ – 700.000₫</option>
            <option value="700000-999999999">Trên 700.000₫</option>
          </select>

          <label class="form-label">Kích cỡ</label>
          <select id="fs" class="form-select">
            <option value="">Tất cả</option>
            ${sizes.map(s => `<option>${s}</option>`).join('')}
          </select>
        </form>
      </aside>

      <section class="col-md-9">
        <p id="cnt" class="text-muted"></p>
        <div id="grid" class="row g-3"></div>
      </section>
    </div>`);

  // Lọc dữ liệu theo các ô đang chọn rồi vẽ lại lưới sản phẩm
  const draw = () => {
    const k = $('#fq').val().trim().toLowerCase();   // từ khóa
    const c = $('#fc').val();                        // môn
    const [lo, hi] = ($('#fp').val() || '0-999999999').split('-').map(Number);  // giá thấp, giá cao
    const s = $('#fs').val();                        // kích cỡ

    const result = products().filter(p =>
      (!k || p.name.toLowerCase().includes(k)) &&
      (!c || p.cat === c) &&
      p.price >= lo && p.price <= hi &&
      (!s || p.sizes.includes(s))
    );

    $('#cnt').text(result.length + ' sản phẩm');
    $('#grid').html(
      result.map(card).join('') ||
      '<p>Không có sản phẩm phù hợp. Hãy thử bỏ bớt bộ lọc.</p>'
    );
  };

  // Mỗi lần người dùng gõ hoặc chọn là lọc lại ngay; chặn form tải lại trang
  $('#f').on('input change', draw).on('submit', e => e.preventDefault());
  draw();   // vẽ lần đầu
}
// ===== PHẦN 5: Trang chi tiết =====
function detailPage() {
  // Lấy id trên địa chỉ: detail.html?id=3
  const id = new URLSearchParams(location.search).get('id');
  const p = products().find(x => x.id == id);   // dùng == vì id trên địa chỉ là chuỗi, id sản phẩm là số

  if (!p) {
    $('#app').html('<p>Không tìm thấy sản phẩm. <a href="products.html">Xem danh mục</a></p>');
    return;
  }

  // Sản phẩm chỉ có 1 size (như Free size) thì chọn sẵn
  let size = p.sizes.length === 1 ? p.sizes[0] : null;

  const chart = [
    ['S',   '1m55–1m64', '50–57kg'],
    ['M',   '1m60–1m69', '58–65kg'],
    ['L',   '1m68–1m75', '66–73kg'],
    ['XL',  '1m72–1m80', '74–82kg'],
    ['XXL', 'Từ 1m78',   '83–95kg']
  ];
  const isClothes = p.sizes.includes('M');   // chỉ quần áo mới có bảng size

  $('#app').html(`
    <div class="row g-4">
      <div class="col-md-5">${pic(p)}</div>
      <div class="col-md-7">
        <small class="text-muted">${CAT(p.cat).name}</small>
        <h1>${esc(p.name)}</h1>
        <p class="h3 price">${money(p.price)}</p>
        <p>${esc(p.desc)}</p>
        <p><b>Chất liệu:</b> ${esc(p.material)}</p>

        <div id="sz" class="mb-2">
          <b>Kích cỡ:</b>
          ${p.sizes.map(s => `<button type="button" class="btn btn-outline-dark size-btn ms-1 ${s === size ? 'on' : ''}">${s}</button>`).join('')}
        </div>
        <p>
          <small id="warn" class="text-danger d-none">Vui lòng chọn kích cỡ trước khi mua!</small>
          ${isClothes ? '<a href="#" data-bs-toggle="modal" data-bs-target="#sizeModal">Hướng dẫn đo size</a>' : ''}
        </p>

        <div class="input-group mb-3" style="max-width:140px">
          <button class="btn btn-outline-dark" id="m">−</button>
          <input id="qty" class="form-control text-center" value="1">
          <button class="btn btn-outline-dark" id="a">+</button>
        </div>
        <button id="add" class="btn btn-main btn-lg">Thêm vào giỏ hàng</button>
      </div>
    </div>

    <div class="modal fade" id="sizeModal">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header">
          <h2 class="h5 modal-title">Bảng chọn size quần áo</h2>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <table class="table">
            <tr><th>Size</th><th>Chiều cao</th><th>Cân nặng</th></tr>
            ${chart.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
          </table>
        </div>
      </div></div>
    </div>`);

  // Bấm một nút size: bỏ chọn nút cũ, chọn nút mới, tắt cảnh báo
  $('#sz').on('click', '.size-btn', function () {
    $('.size-btn').removeClass('on');
    $(this).addClass('on');
    size = $(this).text();
    $('#warn').addClass('d-none');
    $('#sz').removeClass('is-warn');
  });

  // Số lượng: luôn là số nguyên từ 1 trở lên
  const qn = () => Math.max(1, parseInt($('#qty').val()) || 1);
  $('#m').click(() => $('#qty').val(Math.max(1, qn() - 1)));
  $('#a').click(() => $('#qty').val(qn() + 1));

  // Thêm vào giỏ hàng
  $('#add').click(() => {
    if (!size) {                       // chưa chọn size thì báo và dừng
      $('#warn').removeClass('d-none');
      $('#sz').addClass('is-warn');
      return;
    }
    const c = cart();
    const item = c.find(i => i.id === p.id && i.size === size);
    if (item) item.qty += qn();                      // đã có cùng sản phẩm, cùng size: cộng thêm
    else c.push({ id: p.id, size, qty: qn() });      // chưa có: thêm dòng mới
    localStorage.setItem('cart', JSON.stringify(c));
    badge();
    toast('Đã thêm vào giỏ hàng');
  });
}
// ===== PHẦN 6: Trang giỏ hàng =====
function cartPage() {
  // Vẽ lại toàn bộ giỏ hàng; gọi mỗi khi giỏ thay đổi
  const draw = () => {
    const L = lines();

    // Giỏ trống: báo và gợi ý đi mua hàng
    if (!L.length) {
      $('#app').html('<h1>Giỏ hàng</h1><p>Giỏ hàng đang trống. <a href="products.html">Chọn sản phẩm</a></p>');
      badge();
      return;
    }

    $('#app').html(`
      <h1>Giỏ hàng</h1>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr><th>Sản phẩm</th><th>Size</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr>
          </thead>
          <tbody>
            ${L.map(l => `
              <tr>
                <td>${l.p.icon} ${esc(l.p.name)}</td>
                <td>${l.size}</td>
                <td>${money(l.p.price)}</td>
                <td>
                  <button class="btn btn-sm btn-outline-dark dec" data-k="${l.k}">−</button>
                  <b class="mx-2">${l.qty}</b>
                  <button class="btn btn-sm btn-outline-dark inc" data-k="${l.k}">+</button>
                </td>
                <td>${money(l.p.price * l.qty)}</td>
                <td><button class="btn btn-sm btn-outline-danger del" data-k="${l.k}">Xóa</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="h4 text-end">Tổng: <span class="price">${money(total())}</span></p>
      <div class="text-end"><a href="checkout.html" class="btn btn-main btn-lg">Đặt hàng</a></div>`);
    badge();
  };

  // Bấm +, − hoặc Xóa: sửa giỏ rồi vẽ lại
  $('#app').on('click', '.inc, .dec, .del', function () {
    const c = cart();
    const k = +$(this).data('k');                    // vị trí dòng cần sửa

    if ($(this).hasClass('del')) c.splice(k, 1);     // xóa dòng
    else {
      c[k].qty += $(this).hasClass('inc') ? 1 : -1;  // tăng hoặc giảm 1
      if (c[k].qty < 1) c.splice(k, 1);              // giảm xuống 0 thì xóa dòng
    }

    localStorage.setItem('cart', JSON.stringify(c));
    draw();
  });

  draw();   // vẽ lần đầu
}
// ===== PHẦN 7: Trang đặt hàng =====
function checkoutPage() {
  const L = lines();

  // Giỏ trống thì chưa thể đặt hàng
  if (!L.length) {
    $('#app').html('<h1>Đặt hàng</h1><p>Giỏ hàng trống nên chưa thể đặt hàng. <a href="products.html">Chọn sản phẩm</a></p>');
    return;
  }

  $('#app').html(`
    <h1>Đặt hàng</h1>
    <div class="row g-4">
      <form id="of" class="col-md-7" novalidate>
        <div class="mb-3">
          <label class="form-label">Họ tên</label>
          <input id="n" class="form-control">
          <div class="invalid-feedback">Nhập họ tên (ít nhất 2 ký tự).</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input id="t" class="form-control">
          <div class="invalid-feedback">Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Địa chỉ giao hàng</label>
          <input id="d" class="form-control">
          <div class="invalid-feedback">Nhập địa chỉ nhận hàng đầy đủ.</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Ghi chú</label>
          <textarea id="g" class="form-control"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-check"><input type="radio" class="form-check-input" name="pay" value="COD" checked> Thanh toán khi nhận hàng (COD)</label>
          <label class="form-check"><input type="radio" class="form-check-input" name="pay" value="Chuyển khoản"> Chuyển khoản</label>
        </div>
        <button class="btn btn-main btn-lg">Đặt hàng</button>
      </form>

      <aside class="col-md-5">
        <div class="card p-3">
          <h2 class="h5">Đơn hàng của bạn</h2>
          ${L.map(l => `
            <div class="d-flex justify-content-between">
              <span>${esc(l.p.name)} (${l.size}) ×${l.qty}</span>
              <span>${money(l.p.price * l.qty)}</span>
            </div>`).join('')}
          <hr>
          <b class="d-flex justify-content-between">Tổng <span>${money(total())}</span></b>
        </div>
      </aside>
    </div>`);

  // Khi bấm "Đặt hàng"
  $('#of').on('submit', function (e) {
    e.preventDefault();   // chặn form tải lại trang

    // Kiểm tra từng ô: true là hợp lệ
    const v = {
      n: $('#n').val().trim().length >= 2,
      t: /^0\d{9}$/.test($('#t').val().trim()),   // 10 số, bắt đầu bằng 0
      d: $('#d').val().trim().length >= 8
    };

    // Ô nào sai thì tô viền đỏ và hiện dòng báo lỗi (Bootstrap xử lý lớp is-invalid)
    Object.keys(v).forEach(k => $('#' + k).toggleClass('is-invalid', !v[k]));
    if (!(v.n && v.t && v.d)) return;   // còn ô sai thì dừng

    // Tạo đơn hàng
    const order = {
      id: 'DH' + Date.now().toString().slice(-6),
      name: $('#n').val().trim(),
      phone: $('#t').val().trim(),
      address: $('#d').val().trim(),
      note: $('#g').val().trim(),
      pay: $('[name=pay]:checked').val(),
      date: new Date().toLocaleString('vi-VN'),
      total: total(),
      status: 'Chờ xác nhận',
      items: L.map(l => ({ name: l.p.name, size: l.size, qty: l.qty, price: l.p.price }))
    };

    // Lưu đơn vào danh sách đơn hàng (đơn mới nằm đầu), rồi xóa giỏ
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', '[]');
    badge();

    $('#app').html(`
      <div class="text-center py-5">
        <h1>Đặt hàng thành công</h1>
        <p>Mã đơn của bạn: <b>${order.id}</b>. Cửa hàng sẽ gọi số ${esc(order.phone)} để xác nhận.</p>
        <a href="index.html" class="btn btn-main">Tiếp tục mua sắm</a>
      </div>`);
  });
}
// ===== PHẦN 8: Trang quản trị =====
const STATUS = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao'];

function adminPage() {
  const modal = new bootstrap.Modal('#pmod');
  const getOrders = () => JSON.parse(localStorage.getItem('orders')) || [];
  const saveProducts = ps => localStorage.setItem('products', JSON.stringify(ps));
  const saveOrders = os => localStorage.setItem('orders', JSON.stringify(os));

  // Vẽ lại hai bảng: sản phẩm và đơn hàng
  const draw = () => {
    $('#tp').html(products().map(p => `
      <tr>
        <td>${p.icon}</td>
        <td>${esc(p.name)}</td>
        <td>${CAT(p.cat).name}</td>
        <td>${money(p.price)}</td>
        <td class="text-nowrap">
          <button class="btn btn-sm btn-outline-dark ed" data-id="${p.id}">Sửa</button>
          <button class="btn btn-sm btn-outline-danger rm" data-id="${p.id}">Xóa</button>
        </td>
      </tr>`).join(''));

    $('#to').html(getOrders().map((o, i) => `
      <tr>
        <td>${o.id}<br><small>${o.date}</small></td>
        <td>${esc(o.name)}<br><small>${esc(o.phone)}</small></td>
        <td>${o.items.map(x => esc(x.name) + ' (' + x.size + ') ×' + x.qty).join('<br>')}</td>
        <td>${money(o.total)}</td>
        <td>
          <select class="form-select form-select-sm st" data-i="${i}">
            ${STATUS.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      </tr>`).join('') || '<tr><td colspan="5">Chưa có đơn hàng nào.</td></tr>');
  };

  // Đổ danh mục vào ô chọn môn trong form
  $('#pc').html(CATS.map(c => `<option value="${c.id}">${c.name}</option>`).join(''));

  // Nút "Thêm sản phẩm mới": xóa trắng form (pid rỗng nghĩa là đang thêm mới)
  $('#addp').click(() => {
    $('#pf')[0].reset();
    $('#pid').val('');
    modal.show();
  });

  // Nút Sửa: điền thông tin sản phẩm vào form; nút Xóa: hỏi lại rồi xóa
  $('#tp')
    .on('click', '.ed', function () {
      const p = products().find(x => x.id == $(this).data('id'));
      $('#pid').val(p.id);
      $('#pn').val(p.name);
      $('#pc').val(p.cat);
      $('#pp').val(p.price);
      $('#pmat').val(p.material);
      $('#ps').val(p.sizes.join(','));
      $('#pd').val(p.desc);
      modal.show();
    })
    .on('click', '.rm', function () {
      if (!confirm('Xóa sản phẩm này?')) return;
      saveProducts(products().filter(x => x.id != $(this).data('id')));
      draw();
    });

  // Lưu form: có pid là sửa, không có là thêm mới
  $('#pf').on('submit', e => {
    e.preventDefault();
    const ps = products();
    const id = $('#pid').val();
    const cat = $('#pc').val();
    const d = {
      name: $('#pn').val().trim(),
      cat,
      price: +$('#pp').val(),
      material: $('#pmat').val().trim(),
      desc: $('#pd').val().trim(),
      sizes: $('#ps').val().split(',').map(s => s.trim()).filter(Boolean)
    };

    if (!d.name || !(d.price > 0) || !d.sizes.length) {
      toast('Nhập tên, giá lớn hơn 0 và ít nhất một size');
      return;
    }

    if (id) {
      Object.assign(ps.find(x => x.id == id), d, { icon: CAT(cat).icon });   // sửa
    } else {
      ps.push({                                                              // thêm mới
        ...d,
        id: Math.max(0, ...ps.map(x => x.id)) + 1,
        icon: CAT(cat).icon,
        color: '#dfe6f5',
        isNew: true,
        hot: false
      });
    }

    saveProducts(ps);
    modal.hide();
    draw();
    toast('Đã lưu sản phẩm');
  });

  // Đổi trạng thái đơn hàng
  $('#to').on('change', '.st', function () {
    const os = getOrders();
    os[$(this).data('i')].status = $(this).val();
    saveOrders(os);
    toast('Đã cập nhật trạng thái');
  });

  // Khôi phục dữ liệu mẫu
  $('#reset').click(() => {
    if (confirm('Khôi phục dữ liệu sản phẩm mẫu?')) {
      localStorage.removeItem('products');
      draw();
    }
  });

  draw();
}
// ===== Khởi chạy =====
$(function () {
  layout();
  const page = document.body.dataset.page;
  if (page === 'home') home();
  if (page === 'products') productsPage();
  if (page === 'detail') detailPage();
  if (page === 'cart') cartPage();
  if (page === 'checkout') checkoutPage();
  if (page === 'admin') adminPage();
});