//Get main variables
let titleInput = document.querySelector("#title");
let priceInput = document.querySelector("#price");
let taxesInput = document.querySelector("#taxes");
let adsInput = document.querySelector("#ads");
let discountInput = document.querySelector("#discount");
let categoryInput = document.querySelector("#category");
let countInput = document.querySelector("#count");
let total = document.querySelector("#total");
let inputsArray = [
  titleInput,
  priceInput,
  taxesInput,
  adsInput,
  discountInput,
  countInput,
  categoryInput,
];
let clearAllBtn = document.querySelector(".clear");
//Check for valid inputs
function check() {
  for (let i = 0; i < inputsArray.length; i++) {
    if (inputsArray[i].value == "" || inputsArray[i].value < 0) {
      return false;
    } else if (
      (inputsArray[i].id == "title" && !isNaN(+inputsArray[i].value[0])) ||
      (inputsArray[i].id == "category" && !isNaN(+inputsArray[i].value[0]))
    ) {
      return false;
    }
  }
  return true;
}
//Calculate total

//Dealing with local Storage
let productsArray = [];
let id = 1;
if (localStorage.getItem("products")) {
  productsArray = JSON.parse(localStorage.products);
}
if (localStorage.getItem("lastIndex")) {
  id = localStorage.lastIndex;
}

//Create data
let createButton = document.querySelector("button.create");
let updateButton = document.querySelector('button.update');
function createData() {
  let product = {
    id: id,
    title: titleInput.value,
    price: priceInput.value,
    taxes: taxesInput.value,
    ads: adsInput.value,
    discount: discountInput.value,
    total: calculateTotal(),
    count: countInput.value,
    category: categoryInput.value,
  };
  add(product);
}
//clear data
function clearInputs() {
  inputsArray.forEach((ele) => {
    ele.value = "";
  });
  total.innerHTML = "Total:";
}
//Add event listener to create button
createButton.addEventListener("click", function () {
  if (check()) {
    createData();
    showData(productsArray);
    clearInputs();
    clearAll();
  }
});
function calculateTotal() {
  total.innerHTML = "Total:";
  let span = document.createElement("span");
  span.innerHTML =
    +priceInput.value +
    +taxesInput.value +
    +adsInput.value -
    +discountInput.value;
  total.append(span);
  return +span.textContent;
}
priceInput.oninput = calculateTotal;
taxesInput.oninput = calculateTotal;
discountInput.oninput = calculateTotal;
adsInput.oninput = calculateTotal;
//Show data
let tbody = document.querySelector("tbody");
function showData(productsArray) {
  console.log(productsArray);
  tbody.innerHTML = "";
  for (let i = 0; i < productsArray.length; i++) {
    let tr = document.createElement("tr");
    tbody.append(tr);
    for (let prop in productsArray[i]) {
      let td = document.createElement("td");
      td.textContent = productsArray[i][prop];
      tr.append(td);
    }
    let updateBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    updateBtn.classList.add("upd");
    deleteBtn.classList.add("del");
    updateBtn.textContent = "Update";
    deleteBtn.textContent = "Delete";
    let btnArr = [updateBtn, deleteBtn];
    for (let j = 0; j < 2; j++) {
      let td = document.createElement("td");
      td.append(btnArr[j]);
      tr.append(td);
    }
  }
  clearAll();
  decreaseAndDel();
  update();
}
showData(productsArray);
//check for same products + update if needed
function add(newProduct) {
  let index;
  if (productsArray.length > 0) {
    let boolean = false;
    for (let i = 0; i < productsArray.length; i++) {
      if (
        productsArray[i].title == newProduct.title &&
        productsArray[i].category == newProduct.category
      ) {
        boolean = true;
        index = i;
        break;
      }
    }
    if (boolean) {
      if (newProduct.count > productsArray[index].count) {
        productsArray[index] = newProduct;
        newProduct.id = index + 1;
      }
    } else {
      productsArray.push(newProduct);
    }
  } else productsArray.push(newProduct);
  localStorage.setItem("lastIndex", productsArray.length + 1);
  id = localStorage.lastIndex;
  clearAllBtn.textContent = `Clear All (${productsArray.length + 1})`;
  localStorage.setItem("products", JSON.stringify(productsArray));
}
// localStorage.clear();
//Clear all button

function clearAll() {
  if (productsArray.length > 0) {
    clearAllBtn.classList.remove("hidden");
    clearAllBtn.textContent = `Clear All (${productsArray.length})`;
  } else clearAllBtn.classList.add("hidden");
  clearAllBtn.addEventListener("click", function () {
    localStorage.clear();
    productsArray = [];
    tbody.innerHTML = "";
    clearAllBtn.classList.add("hidden");
    clearAllBtn.textContent = "Clear All";
    id = 1;
  });
  clearInputs();
}
//decrease and delete when count is 0
function decreaseAndDel() {
  let deleteBtns = document.querySelectorAll("button.del");
  deleteBtns.forEach((btn, index) => {
    btn.addEventListener("click", function (e) {
      if (productsArray[index].count > 0) {
        productsArray[index].count--;
        if (productsArray[index].count == 0) {
          console.log(this.parentElement.parentElement.remove());
          productsArray.splice(index, 1);
        }
        localStorage.setItem("products", JSON.stringify(productsArray));
        showData(productsArray);
      }
    });
  });
}
//update button
let ind;
function update() {
  let updateBtns = document.querySelectorAll('button.upd');
  updateBtns.forEach((btn,index) => {
    btn.addEventListener('click', function () {
      createButton.classList.add('hidden');
      updateButton.classList.remove('hidden');
      addDataToInputs(productsArray[index]);
      ind = index;
    })
  })
}
updateButton.addEventListener('click', function () {
  updateRow(ind);
  updateButton.classList.add('hidden');
  createButton.classList.remove('hidden');
})
function updateRow(index) {
  let i = 0;
  for (let prop in productsArray[index]) {
    if (prop != 'id' && prop != 'total') {
      productsArray[index][prop] = inputsArray[i++].value;
    }
  }
  localStorage.setItem('products', JSON.stringify(productsArray));

    if (check()) {
      showData(productsArray);
      clearInputs();
      clearAll();
    }
}
//add the data to inputs when updateButton clicked
function addDataToInputs(product) {
  titleInput.value = product.title;
  priceInput.value = product.price;
  taxesInput.value = product.taxes;
  adsInput.value = product.ads;
  discount.value = product.discount;
  countInput.value = product.count;
  categoryInput.value = product.category;
}
//Search function
let searchBtns = document.querySelectorAll('button#search-title,button#search-category');
let mode;
searchBtns.forEach((ele) => {
  ele.addEventListener('click', function () {
    mode = this.id.split('-')[1];
    console.log(mode)
  })
})
document.querySelector('input#search').oninput = function () {
  let array = [];
    for (let i = 0; i < productsArray.length; i++)
      if (productsArray[i][mode].includes(this.value))
        array.push(productsArray[i]);
    showData(array);
}
