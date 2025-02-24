const ItemCtrl = (function() {

    const Item = function(id, name) {
        this.id = id,
        this.name = name
    }
    
    const data = {
        items: [],
        currentItem: null,
        totalTask: function() {
            return this.items.length;
        }
    };

    return {
        addItem: function(task) {
            let ID = 0;
            if (data.items.length > 0) {
                ID = data.items[data.items.length -1].id +1;
            } else {
                ID = 0;
            }
            const newItem = new Item(ID, task);
            data.items.push(newItem);
        },
        findItemById: function(id) {
            let itemFound = "";
            for (const item of data.items) {
                if (id == item.id) {
                    itemFound = item;
                    break;
                }
            }
            return itemFound;
        },
        getItems: function() {
            return data.items;
        },
        getTotalTask: function() {
            return data.totalTask();
        },
        logData: function() {
            return data;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        updateItem: function(newItem){
            for (const item of data.items) {
                if (data.currentItem.id == item.id) {
                    item.name = newItem;
                    break;
                }
            }
        }
    }
})();

const UICtrl = (function() {
    const UISelector = {
        addBtn: "#add-btn",
        editBtn: '#edit-btn',
        editConteneur: '#edit-none',
        input: "#input-todo",
        nombreTache: "#tasks-nombre",
        ul: "#items-collection"
    };

    return {
        editInput: function(item) {
            document.querySelector(UISelector.input).value = item.name;
        },
        editStatement: function() {
            if (document.querySelector(UISelector.editBtn).classList.contains('hidden')) {
                document.querySelector(UISelector.addBtn).classList.add('hidden');
                document.querySelector(UISelector.editConteneur).classList.add('hidden');
                document.querySelector(UISelector.editBtn).classList.remove('hidden');
            } else {
                document.querySelector(UISelector.addBtn).classList.remove('hidden');
                document.querySelector(UISelector.editConteneur).classList.remove('hidden');
                document.querySelector(UISelector.editBtn).classList.add('hidden');
            }
        },
        clearInput: function() {
            document.querySelector(UISelector.input).value = "";
        },
        getInputValue: function() {
            return {
                task: document.querySelector(UISelector.input).value
            }
        },
        getSelectors: function() {
            return UISelector;
        },
        populateItems: function(items, nombreTask) {
            let html = "";
            items.forEach(item => {
                html += `
                    <li id="item-${item.id}" class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" id="task-${item.id}" class="peer">
                            <label for="task-${item.id}" class="text-lg text-gray-800 cursor-pointer peer-checked:line-through peer-checked:text-gray-500 transition-all">
                                ${item.name}
                            </label>
                        </div>                     
                        <div class="flex items-center gap-3">
                            <button class="text-blue-500 hover:text-blue-700 text-xl transition-transform transform hover:scale-110">
                                <i class="edit-action fa fa-pencil"></i>
                            </button>
                            <button class="text-red-500 hover:text-red-700 text-xl transition-transform transform hover:scale-110">
                                <i class="delete-action fa fa-trash"></i>
                            </button>
                        </div>
                    </li>
                `;
            });
            document.querySelector(UISelector.nombreTache).innerHTML = nombreTask;
            document.querySelector(UISelector.ul).innerHTML = html;
        }
    }
})();

const App = (function(ItemCtrl, UICtrl) {
    const loadEvent = function() {
        const UISelector = UICtrl.getSelectors();
        //Create
        document.querySelector(UISelector.addBtn).addEventListener('click', addItemSubmited);
        //Read
        document.addEventListener('DOMContentLoaded', readAllItems);
        //Update
        document.querySelector(UISelector.ul).addEventListener('click', addItemToForm);
        document.querySelector(UISelector.editBtn).addEventListener('click', updateItem);
    }

    const addItemSubmited = function(e) {
        const inputValue = UICtrl.getInputValue().task;
        if (inputValue !== "") {
            ItemCtrl.addItem(inputValue);
            UICtrl.clearInput();
            readAllItems();
        }
        e.preventDefault();
    };

    const readAllItems = function() {
        
        const items = ItemCtrl.getItems();
        const nombreTache = ItemCtrl.getTotalTask();
        UICtrl.populateItems(items, nombreTache);

    };

    const addItemToForm = function(e) {
        if (e.target.classList.contains('edit-action')) {
            const listId = e.target.parentNode.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const editItem = ItemCtrl.findItemById(id);
            ItemCtrl.setCurrentItem(editItem);
            UICtrl.editInput(editItem);         
            UICtrl.editStatement();
        }
        e.preventDefault();
    };

    const updateItem = function(e) {
        const inputValue = UICtrl.getInputValue().task;
        if (inputValue !== "") {
            ItemCtrl.updateItem(inputValue);
            UICtrl.clearInput();
            UICtrl.editStatement();
            readAllItems();
        }
        e.preventDefault();
    };


    return {
        init: function() {
            console.log('Initializing App...');
            loadEvent();
        }
    }
})(ItemCtrl, UICtrl);

App.init();