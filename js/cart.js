const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = c => localStorage.setItem("cart", JSON.stringify(c));

function addToCart(product, size, qty = 1) {
  if (!size) { alert("Vui lòng chọn kích cỡ trước khi mua!"); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === product.id && i.size === size);
  item ? item.qty += qty
       : cart.push({ id: product.id, name: product.name, price: product.price, size, qty });
  saveCart(cart);
}
const cartTotal = () => getCart().reduce((s, i) => s + i.price * i.qty, 0);

// Validate số điện thoại ở checkout: đủ 10 số, bắt đầu bằng 0
const isValidPhone = p => /^0\d{9}$/.test(p);