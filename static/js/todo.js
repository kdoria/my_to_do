
const appContainer = document.querySelector(".myapp-container");
const categoryList = document.querySelector('.category-list');
const newCategoryDiv = "category";
const createCategoryButton = document.querySelector('#create-category-button');
const categoryDescription = document.querySelector('#new-category-desc');
let category_sequence = 0;


var category_list = {};
var all_items = {};

function showItemRemaining(categoryId) {
    let itemsToShow = category_list[categoryId].items_count;
   //let htmlspan = document.querySelector(`span.${categoryId}`);
    let spanList = document.getElementsByTagName('span');
    let categorySpan;

    for (i = 0;i<spanList.length;i++){
        if (spanList[i].classList.contains(categoryId)) {
            categorySpan = spanList[i];
            break;
        }
    }

    categorySpan.textContent = itemsToShow;
}

function completeItem(){
    if (!this.checked) return;
    
    let htmlitemId = `#item-${this.classList[0]}`;
    let category_item = htmlitemId.split('-');
    console.log(category_item);
    let itemInput = document.querySelector(htmlitemId);
    console.log(itemInput);
    let categoryId = category_item[1];
    let itemId = category_item[2];
    
    if (all_items[categoryId].items[itemId].status === "complete") return;
    
    category_list[categoryId].items_count--;
    all_items[categoryId].items[itemId].status = "complete";

    itemInput.style.textDecoration = "line-through";
    showItemRemaining(categoryId);


}


function showNewItem(ItemObject,categoryId,divToDoList){
    
    let divtoDo = document.createElement("form");
    divtoDo.classList.add("todo");
    divtoDo.setAttribute('id',`todo-${categoryId}-${ItemObject.id}`);
    let inputradio = document.createElement("input");
    inputradio.setAttribute('type',"radio");
    inputradio.classList.add(`${categoryId}-${ItemObject.id}`);
    inputradio.addEventListener("click", completeItem);
    inputradio.setAttribute('id',`check-${categoryId}-${ItemObject.id}`);
    let inputDesc = document.createElement("input");
    inputDesc.setAttribute('type', 'text');
    inputDesc.setAttribute('id',`item-${categoryId}-${ItemObject.id}`);
    inputDesc.value = ItemObject.item;
    inputDesc.classList.add(`${categoryId}-${ItemObject.id}`);
    inputDesc.setAttribute('placeholder',ItemObject.item);

    divtoDo.appendChild(inputradio);
    divtoDo.appendChild(inputDesc);
    divToDoList.appendChild(divtoDo);

}

function createNewItem() {
    //obtaining the category
    const categoryId = this.classList[1];
    const InputTagName = "INPUT";
    let create_todo = `#createtodo_${this.classList[1]}`;

    //obtain the description
    let divCreateToDo = document.querySelector(create_todo);
    console.log(divCreateToDo.childNodes);

    let newItemDescription = "";

    for (let i = 0; i < divCreateToDo.childNodes.length;i++){
        //console.log(divCreateToDo.childNodes[i].tagName);        

        if (divCreateToDo.childNodes[i].tagName == InputTagName){
            newItemDescription = divCreateToDo.childNodes[i].value;
            divCreateToDo.childNodes[i].value = "";
        }
    }

    if (newItemDescription == "") return alert("must enter an item");

    let divToDoList = document.querySelector("#todo-list_"+this.classList[1]);

    let newItem = {
                    id:all_items[categoryId].items_sequence,
                    item: newItemDescription,
                    status: "uncompleted"
                    };

    all_items[categoryId].items[newItem.id] = newItem;
    all_items[categoryId].items_sequence++;        
    category_list[categoryId].items_count++;
    console.log(all_items);
    console.log(category_list);
     
    showNewItem(newItem,categoryId,divToDoList);
    showItemRemaining(categoryId);

}

function completeAllItems(){
    //Get the Category Id
    let categoryId = this.classList[0];
    //Get incomplete items
    let items_ = Object.entries(all_items[categoryId].items);
    items_.forEach( item =>{
        
        if (item[1].status !== "uncompleted") return;
        //Update items to complete
        item[1].status = 'complete';
        //Update the checkbutton and cross the description
        category_list[categoryId].items_count--;
        let itemDesc = document.querySelector(`#item-${categoryId}-${item[0]}`);
        let checkItem = document.querySelector(`#check-${categoryId}-${item[0]}`);

        itemDesc.style.textDecoration = "line-through";
        checkItem.checked = true;

    });

    showItemRemaining(categoryId);

}

function deleteItems(categoryId,justComplete = false){

    let items_ = Object.entries(all_items[categoryId].items);
    //console.log(`hey ${all_items[categoryId].items}`);
    items_.forEach( item =>{
        
        if (item[1].status !== "complete" && justComplete) return;
              
        delete all_items[categoryId].items[item[0]];
        //console.log(`#todo-${categoryId}-${item[0]}`);
        let form = document.querySelector(`#todo-${categoryId}-${item[0]}`);
        console.log(form);
        while (form.firstChild) form.removeChild(form.firstChild);
        form.parentNode.removeChild(form);

    });

}

function deleteAllComplete(){
    //Get the Category Id
    let categoryId = this.classList[0];
    const justComplete = true;
    deleteItems(categoryId,justComplete);

}

function deleteCategoryFunction(){
    let categoryId = this.classList[0];
    
    //delete category from all objects
    delete category_list[categoryId];
    delete all_items[categoryId];
    
    //Delete category from DOM
    let divContainer = this.parentNode.parentNode;
    const deleteChildren = (parent) => {
        if (parent.firstChild==null) return; 
            
        for(let child=parent.firstChild; child!==null; child=child.nextSibling) {
            deleteChildren(child);
            child.parentNode.removeChild(child);
        }

    }

    //Delete from the category list
    let listCategory = document.querySelector(`#li_${categoryId}`);
    listCategory.parentNode.removeChild(listCategory);


    deleteChildren(divContainer);
    divContainer.parentNode.removeChild(divContainer);

}

function createNewCategory() {

    if (categoryDescription.value === '') return alert("Must enter a category name");
    

    let newListCategory = {id:category_sequence,
                           title:categoryDescription.value,
                           items_count:0};


    category_sequence++;     
    
    all_items[newListCategory.id] = {   items_sequence: 0,
                                        items: {}
                                    };

    category_list[newListCategory.id]= newListCategory;

    console.log(category_list);    

    const showNewCategory = (categoryDesc) => {
        let newItem = document.createElement('li');
        newItem.classList.add(newListCategory.id);
        newItem.setAttribute('id', `li_${newListCategory.id}`);
        newItem.appendChild(document.createTextNode(categoryDesc));
        categoryList.appendChild(newItem);
    };

    showNewCategory(newListCategory.title);
    showNewList(newListCategory);

    categoryDescription.value = "";    

}

function showNewList(categoryObject){

    //Create the initial div and the title div
    const todoclass = "todo-container";
    const todotitleclass = "todo-list-title";
    let divTodo = document.createElement('div');
    divTodo.classList.add(todoclass);
    divTodo.classList.add(categoryObject.id);
    let divtoDoTitle = document.createElement('div');
    divtoDoTitle.classList.add(todotitleclass);
    divtoDoTitle.classList.add(categoryObject.id);
    let titleDesc = document.createElement('h1');
    titleDesc.textContent = categoryObject.title;
    let p = document.createElement('p');
    let span = document.createElement('span'); 
    span.classList.add(categoryObject.id);
    span.textContent = categoryObject.items_count;
    p.appendChild(span);
    p.appendChild(document.createTextNode(" items remaining"));
    divtoDoTitle.appendChild(titleDesc);
    divtoDoTitle.appendChild(p);
    divTodo.appendChild(divtoDoTitle);
    appContainer.appendChild(divTodo);

    //Create the body div where the items will be contained
    const todoListClass = "todo-list";
    let divTodoList = document.createElement('div');
    divTodoList.classList.add(todoListClass);
    divTodoList.classList.add(categoryObject.id);
    divTodoList.setAttribute("id", `todo-list_${categoryObject.id}`);
    divTodo.appendChild(divTodoList);

    //Create the buttons
    const createButtonDivClass = "create-do";
    let divbuttons = document.createElement('div');
    divbuttons.classList.add(createButtonDivClass);
    divbuttons.classList.add(categoryObject.id);
    divbuttons.setAttribute('id', `createtodo_${categoryObject.id}`);
    let createItemButton = document.createElement('button');
    createItemButton.classList.add("add-todo-list");
    createItemButton.classList.add(categoryObject.id);
    createItemButton.addEventListener('click', createNewItem);
    let createItemButtonsvg = document.createElement('i');
    createItemButtonsvg.classList.add('fas');
    createItemButtonsvg.classList.add('fa-plus');
    createItemButton.appendChild(createItemButtonsvg);
    let newItemInput = document.createElement('input');
    newItemInput.setAttribute('type', 'text');
    newItemInput.setAttribute('placeholder', 'Create a new item');
    divbuttons.appendChild(createItemButton);
    divbuttons.appendChild(newItemInput);
    divTodo.appendChild(divbuttons);

    //Create the delete buttons
    const deletebuttonclass = "list-buttons";
    let deletebuttonDiv = document.createElement('div');
    deletebuttonDiv.classList.add(deletebuttonclass);
    let completeButton = document.createElement('button');
    completeButton.appendChild(document.createTextNode("Complete all items"));
    completeButton.classList.add(categoryObject.id);
    completeButton.addEventListener('click', completeAllItems);
    let deleteAllButton = document.createElement('button');
    deleteAllButton.appendChild(document.createTextNode("Delete all completed items"));
    deleteAllButton.classList.add(categoryObject.id);
    deleteAllButton.addEventListener('click', deleteAllComplete);
    let deleteCategory = document.createElement('button');
    deleteCategory.appendChild(document.createTextNode("Delete Category"));
    deleteCategory.classList.add(categoryObject.id);  
    deleteCategory.addEventListener('click', deleteCategoryFunction);
    deletebuttonDiv.appendChild(completeButton);
    deletebuttonDiv.appendChild(deleteAllButton);
    deletebuttonDiv.appendChild(deleteCategory);
    divTodo.appendChild(deletebuttonDiv);

}

createCategoryButton.addEventListener('click', createNewCategory);
