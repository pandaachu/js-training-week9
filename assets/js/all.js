function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

var web = "https://hexschoollivejs.herokuapp.com";
var api_path = "pandaa";
var token = "0wqEojiDq0e1LPUqwrhkeg0wcX43";
var productList = [];
var productWrap = document.querySelector('.productWrap');
var cartList = [];
var cartListWrap = document.querySelector('.js-cartList');
var totalPrice = document.querySelector('.js-totalPrice');
var productId = '';
var cartId = '';

function getProductId() {
  var addCardBtns = document.querySelectorAll('#addCardBtn');
  addCardBtns.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      productId = (_readOnlyError("productId"), e.target.getAttribute("data-id"));
      addToCart();
    });
  });
} // 取得產品清單


function getProductList() {
  axios.get("".concat(web, "/api/livejs/v1/customer/").concat(api_path, "/products")).then(function (res) {
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
} // 購物車清單


function getCartList() {
  axios.get("".concat(web, "/api/livejs/v1/customer/").concat(api_path, "/carts")).then(function (res) {
    cartList = res.data.carts;
    console.log('購物車清單', cartList);
    cartListRender();
    totalPrice.textContent = dollarSign(res.data.finalTotal);
    delCartListData();
  })["catch"](function () {
    console.log('讀取失敗，請稍後再試');
  });
} // 購物車清單 render


function cartListRender() {
  var str = '';
  cartList.forEach(function (item) {
    str += "\n    <tr class=\"js-cartListWrap\">\n      <td>\n        <div class=\"cardItem-title\">\n          <img src=\"".concat(item.product.images, "\" alt=\"\" />\n          <p>").concat(item.product.title, "</p>\n        </div>\n      </td>\n      <td>").concat(dollarSign(item.product.price), "</td>\n      <td>").concat(item.quantity, "</td>\n      <td>").concat(dollarSign(item.product.price * item.quantity), "</td>\n      <td class=\"discardBtn\">\n        <a href=\"#\" class=\"material-icons js-btnDelete\" data-id=\"").concat(item.id, "\"> clear </a>\n      </td>\n    </tr>");
  });

  var insertAfter = function insertAfter(el, htmlString) {
    return el.insertAdjacentHTML('afterend', htmlString);
  };

  insertAfter(cartListWrap, str);
} // 加入購物車


function addToCart() {
  var cartData = {
    "data": {
      "productId": productId,
      "quantity": 1
    }
  };
  axios.post("".concat(web, "/api/livejs/v1/customer/").concat(api_path, "/carts"), cartData).then(function (res) {
    console.log(res, '加入購物車');
    getCartList();
  });
} // 刪除單筆購物車訂單


function delCartListData() {
  var btnDelete = document.querySelectorAll('.js-btnDelete');
  btnDelete.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      cartId = e.target.getAttribute("data-id");
      console.log(cartId);
      axios["delete"]("".concat(web, "/api/livejs/v1/customer/{api_path}/carts/").concat(cartId)).then(function (res) {
        console.log(res);
      });
    });
  });
} // add dollar sign


function dollarSign(money) {
  return "NT$".concat(money);
}

getProductList();
getCartList();
//# sourceMappingURL=all.js.map
