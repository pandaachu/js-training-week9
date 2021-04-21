const web = "https://hexschoollivejs.herokuapp.com";
const api_path = "pandaa";
const token = "0wqEojiDq0e1LPUqwrhkeg0wcX43";
let productList = [];
const productWrap = document.querySelector('.productWrap');
let cartList = [];
const cartListWrap = document.querySelector('.js-cartList');
const totalPrice = document.querySelector('.js-totalPrice');
const productId = '';
let cartId = '';

function getProductId() {
  const addCardBtns = document.querySelectorAll('#addCardBtn');
  addCardBtns.forEach(function(item) {
    item.addEventListener('click', function(e){
      e.preventDefault();
      productId = e.target.getAttribute("data-id");
      addToCart();
    })
  })
}

// 取得產品清單
function getProductList() {
  axios.get(`${web}/api/livejs/v1/customer/${api_path}/products`)
    .then(function(res) {
      productList = res.data.products;
      console.log('產品清單',productList);
      productListRender();
      getProductId();
    })
}

// 產品清單 render
function productListRender() {
  let str = '';
  productList.forEach(function(item) {
    str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${ item.images }"
      alt=""
    />
    <a href="#" id="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${ item.title }</h3>
    <del class="originPrice">${ dollarSign(item.origin_price) }</del>
    <p class="nowPrice">${ dollarSign(item.price) }</p>
  </li>`
  })
  productWrap.innerHTML = str;
}

// 購物車清單
function getCartList() {
  axios.get(`${web}/api/livejs/v1/customer/${api_path}/carts`)
  .then(function(res) {
    cartList = res.data.carts;
    console.log('購物車清單',cartList);
    cartListRender();
    totalPrice.textContent = dollarSign(res.data.finalTotal);
    delCartListData();
  })
  .catch(function() {
    console.log('讀取失敗，請稍後再試');
  })
}

// 購物車清單 render
function cartListRender() {
  let str = '';
  cartList.forEach(function(item) {
    str += `
    <tr class="js-cartListWrap">
      <td>
        <div class="cardItem-title">
          <img src="${ item.product.images }" alt="" />
          <p>${ item.product.title }</p>
        </div>
      </td>
      <td>${ dollarSign(item.product.price) }</td>
      <td>${ item.quantity }</td>
      <td>${ dollarSign(item.product.price * item.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons js-btnDelete" data-id="${item.id}"> clear </a>
      </td>
    </tr>`
  })
  const insertAfter = (el, htmlString) => el.insertAdjacentHTML('afterend', htmlString);
  insertAfter(cartListWrap, str); 
}

// 加入購物車
function addToCart() {
  let cartData = {
    "data": {
      "productId": productId,
      "quantity": 1
    }
  };
  axios.post(`${web}/api/livejs/v1/customer/${api_path}/carts`, cartData)
    .then(function(res) {
      console.log(res,'加入購物車');
      getCartList();
    })
}

// 刪除單筆購物車訂單
function delCartListData() {
  const btnDelete = document.querySelectorAll('.js-btnDelete');
  btnDelete.forEach(function(item) {
    item.addEventListener('click', function(e){
      e.preventDefault();
      cartId = e.target.getAttribute("data-id");
      console.log(cartId);
      axios.delete( `${web}/api/livejs/v1/customer/{api_path}/carts/${cartId}`)
      .then(function(res) {
        console.log(res);
      })
    })
  })
}

// add dollar sign
function dollarSign(money) {
  return `NT$${ money }`
}

getProductList();
getCartList();