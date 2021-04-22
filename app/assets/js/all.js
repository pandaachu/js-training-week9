const baseUrl = "https://hexschoollivejs.herokuapp.com";
const api_path = "pandaa";
// const token = "0wqEojiDq0e1LPUqwrhkeg0wcX43";
let productList = [];
let cartList = [];
const productWrap = document.querySelector('.productWrap');
const cartListWrap = document.querySelector('.js-cartList');
const totalPrice = document.querySelector('.js-totalPrice');
const productCategory = document.querySelector('.topBar-menu');
const deleteAllCartItemBtn = document.querySelector('.discardAllBtn');
const submitOrderBtn = document.querySelector('.orderInfo-btn');
let productId = '';

function init() {
  getProductList();
  getCartList();
}

init();

productCategory.addEventListener('change', function(e) {
  e.preventDefault();
  console.log('test');
  let category = e.target.value;
  console.log(category);
})

// 取得產品清單
function getProductList() {
  axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/products`)
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

// 取得購物車清單
function getCartList() {
  axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
  .then(function(res) {
    cartList = res.data.carts;
    console.log('購物車清單',cartList);
    totalPrice.textContent = dollarSign(res.data.finalTotal);
    cartListRender();
    deleteCartItem();
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
    <tr>
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
  cartListWrap.innerHTML = str;

}

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

// 加入購物車
function addToCart() {
  let cartData = {
    "data": {
      "productId": productId,
      "quantity": 1
    }
  };
  axios.post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`, cartData)
    .then(function(res) {
      console.log(res,'加入購物車');
      getCartList();
    })
}

// 刪除單筆購物車訂單
function deleteCartItem() {
  const btnDelete = document.querySelectorAll('.js-btnDelete');
  let cartId = '';
  btnDelete.forEach(function(item) {
    item.addEventListener('click', function(e){
      e.preventDefault();
      cartId = e.target.getAttribute("data-id");
      axios.delete( `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
        .then(function(res) {
          console.log(res.data);
          alert('刪除成功。');
          getCartList();
        })
    })
  })
}

// 刪除全部
deleteAllCartItemBtn.addEventListener('click',function(e){
  e.preventDefault();
  axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response) {
    alert('刪除全部購物車成功。');
    cartList = response.data.carts;
    getCartList();
  }).catch(function(error){
    alert(error);
  });
})

submitOrderBtn.addEventListener('click', function(e){
  e.preventDefault();
  const name = document.querySelector('#customerName');
  const tel = document.querySelector('#customerPhone');
  const email = document.querySelector('#customerEmail');
  const address = document.querySelector('#customerAddress');
  const payment = document.querySelector('#tradeWay');

  if(cartList.length == 0)
  {
    alert('請選擇商品');
    return;    
  }
  

  axios.post(`${baseUrl}/api/livejs/v1/customer/${api_path}/orders`, 
  {
    "data": {
      "user": {
        "name": name.value,
        "tel": tel.value,
        "email": email.value,
        "address": address.value,
        "payment": payment.value
      }
    }
  })
  
  .then(function (response) {
    alert(`訂單送出成功。`);
    getCartList();
    clearFormData();
  }).catch(function(error){
    alert(error);
  });
})

function clearFormData(){
  name.value = '';
  tel.value = '';
  email.value = '';
  address.value = '';
  payment.value = "ATM";
}

// add dollar sign
function dollarSign(money) {
  return `NT$${ money }`
}
