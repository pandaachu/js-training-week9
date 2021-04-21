var baseUrl = "https://hexschoollivejs.herokuapp.com";
var api_path = "pandaa";
var token = "0wqEojiDq0e1LPUqwrhkeg0wcX43";
var productList = [];
var productWrap = document.querySelector('.productWrap');
var cartList = [];
var cartListWrap = document.querySelector('.js-cartList');
var totalPrice = document.querySelector('.js-totalPrice');
var productId = '';

function init() {
  getProductList();
  getCartList();
}

init(); // 取得產品清單

function getProductList() {
  axios.get("".concat(baseUrl, "/api/livejs/v1/customer/").concat(api_path, "/products")).then(function (res) {
    productList = res.data.products;
    console.log('產品清單', productList);
    productListRender();
    getProductId();
  });
} // 產品清單 render


function productListRender() {
  var str = '';
  productList.forEach(function (item) {
    str += "<li class=\"productCard\">\n    <h4 class=\"productType\">\u65B0\u54C1</h4>\n    <img\n      src=\"".concat(item.images, "\"\n      alt=\"\"\n    />\n    <a href=\"#\" id=\"addCardBtn\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n    <h3>").concat(item.title, "</h3>\n    <del class=\"originPrice\">").concat(dollarSign(item.origin_price), "</del>\n    <p class=\"nowPrice\">").concat(dollarSign(item.price), "</p>\n  </li>");
  });
  productWrap.innerHTML = str;
} // 取得購物車清單


function getCartList() {
  axios.get("".concat(baseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts")).then(function (res) {
    cartList = res.data.carts;
    console.log('購物車清單', cartList);
    totalPrice.textContent = dollarSign(res.data.finalTotal);
    cartListRender();
    deleteCartItem();
  })["catch"](function () {
    console.log('讀取失敗，請稍後再試');
  });
} // 購物車清單 render


function cartListRender() {
  var str = '';
  cartList.forEach(function (item) {
    str += "\n    <tr>\n      <td>\n        <div class=\"cardItem-title\">\n          <img src=\"".concat(item.product.images, "\" alt=\"\" />\n          <p>").concat(item.product.title, "</p>\n        </div>\n      </td>\n      <td>").concat(dollarSign(item.product.price), "</td>\n      <td>").concat(item.quantity, "</td>\n      <td>").concat(dollarSign(item.product.price * item.quantity), "</td>\n      <td class=\"discardBtn\">\n        <a href=\"#\" class=\"material-icons js-btnDelete\" data-id=\"").concat(item.id, "\"> clear </a>\n      </td>\n    </tr>");
  });
  cartListWrap.innerHTML = str;
}

function getProductId() {
  var addCardBtns = document.querySelectorAll('#addCardBtn');
  addCardBtns.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      productId = e.target.getAttribute("data-id");
      addToCart();
    });
  });
} // 加入購物車


function addToCart() {
  var cartData = {
    "data": {
      "productId": productId,
      "quantity": 1
    }
  };
  axios.post("".concat(baseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts"), cartData).then(function (res) {
    console.log(res, '加入購物車');
    getCartList();
  });
} // 刪除單筆購物車訂單


function deleteCartItem() {
  var btnDelete = document.querySelectorAll('.js-btnDelete');
  var cartId = '';
  btnDelete.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      cartId = e.target.getAttribute("data-id");
      axios["delete"]("".concat(baseUrl, "/api/livejs/v1/customer/").concat(api_path, "/carts/").concat(cartId)).then(function (res) {
        console.log(res.data);
        getCartList();
      });
    });
  });
} // add dollar sign


function dollarSign(money) {
  return "NT$".concat(money);
}
//# sourceMappingURL=all.js.map
