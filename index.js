const taskForm = document.getElementById("taskForm");
const formPriority = document.getElementById("priority");
const formDate = document.getElementById("date");
const formTitle = document.getElementById("title");
const formDesc = document.getElementById("desc");
const pomoMode = document.getElementById("pomoMode");
const sideWidget = document.getElementById("sideWidget");
const matrix = document.getElementById("matrix");
const sideContent = document.getElementById("sideContent");
const focus = document.getElementById("focus");
const shortBrk = document.getElementById("shortBrk");
const longBrk = document.getElementById("longBrk");
const focusContainer = document.getElementById("focusContainer");
const shortBrkContainer = document.getElementById("shortBrkContainer");
const longBrkContainer = document.getElementById("longBrkContainer");
const min = document.getElementById("min");
const sec = document.getElementById("sec");
const timerReset = document.getElementById("timerReset");
const clearPopup = document.getElementById("clearPopup");
const quickNote = document.getElementById("quickNote");
const notepad = document.getElementById("notepad");
const myNote = document.getElementById("myNote");
const clock = document.querySelector('#clock');
const startStop = document.querySelector('#startStop');
const timer = document.querySelector('#timer');

const doTaskContainer = document.querySelector("#doTaskContainer");
const scheduleTaskContainer = document.querySelector('#scheduleTaskContainer');
const delegateTaskContainer = document.querySelector('#delegateTaskContainer');
const deleteTaskContainer = document.querySelector('#deleteTaskContainer');

const ding = new Audio('sounds/ding.mp3');
const button = new Audio('sounds/button.mp3');
const pomoAlarm = new Audio('sounds/pomoAlarm.mp3');

const pomoFocus = 25;
const pomoShortBrk = 5;
const pomoLongBrk = 15;
curPomoSetting = "focus";

doList = [];
scheduleList = [];
delegateList = [];
deleteList = [];
note = "";
editing = null;

function initialLoad() {
    if (!localStorage.getItem("doList")) {
        localStorage.setItem("doList", JSON.stringify(doList));
    }
    if (!localStorage.getItem("scheduleList")) {
        localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    }
    if (!localStorage.getItem("delegateList")) {
        localStorage.setItem("delegateList", JSON.stringify(delegateList));
    }
    if (!localStorage.getItem("deleteList")) {
        localStorage.setItem("deleteList", JSON.stringify(deleteList));
    }
    if (!localStorage.getItem("note")) {
        localStorage.setItem("note", note);
    }
    updateTime();
    updatePage();
    setPomo('focus');
}
initialLoad();

myNote.addEventListener("input", () => {
    localStorage.setItem("note", myNote.value);
});


function updatePage() {
    // updates page with saved tasks if any, make into separate func?****
    doList = JSON.parse(localStorage.getItem("doList"));
    scheduleList = JSON.parse(localStorage.getItem("scheduleList"));
    delegateList = JSON.parse(localStorage.getItem("delegateList"));
    deleteList = JSON.parse(localStorage.getItem("deleteList"));
    note = localStorage.getItem("note");

    myNote.value = note;
    // scheduleTaskContainer.innerHTML = `<p1>hi</p1>`;
    let doInner = '';
    if (doList == "") {
        doInner = `<p1>No tasks</p1>`;
    }
    else {
        doList.forEach((taskElement, taskIndex) => {
            if (taskElement.completed == true) {
                doInner += `<div class="completed task doTask" onclick="openTask('doList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('doList', ${taskIndex}, event)"><i class="fa-solid fa-check"></i></button>`;}
            else {
                doInner += `<div class="task doTask" onclick="openTask('doList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('doList', ${taskIndex}, event)"><i class="fa-regular fa-square"></i></button>`;}

            doInner += `<div class="taskText">
                            <span>${taskElement["title"]}</span>`

            if (taskElement.date != "") {doInner += `<span class="date">${taskElement.date}</span>`;}
                            
            doInner += `</div>
                        </div>
                        <button class="iconBtn" onclick="deleteTask('doList', ${taskIndex}, event)"><i class="fa-regular fa-trash-can"></i></button>
                        </div>` 
        });
    }
    doTaskContainer.innerHTML = doInner;


    let scheduleInner = '';
    if (scheduleList == "") {
        scheduleInner = `<p1>No tasks</p1>`;
    }
    else {
        scheduleList.forEach((taskElement, taskIndex) => {
            if (taskElement.completed == true) {
                scheduleInner += `<div class="completed task scheduleTask" onclick="openTask('scheduleList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('scheduleList', ${taskIndex}, event)"><i class="fa-solid fa-check"></i></button>`;}
            else {
                scheduleInner += `<div class="task scheduleTask" onclick="openTask('scheduleList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('scheduleList', ${taskIndex}, event)"><i class="fa-regular fa-square"></i></button>`;}

            scheduleInner += `<div class="taskText">
                            <span>${taskElement["title"]}</span>`

            if (taskElement.date != "") {scheduleInner += `<span class="date">${taskElement.date}</span>`;}
                            
            scheduleInner += `</div>
                        </div>
                        <button class="iconBtn" onclick="deleteTask('scheduleList', ${taskIndex}, event)"><i class="fa-regular fa-trash-can"></i></button>
                        </div>` 
        });
    }
    scheduleTaskContainer.innerHTML = scheduleInner;


    let delegateInner = '';
    if (delegateList == "") {
        delegateInner = `<p1>No tasks</p1>`;
    }
    else {
        delegateList.forEach((taskElement, taskIndex) => {
            if (taskElement.completed == true) {
                delegateInner += `<div class="completed task delegateTask" onclick="openTask('delegateList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('delegateList', ${taskIndex}, event)"><i class="fa-solid fa-check"></i></button>`;}
            else {
                delegateInner += `<div class="task delegateTask" onclick="openTask('delegateList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('delegateList', ${taskIndex}, event)"><i class="fa-regular fa-square"></i></button>`;}

            delegateInner += `<div class="taskText">
                            <span>${taskElement["title"]}</span>`

            if (taskElement.date != "") {delegateInner += `<span class="date">${taskElement.date}</span>`;}
                            
            delegateInner += `</div>
                        </div>
                        <button class="iconBtn" onclick="deleteTask('delegateList', ${taskIndex}, event)"><i class="fa-regular fa-trash-can"></i></button>
                        </div>` 
        });
    }
    delegateTaskContainer.innerHTML = delegateInner;


    let deleteInner = '';
    if (deleteList == "") {
        deleteInner = `<p1>No tasks</p1>`;
    }
    else {
        deleteList.forEach((taskElement, taskIndex) => {
            if (taskElement.completed == true) {
                deleteInner += `<div class="completed task deleteTask" onclick="openTask('deleteList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('deleteList', ${taskIndex}, event)"><i class="fa-solid fa-check"></i></button>`;}
            else {
                deleteInner += `<div class="task deleteTask" onclick="openTask('deleteList', ${taskIndex})">
                                <div class="taskLeft">
                                    <button class="iconBtn" onclick="checkTask('deleteList', ${taskIndex}, event)"><i class="fa-regular fa-square"></i></button>`;}

            deleteInner += `<div class="taskText">
                            <span>${taskElement["title"]}</span>`

            if (taskElement.date != "") {deleteInner += `<span class="date">${taskElement.date}</span>`;}
                            
            deleteInner += `</div>
                        </div>
                        <button class="iconBtn" onclick="deleteTask('deleteList', ${taskIndex}, event)"><i class="fa-regular fa-trash-can"></i></button>
                        </div>` 
        });
    }
    deleteTaskContainer.innerHTML = deleteInner;

    
}

function openTask(list, index) {
    let temp = JSON.parse(localStorage.getItem(list));
    formPriority.value = temp[index].priority;
    formDate.value = temp[index].date;
    formTitle.value = temp[index].title;
    formDesc.value = temp[index].desc;
    editing = {}
    editing["list"] = list;
    editing["index"] = index;
    taskPopup.classList.add("open");
}

function checkTask(list, index, event) {
    event.stopPropagation();

    let temp = JSON.parse(localStorage.getItem(list));
    if (JSON.parse(temp[index].completed) == false) {
        temp[index].completed = true;
        ding.currentTime = 0;
        ding.play();
    }
    else {temp[index].completed = false;}

    localStorage.setItem(list, JSON.stringify(temp));    
    updatePage();
}

function deleteTask(list, index, event) {
    event.stopPropagation();

    let task = event.target.closest(".task");
    task.classList.add("shrink");

    setTimeout(() => {
        deleteNoAnimation(list, index)
        }, 400);
}
function deleteNoAnimation(list, index) {
    let temp = JSON.parse(localStorage.getItem(list));
    temp = temp.filter((taskElement, taskIndex) => {
    if (taskIndex === index) {return false;}
        return true;})
    localStorage.setItem(list, JSON.stringify(temp));
    updatePage();
}

function addTask(event) {
    event.preventDefault(); // stops page refresh after form is submitted 
    
    let form = new FormData(taskForm); // takes form entries as array of value pairs
    form.append("completed", false);
    let data = Object.fromEntries(form); // transforms into key-value pairs

    if (editing != null) {
        let list = editing.list;
        let index = editing.index;
        let temp = JSON.parse(localStorage.getItem(list));

        if (temp[index].priority != data.priority) {
            editing = null;
            addTask(event);
            // deleteTask(list, index);
            // let del = JSON.parse(localStorage.getItem(list));
            deleteNoAnimation(list, index);
        }
        else {
            if (data.title == "") {
            formTitle.classList.add("blank");
            formTitle.placeholder = "Please enter a task name";
            return;
            }

            temp[index].title = data.title;
            temp[index].desc = data.desc;
            temp[index].date = data.date;
            editing = null;
            localStorage.setItem(list, JSON.stringify(temp));
        }
    }
    else {
        if (data.title == "") {
            formTitle.classList.add("blank");
            formTitle.placeholder = "Please enter a task name";
            return;
        }

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
    formTitle.placeholder = "Task";
    toggleNote();
    taskPopup.classList.remove("open");
    
    updatePage();
}

function updateTime() {
    const time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    m = formatTime(m);
    s = formatTime(s);

    let period = "AM";
    if (h > 12) {
        h = h % 12;
        period = "PM";
    }
    h = formatTime(h);

    clock.innerHTML = `<div>${h}:${m}</div>
                        <div id="timeRight">
                            <p1>${period}</p1>
                            <p1>${s}</p1>
                        </div>`;
    setTimeout(() => {updateTime()}, 1000);
}
function formatTime(unit) {
    if (unit < 10) return `0${unit}`;
    return unit;
}

function setPomo(pomoType) {
    
    if (focus.value == "" || (isNaN(Number(focus.value)))) focus.value = pomoFocus;
    if (shortBrk.value == "") shortBrk.value = pomoShortBrk;
    if (longBrk.value == "") longBrk.value = pomoLongBrk;

    sec.textContent = "00";
    curPomoSetting = pomoType;

    let timerVal;
    
    if (pomoType == 'focus') {
        min.textContent = formatTime(focus.value);
        focusContainer.classList.add('selected');
        shortBrkContainer.classList.remove('selected');
        longBrkContainer.classList.remove('selected');
    }
    else if (pomoType == 'shortBrk') {
        min.textContent = formatTime(shortBrk.value);
        focusContainer.classList.remove('selected');
        shortBrkContainer.classList.add('selected');
        longBrkContainer.classList.remove('selected');
    }
    else if (pomoType == 'longBrk') {
        min.textContent = formatTime(longBrk.value);
        focusContainer.classList.remove('selected');
        shortBrkContainer.classList.remove('selected');
        longBrkContainer.classList.add('selected');
    }

    startStop.innerHTML = 'Start';
    startStop.classList.remove('running');
    startStop.classList.remove('pause');
}

function updatePomo() {
    if (!startStop.classList.contains('running')) return;

    let m = Number(min.textContent);
    let s = Number(sec.textContent);
    if (m == 0 && s == 0) return;

    if (s <= 0) {
        s = 59;
        m = m - 1;
    }
    else {s = s - 1;}

    min.textContent = formatTime(m);
    sec.textContent = formatTime(s);

    if (m == 0 && s == 0) {
        pomoAlarm.play();
        startStop.innerHTML = 'Start';
        startStop.classList.remove('running');
        startStop.classList.remove('pause');
        return;
    }

    setTimeout(() => {updatePomo()}, 1000);
}

function toggleNote() {
    if (notepad.classList.contains("open")) {
        notepad.classList.remove("open");
        notepad.classList.add("back");
    }
    else if (notepad.classList.contains("back")) {
        notepad.classList.add("open");
        notepad.classList.remove("back");
    }
}


saveBtn.addEventListener("click", addTask)
openBtn.addEventListener("click", () => {
    toggleNote();
    taskPopup.classList.add("open");
});
cancelBtn.addEventListener("click", () => {
    editing = null;
    if (notepad.classList.contains("back")) {
        notepad.classList.add("open");
        notepad.classList.remove("back");
    }
    taskPopup.classList.remove("open");
    formTitle.classList.remove("blank");
    formTitle.placeholder = "Task";
});
formTitle.addEventListener("focus", () => {
    formTitle.classList.remove("blank");
});

pomodoro.addEventListener("click", () => {
    pomoMode.classList.add("open");
    sideContent.classList.add("stretch");
    matrix.classList.add("shrink");
    notepad.classList.add("shrink");
});
pomoExit.addEventListener("click", () => {
    pomoMode.classList.remove("open");
    sideContent.classList.remove("stretch");
    matrix.classList.remove("shrink");
    notepad.classList.remove("shrink");
});

resetBtn.addEventListener("click", () => {
    toggleNote();
    clearPopup.classList.add('open');
});
noClearBtn.addEventListener("click", () => {
    toggleNote();
    clearPopup.classList.remove('open');
});
yesClearBtn.addEventListener("click", () => {
    doList = [];
    scheduleList = [];
    delegateList = [];
    deleteList = [];
    editing = null;

    localStorage.setItem("doList", JSON.stringify(doList));
    localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
    localStorage.setItem("delegateList", JSON.stringify(delegateList));
    localStorage.setItem("deleteList", JSON.stringify(deleteList));

    updatePage();
    toggleNote();
    clearPopup.classList.remove('open');
});

startStop.addEventListener("click", () => {
    if (startStop.innerHTML == 'Start') {
        startStop.innerHTML = 'Pause';
        startStop.classList.add('running')
    }
    else {
        startStop.innerHTML = 'Start';
        startStop.classList.remove('running');
    }

    button.currentTime = 0;
    button.play();

    startStop.classList.toggle('pause');
    updatePomo();
});
timerReset.addEventListener("click", () => {
    startStop.innerHTML = 'Start';
    startStop.classList.remove('running');
    startStop.classList.remove('pause');
    setPomo(curPomoSetting);
});

focus.addEventListener("change", () => {
    setPomo('focus');
});
shortBrk.addEventListener("change", () => {
    setPomo('shortBrk');
});
longBrk.addEventListener("change", () => {
    setPomo('longBrk');
});

quickNote.addEventListener("click", () => {
    notepad.classList.toggle("open");
    matrix.classList.toggle("hide");

    if (notepad.classList.contains("open")) quickNote.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> Planner`;
    else quickNote.innerHTML = `<i class="fa-solid fa-pencil"></i> Quick notes`;
    
});