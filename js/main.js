// Định dạng số thành tiền Việt: 450000 -> 450.000₫
const money = n => Number(n).toLocaleString('vi-VN') + '₫';

$(function () {
  console.log("jQuery đã chạy");
  console.log("Số sản phẩm:", PRODUCTS.length);
  console.log("Giá sản phẩm đầu tiên:", money(PRODUCTS[0].price));
});