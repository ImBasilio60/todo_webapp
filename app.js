const ItemCtrl = (function() {

    const Item = function(id, name, Booleen) {
        this.id = id,
        this.name = name,
        this.completed = Booleen
    }
    
    const data = {
        items: [],
        currentItem: null,
        totalTask: function() {
            let resultat = 0;
            this.items.forEach(item => {
                (item.completed) ? resultat : resultat++;
            });
            return resultat;
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
            const newItem = new Item(ID, task, false);
            data.items.push(newItem);
        },
        deleteItem: function() {
            let ids = data.items.map(item => {
                return item.id;
            });
            const indexOfId = ids.indexOf(data.currentItem.id);
            data.items.splice(indexOfId, 1);
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
        getItemsInformations: function() {
            return {
                length: data.items.length,
                completedTask: function() {
                    let resultat = 0;
                    data.items.forEach(item => {
                        (item.completed) ? resultat++ : resultat;
                    });
                    return resultat;
                }
            }
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
        setItem: function(items) {
            data.items = items;
        },
        updateCompletedTask: function(completedTask) {
            for (const item of data.items) {
                if (data.currentItem.id == item.id) {
                    item = completedTask;
                    break;
                }
            }
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

const StoreItems = (function() {
    return {
        get: function() {
            let items = [];
            if (localStorage.getItem('todo-app') != null) {
                items = JSON.parse(localStorage.getItem('todo-app'));
            } 
            return items;
        },
        store: function(items) {
            localStorage.setItem('todo-app', JSON.stringify(items));
        }
    }
})();

const UICtrl = (function() {
    const UISelector = {
        addBtn: "#add-btn",
        annulerBtn: '#cancelDelete',
        editBtn: '#edit-btn',
        editConteneur: '#edit-none',
        input: "#input-todo",
        nombreTache: "#tasks-nombre",
        popUp: '#confirmModal',
        progressBar: '.progress-bar',
        supprimerBtn: "#confirmDelete",
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
                let comportement = "";
                if (item.completed == true) {
                    comportement = 'checked';
                }
                html += `
                <li id="item-${item.id}" class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="task-${item.id}" class="peer" ${item.completed ? 'checked' : ''}>
                        <label for="task-${item.id}" class="text-lg text-gray-800 cursor-pointer peer-checked:line-through peer-checked:text-gray-500 transition-all">
                            ${item.name}
                        </label>
                    </div>                     
                    <div class="flex items-center gap-3">
                        <button class="text-blue-500 text-xl transition-transform transform" ${item.completed ? 'disabled' : 'hover:text-blue-700 hover:scale-110'}>
                            <i class="edit-action fa fa-pencil ${item.completed ? 'text-gray-500' : ''}"></i>
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
        }, 
        showPopUp: function() {
            document.querySelector(UISelector.popUp).classList.toggle('hidden');
        },
        updateProgressBar: function(data) {
            let width = data.length > 0 ? (data.completedTask() / data.length) * 100 : 0;
            document.querySelector(UISelector.progressBar).style.width = `${width}%`;
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
        //Delete
        document.querySelector(UISelector.ul).addEventListener('click', showPopUp);
        document.querySelector(UISelector.supprimerBtn).addEventListener('click', deleteItem);
        document.querySelector(UISelector.annulerBtn).addEventListener('click', cancelAction);
    }

    const addItemSubmited = function(e) {
        const inputValue = UICtrl.getInputValue().task;
        if (inputValue !== "") {
            ItemCtrl.addItem(inputValue);
            UICtrl.clearInput();
            StoreItems.store(ItemCtrl.getItems());
            readAllItems();
        }
        e.preventDefault();
    };

    const readAllItems = function() {
        const lastItems = StoreItems.get();
        ItemCtrl.setItem(lastItems);
        const items = ItemCtrl.getItems();
        const nombreTache = ItemCtrl.getTotalTask();
        const data = ItemCtrl.getItemsInformations();
        UICtrl.updateProgressBar(data);
        UICtrl.populateItems(items, nombreTache);

    };

    const addItemToForm = function(e) {
        if (e.target.type === 'checkbox') {
            const listId = e.target.closest('li').id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const editItem = ItemCtrl.findItemById(id);
            if (e.target.checked) {                
                editItem.completed = true;
            } else {
                editItem.completed = false;
            }
            ItemCtrl.setCurrentItem(editItem);
            StoreItems.store(ItemCtrl.getItems());
            readAllItems();
            return;
        }
    
        if (e.target.classList.contains('edit-action')) {
            const listId = e.target.closest('li').id;
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
            StoreItems.store(ItemCtrl.getItems());
            UICtrl.clearInput();
            UICtrl.editStatement();
            readAllItems();
        }
        e.preventDefault();
    };

    const showPopUp = function(e) {
        if (e.target.type === 'checkbox') {
            return; // Ne fait rien et laisse le comportement par défaut du checkbox
        }
        if (e.target.classList.contains('delete-action')) {
            const listId = e.target.parentNode.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const editItem = ItemCtrl.findItemById(id);
            ItemCtrl.setCurrentItem(editItem);
            UICtrl.showPopUp();
        }
        e.preventDefault();
    };

    const deleteItem = function() {
        ItemCtrl.deleteItem();
        StoreItems.store(ItemCtrl.getItems());
        readAllItems();
        UICtrl.showPopUp();
    };

    const cancelAction = function() {
        UICtrl.showPopUp();
    };


    return {
        init: function() {
            console.log('Initializing App...');
            loadEvent();
        }
    }
})(ItemCtrl, UICtrl);

App.init();
