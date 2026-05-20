const taskForm = document.getElementById("taskForm");
const formPriority = document.getElementById("priority");
const formDate = document.getElementById("date");
const formTitle = document.getElementById("title");
const formDesc = document.getElementById("desc");
// const addTaskBtn = document.getElementById("saveBtn");
// const cancelTaskBtn = document.getElementById("cancelBtn");

const doTaskContainer = document.querySelector("#doTaskContainer");
const scheduleTaskContainer = document.querySelector('#scheduleTaskContainer');

doList = [];
scheduleList = [];
delegateList = [];
deleteList = [];
editing = null;


function initialLoad() {
    if (!localStorage.getItem("doList")) {
        localStorage.setItem("doList", JSON.stringify(doList));
    }
    if (!localStorage.getItem("scheduleList")) {
        localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    }
    if (!localStorage.getItem("delegateList")) {
        llocalStorage.setItem("delegateList", JSON.stringify(delegateList));
    }
    if (!localStorage.getItem("deleteList")) {
        localStorage.setItem("deleteList", JSON.stringify(deleteList));
    }
    updatePage();
}
initialLoad();


function updatePage() {
    // updates page with saved tasks if any, make into separate func?****
    doList = JSON.parse(localStorage.getItem("doList"));
    scheduleList = JSON.parse(localStorage.getItem("scheduleList"));
    delegateList = JSON.parse(localStorage.getItem("delegateList"));
    deleteList = JSON.parse(localStorage.getItem("deleteList"));

    let doInner = '';
    doList.forEach((taskElement, taskIndex) => {
        if (taskElement.completed == true) {
            doInner += `<div class="task doTask completed">
                            <div class="taskLeft">
                                <button class="iconBtn" onclick="checkTask('doList', ${taskIndex})"><i class="fa-solid fa-check"></i></button>`;}
        else {
            doInner += `<div class="task doTask">
                            <div class="taskLeft">
                                <button class="iconBtn" onclick="checkTask('doList', ${taskIndex})"><i class="fa-regular fa-square"></i></button>`;}

        doInner += `<div class="taskText" onclick="openTask('doList', ${taskIndex})">
                        <span>${taskElement["title"]}</span>`

        if (taskElement.date != "") {doInner += `<span class="date">${taskElement.date}</span>`;}
                        
        doInner += `</div>
                    </div>
                    <button class="iconBtn" onclick="deleteTask('doList', ${taskIndex})"><i class="fa-regular fa-trash-can"></i></button>
                    </div>` 
    });
    doTaskContainer.innerHTML = doInner;


    let scheduleInner = '';
    scheduleList.forEach((taskElement, taskIndex) => {
        if (taskElement.completed == true) {
            scheduleInner += `<div class="task scheduleTask completed">
                            <button class="iconBtn" onclick="checkTask('scheduleList', ${taskIndex})"><i class="fa-solid fa-check"></i></button>`;}
        else {
            scheduleInner += `<div class="task scheduleTask">
                            <button class="iconBtn" onclick="checkTask('scheduleList', ${taskIndex})"><i class="fa-regular fa-square"></i></button>`;}

        scheduleInner += `    <span class="taskFront" onclick="openTask('scheduleList', ${taskIndex})">${taskElement["title"]}</span>
                        <button class="iconBtn" onclick="deleteTask('scheduleList', ${taskIndex})"><i class="fa-regular fa-trash-can"></i></button>
                    </div>`
    });
    scheduleTaskContainer.innerHTML = scheduleInner;
}

function openTask(list, index) {
    let temp = JSON.parse(localStorage.getItem(list));
    // if (temp[index].priority == "do") {alert("yes")} ;
    formPriority.value = temp[index].priority;
    formDate.value = temp[index].date;
    formTitle.value = temp[index].title;
    formDesc.value = temp[index].desc;
    editing = {}
    editing["list"] = list;
    editing["index"] = index;
}

function checkTask(list, index) {
    let temp = JSON.parse(localStorage.getItem(list));
    if (JSON.parse(temp[index].completed) == false) {temp[index].completed = true;}
    else {temp[index].completed = false;}

    localStorage.setItem(list, JSON.stringify(temp));
    updatePage();
}

function deleteTask(list, index) {
    let temp = JSON.parse(localStorage.getItem(list));
    temp = temp.filter((taskElement, taskIndex) => {
        if (taskIndex === index) {return false;}
        return true;})

    localStorage.setItem(list, JSON.stringify(temp));
    updatePage();
}


function addTask(e) {
    e.preventDefault(); // stops page refresh after form is submitted 
    
    let form = new FormData(taskForm); // takes form entries as array of value pairs
    form.append("completed", false);
    let data = Object.fromEntries(form); // transforms into key-value pairs

    if (editing != null) {
        let list = editing.list;
        let index = editing.index;
        let temp = JSON.parse(localStorage.getItem(list));

        if (temp[index].priority != data.priority) {
            editing = null;
            addTask(e);
            deleteTask(list, index);
        }
        else {
            temp[index].title = data.title;
            temp[index].desc = data.desc;
            editing = null;
            localStorage.setItem(list, JSON.stringify(temp));
        }
    }
    else {
        switch (data["priority"]) { //*** add try catch? */
            case "do":
                doList.push(data);
                localStorage.setItem("doList", JSON.stringify(doList));
                break;
            case "schedule":
                scheduleList.push(data);
                localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
                break;
            case "delegate":
                delegateList.push(data);
                localStorage.setItem("delegateList", JSON.stringify(delegateList));
                break;
            case "delete":
                deleteList.push(data);
                localStorage.setItem("deleteList", JSON.stringify(deleteList));
        }
    }

    taskForm.reset();
    updatePage();
}


saveBtn.addEventListener("click", addTask)