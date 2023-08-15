import { WebApp, Component, EventManager } from './modules/app.js';

// Required to initialize our web app
const app = new WebApp();

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')

const taskTemplate = document.getElementById("task-template")

const newTaskForm = document.querySelector("[data-new-task-form]")
const newTaskInput = document.querySelector("[data-new-task-input]")


const editListButton = document.querySelector("[data-open-modal]")
const closeEditListButton = document.querySelector("[data-close-modal]")
const editModal = document.querySelector("[data-modal]")

const editListForm = document.querySelector("[data-edit-list-form]")
const editListInput = document.querySelector("[data-edit-list-input]")


let selectedListId = null


async function getList() {
    let todo_list = await app.GET("api/test.php");
    return todo_list
}

let todo_list = await getList()


editListForm.addEventListener('submit', async e => {
    // prevent form from submitting itself
    e.preventDefault()

    // get value inputted from user 
    const newListName = editListInput.value

    // if user inputted nothing then just return nothing so this function doesn't go through
    if (newListName == null || newListName === '') return

    await editListName(newListName, parseInt(selectedListId))

    editListInput.value = null

    todo_list = await getList()

    render(todo_list);

    editModal.close()

})

async function editListName(newListName, id) {
    const url = `api/updateListName.php?id=${id}`
    const data = newListName
    let result = await app.PUT(url, data)
}


deleteListButton.addEventListener('click', async (e) => {
    if (selectedListId == null) {
        alert("Please select a list")
        return
    }
    let url = `api/test.php?id=${selectedListId}`

    let value = confirm("Are you sure you want to delete this list?")
    if (value == 1) {
        let result = await app.DELETE(url, null, "text")
    }
    todo_list = await getList()

    render(todo_list);

});

// this event listener is for selecting a list and making it the active list
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listIdx
        render(todo_list)
    }
});


tasksContainer.addEventListener('click', async e => {
    if (e.target.tagName.toLowerCase() === 'input') {

        const marked = e.target.checked ? 1 : 0

        // update the marked complete given the value of the checkbox and the list_item idx
        await updateCheckbox(marked, parseInt(e.target.id))

        // update the list
        todo_list = await getList()

        //rerender the list to update in real time
        render(todo_list);

    }
    else if (e.target.tagName.toLowerCase() === 'button') {

        let id = parseInt(e.target.id)

        await deleteTask(id)

        // update the list
        todo_list = await getList()

        //rerender the list to update in real time
        render(todo_list);

    }


})


async function deleteTask(id) {
    const url = `api/deleteTask.php?id=${id}`
    const data = null
    let result = await app.DELETE(url, data, 'text')
}


async function updateCheckbox(bool, id) {
    const url = `api/updateCheckbox.php?id=${id}`
    const data = bool
    let result = await app.PUT(url, data, 'text');
}


// event listener to for list submit
newListForm.addEventListener('submit', async e => {
    // prevent form from submitting itself
    e.preventDefault()

    // get value inputted from user 
    const listName = newListInput.value

    // if user inputted nothing then just return nothing so this function doesn't go through
    if (listName == null || listName === '') return

    // create a list in the database given user inputted list name
    await createList(listName);


    // clear value field
    newListInput.value = null

    // kinda a scuffed way to do this but itll do
    todo_list = await getList()

    //rerender the page with updated list info
    render(todo_list);


})


// event listener for list item submit
newTaskForm.addEventListener('submit', async e => {
    // prevent form from submitting itself
    e.preventDefault()

    const taskName = newTaskInput.value


    // if user inputted nothing then just return nothing so this function doesn't go through
    if (taskName == null || taskName === '') return

    // get selected list idx
    let list_idx = selectedListId

    await createTask(taskName, list_idx);

    // clear value field
    newTaskInput.value = null

    // get updated list
    todo_list = await getList()

    // rerender the list with the new list items
    render(todo_list);


})

// async function to create a list item in the database
async function createTask(task, list_idx) {
    const url = `api/createTask.php?id=${list_idx}`
    const data = task
    let created_list_item = await app.POST(url, data);
}


// async function to create a list in the database
async function createList(name) {
    const url = "api/test.php"
    const data = name
    let created_list = await app.POST(url, data);
}


function render(list) {
    // call this function first to clear
    clearElement(listsContainer)

    // render the lists from database
    renderLists(list)

    // this gets the selected list's idx
    const selectedList = list.find(item => item.idx == selectedListId)

    // Displays nothing on first load up and after delete or displays a selected list tasks/items
    if (selectedListId == null || selectedList === undefined) {
        // set the display to nothing
        listDisplayContainer.style.display = 'none'
    }
    else {
        //set the list to an empyt string to revert back to showing something
        listDisplayContainer.style.display = ''
        //get the title element and give it the selectedList's name
        listTitleElement.innerText = selectedList.name
        // then render the task count
        renderTaskCount(selectedList)

        clearElement(tasksContainer)
        renderTasks(selectedList)

    }


}


async function renderTasks(selectedList) {

    const listItems = await getListItems(selectedList.idx);

    listItems.forEach(element => {
        // get the template with the parameter true to get everything inside
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        const delete_button = taskElement.querySelector('button.btn.delete')
        // set the id of these elements to have the list_item idx 
        checkbox.id = element.idx
        delete_button.id = element.idx
        checkbox.checked = element.marked_complete
        const label = taskElement.querySelector('label')
        label.htmlFor = element.idx
        label.append(element.text)

        tasksContainer.appendChild(taskElement)

    });

}


// this renders all the list items and its properties
async function renderTaskCount(selectedList) {

    // get the list items
    const listItems = await getListItems(selectedList.idx)


    // this filters all tasks that are not marked complete and gets the length of it
    const incompleteTasksCount = listItems.filter(task => !task.marked_complete).length

    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"


    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`

}


// this function is to get the list items given the idx of the selected list
async function getListItems(idx) {
    const url = `api/test.php?id=${idx}`
    let result = await app.GET(url)

    return result
}


function renderLists(list) {
    // looping through each list object
    for (const key in list) {

        //create element similar to preset hardcoded list
        const listElement = document.createElement('li')

        // set dataset attribute to list idx to the actual list idx from database
        listElement.dataset.listIdx = list[key].idx

        // add class attribute list name for each list
        listElement.classList.add("list-name")
        // add the list name in html
        listElement.innerText = list[key].name


        if (list[key].idx == selectedListId) {
            listElement.classList.add('active-list')
        }

        listsContainer.appendChild(listElement)

    }

}


// function to remove example lists hardcoded in html
// might just remove this function after removing the actual hardcoded html later
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }

}

render(todo_list);


editListButton.addEventListener("click", (e) => {
    editModal.showModal()
})

closeEditListButton.addEventListener("click", (e) => {
    editModal.close()
})