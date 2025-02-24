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
        getItems: function() {
            return data.items;
        },
        getTotalTask: function() {
            return data.totalTask();
        },
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
        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function() {
    const UISelector = {
        addBtn: "#add-btn",
        input: "#input-todo",
        nombreTache: "#tasks-nombre",
        ul: "#items-collection"
    };

    return {
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
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button class="text-red-500 hover:text-red-700 text-xl transition-transform transform hover:scale-110">
                                <i class="fa fa-trash"></i>
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

        document.querySelector(UISelector.addBtn).addEventListener('click', function(e) {
            const inputValue = UICtrl.getInputValue().task;
            if (inputValue !== "") {
                ItemCtrl.addItem(inputValue);

                UICtrl.clearInput();

                const items = ItemCtrl.getItems();
                const nombreTache = ItemCtrl.getTotalTask();
                UICtrl.populateItems(items, nombreTache);
            }
            
            e.preventDefault();
        });
    }
    return {
        init: function() {
            console.log('Initializing App...');

            const items = ItemCtrl.getItems();
            const nombreTache = ItemCtrl.getTotalTask();
            UICtrl.populateItems(items, nombreTache);

            loadEvent();
        }
    }
})(ItemCtrl, UICtrl);

App.init();