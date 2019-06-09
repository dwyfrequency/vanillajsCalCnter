const log = console.log;

// : Storage Controller
const StorageCtrl = (function() {
  // private methods and properties - none

  // public methods
  return {

    getItems () {
      const lsItems = localStorage.getItem("items"); 
      // if it is not null, parse the array else empty array returned
      return lsItems ? JSON.parse(lsItems) : [];
    },
    storeItem (item) {
      const items = this.getItems();
      // add new item to array
      items.push(item);
      // add the updated array to local storage
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage (item) {
      // filter out old item, add new item at the end
      const items = this
                      .getItems()
                      .filter(obj => obj.id != item.id);
      // update local storage
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage () {
      localStorage.removeItem("items");
    },
    updateItemStorage (item) {
      // filter out old item, add new item at the end
      const items = this
                      .getItems()
                      .filter(obj => obj.id != item.id)
                      .concat(item);
      // update local storage
      localStorage.setItem("items", JSON.stringify(items));
    }
  };
})();

// : Item Controller
const ItemCtrl = (function () {

  // : Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // : Data Structure / State
  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0
  }

  // : Public methods
  return {

    // destructure item into two vars
    addItem ({name, calories}) {
      let ID;
      // create id
      if (data.items.length) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 1;
      }
      // create new item - must convert calories to int val
      const newItem = new Item(ID, name, parseInt(calories));
      // add to items array
      data.items.push(newItem);

      return newItem;
    }, 
    clearAllItems () {
      data.items = [];
    },
    deleteItem (id) {
      data.items = data.items.filter(obj => obj.id !== id);
    },
    getCurrentItem () {
      return data.currentItem;
    },
    getItems () {
      return data.items;
    },
    getTotalCalories () {
      data.totalCalories = data.items.reduce((accum, obj) => accum + obj.calories, 0);
      return data.totalCalories;
    },
    getItemById (id) {
      // filter through items array for object, take the returned array and unpack the object
      return data.items.filter(obj => obj.id === id)[0];
    },
    logData () {
      return data;
    },
    setCurrentItem (item) {
      data.currentItem = item;
    },
    updateItem (name, calories) {
      // retrieve item by taking current item's id and update the value
      const item = this.getItemById(this.getCurrentItem().id);
      item.name = name;
      item.calories = parseInt(calories);

      return item;
    }

  };

}());

// : UI Controller
const UICtrl = (function () {

  const UISelectors = {
    itemList: "#item-list",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    clearBtn: ".clear-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    totalCalories: ".total-calories"
  }; // closure stores querySelector values

  // : Public methods
  return {
    addListItem (item) {
      // show list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // create li element
      const li = document.createElement("li");
      
      // add attributes
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      
      // add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;

      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    addItemToForm () {
      const { name, calories } = ItemCtrl.getCurrentItem();
      document.querySelector(UISelectors.itemNameInput).value = name;
      document.querySelector(UISelectors.itemCaloriesInput).value = calories;

      this.showEditState();
    },
    clearEditState () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState () {
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    clearInput () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      calories: document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    removeAllListItems () {
      Array.from(document
                  .querySelectorAll(UISelectors.listItems))
                  .forEach(li => li.remove());
    },
    getItemInput () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    getSelectors () {
      return UISelectors;
    },
    hideList () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    populateItemList (items) {
      // create html from list of items
      const html = items.reduce((accum, item) => {

        return `${accum}
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`;

      }, "");

      document
        .querySelector(UISelectors.itemList) // grab from closure
        .innerHTML = html;
    },
    showTotalCalories (totalCals) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCals;
    },
    updateListItem (item) {
      // get all list items - returned turn node - turn node list into array
      const listItems = Array.from(document.querySelectorAll(UISelectors.listItems));
      // listItems
      listItems.forEach(li => {
        const itemId = li.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem (itemId) {
      document.querySelector(`#item-${itemId}`).remove();
    }
  };

}());

// : APP Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {

  // load event listeners - all initial events will go in here
  const loadEventListeners = () => {
    // get ui selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable submit on enter - this works when you are not in the form like if you just click out of focus and hit enter, it'll be prevented
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("keypress", e => {
        log(e);
        if (e.keyCode === 13) {
          e.preventDefault();
          return false;
        }
      });
    
    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    
    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    
    // delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    
    // delete button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // add item Submit
  const itemAddSubmit = e => {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    /* check for name and calories input - if either are blank it will be falsy 
    - note calories is expecting number input will be blank with string 
    - note this number check is only enforced by the html, our js still gets string val for calories*/
    if (input.name && input.calories) {
      // add item to the array of items
      const newItem = ItemCtrl.addItem(input);
      // add new list item to the UI
      UICtrl.addListItem(newItem);

      // count calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // store data in Local Storage
      StorageCtrl.storeItem(newItem);

      // clear form input
      UICtrl.clearInput();
    }

      e.preventDefault();
    };

  // b/c we added the items in the list after the dom loaded, we need to use event delegation
  const itemEditClick = function (e) {
    // for an array you can use includes, but the classlist returns a dom token list which needs contains
    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentElement.parentElement.id;
      
      // break into an array
      const listIdArr = listId.split('-');

      // get the actual id
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add current item to form
      UICtrl.addItemToForm();
    }
  };

  // update item submit 
  const itemUpdateSubmit = e => {
    // get item input
    const { name, calories } = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(name, parseInt(calories));

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    // clear input form
    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = e => {
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // count calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete item from ls 
    StorageCtrl.deleteItemFromStorage(currentItem);

    log("del func")
    UICtrl.clearEditState();
    e.preventDefault();
  };

  const clearAllItemsClick = e => {
    // clear all items from data structure
    ItemCtrl.clearAllItems();

    // count calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // clear all list items from ui 
    UICtrl.removeAllListItems();

    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // clear all items from local storage
    StorageCtrl.clearItemsFromStorage();

    // hide ul line
    UICtrl.hideList();

    // clear form input - just in case
    UICtrl.clearInput();

  };

  // : Public Methods
  return {

    init () {
      log('Initializing App...');
      // set initial state - hides all buttons except the add meal one
      UICtrl.clearEditState();

      // get Items from data structure 
      const items = ItemCtrl.getItems();

      // Check if any items are in the list (length of 0 will be falsy, all else will be true) ? Populate list with items else hide it 
      items.length ? UICtrl.populateItemList(items) : UICtrl.hideList();

      // count calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // : Load event listeners 
      loadEventListeners();
    }

  };

})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();

// when using iife with es6 place the paranths() outside of the wrapping parens like above
