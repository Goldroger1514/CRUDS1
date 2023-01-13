//Get total function
//Create products
// save products to local Storage
// delete previous data entered by user
// read
// count
// delete
// update
// search
// check inputs => clean data

/**
 * Select main variables
 */
let tbody = document.querySelector("table tbody");
let titleInp = document.querySelector("#title");
let priceInp = document.querySelector("#price");
let taxesInp = document.querySelector("#taxes");
let adsInp = document.querySelector("#ads");
let discountInp = document.querySelector("#discount");
let total = document.querySelector(".total span");
let categoryInp = document.querySelector("#category");
let createBtn = document.querySelector(".create");
let countInp = document.querySelector("#count");
//Get total price function
function getTotalPrice() {
  if (priceInp.value > 0 && taxesInp.value > 0) {
    let result =
      +priceInp.value + +taxesInp.value + +adsInp.value - +discountInp.value;
    total.textContent = `${result}`;
  }
}
//Dealing with localStorage
let productsArr = [];
if (localStorage.getItem("productsArray")) {
  productsArr = JSON.parse(localStorage.getItem("productsArray"));
  addData();
  readData();
  remove();
}
//Create Elements
function addData() {
  let inputs = document.querySelectorAll("input:not(input#search)");
  let boolean = true;
  inputs.forEach((ele) => {
    if (ele.value == "" || ele.value<0) {
      boolean = false;
      clearData();
      return;
    }
  });
  if (boolean) {
    for (let i = 0; i < countInp.value; i++) {
      let product = {
        title: titleInp.value,
        price: priceInp.value,
        taxes: taxesInp.value,
        ads: adsInp.value,
        discount: discountInp.value,
        total: total.textContent,
        category: categoryInp.value,
        count: countInp.value,
        id: i + 1,
      };
      productsArr.push(product);
    }
    localStorage.setItem("productsArray", JSON.stringify(productsArr));
    clearData();
  }
}
//clear Inputs
function clearData() {
  let inputs = document.querySelectorAll("input:not(input#search)");
  inputs.forEach((ele) => {
    ele.value = "";
  });
  total.innerHTML = "";
}
//Read and display data
function readData() {
  tbody.innerHTML = "";
  for (let i = 0; i < productsArr.length; i++) {
    tbody.innerHTML += `
    <td>${i + 1}</td>
    <td>${productsArr[i].title}</td>
    <td>${productsArr[i].price}</td>
    <td>${productsArr[i].taxes}</td>
    <td>${productsArr[i].ads}</td>
    <td>${productsArr[i].discount}</td>
    <td>${productsArr[i].total}</td>
    <td>${productsArr[i].category}</td>
    <td><button id="update">update</button></td>
    <td><button onclick='remove(${i})' id="delete">delete</button></td>
    `;
  }
}
//Delete product
function remove(i) {
  productsArr.splice(i, 1);
  localStorage.productsArray = JSON.stringify(productsArr);
  readData();
}
//remove all
function removeAll() {
  let clearBtn = document.querySelector(".clear");
  console.log(clearBtn);
  if (JSON.parse(localStorage.productsArray).length > 1) {
    clearBtn.classList.remove("hidden");
    clearBtn.onclick = function () {
      localStorage.clear();
      productsArr = [];
      tbody.innerHTML = '';
      this.classList.add('hidden');
    };
  } else {
    clearBtn.classList.add("hidden");
  }
}
//Main button
createBtn.addEventListener("click", function () {
  addData();
  readData();
  removeAll();
});
