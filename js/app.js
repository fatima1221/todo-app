// today's date and current time 

// get Date
var date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getUTCDate(),
    months = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

document.getElementById('daymonthyear').innerHTML = day + "/ " + months[month] + "/ " + year;

// get Time
function addZero(i) {
// this checks to see if the number is below 10 and then prepends a '0' - clever shit :P
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function newTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var x = document.getElementById("hourminutesecond");

    x.innerHTML = h + " : " + m;
}

newTime();
setInterval(newTime, 1000);



//weather
window.addEventListener('load', ()=>{
    let long;
    let lat;
    let temperatureDegree =  document.querySelector(".temperature-degree");
    let temperatureDescription =  document.querySelector(".temperature-description");
    let locationTimezone = document.querySelector(".location-timezone");
    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`

            fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                
                const {temperature, summary } = data.currently;
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;
                //set icon
                let icon = document.querySelector(".icon")
                setIcons( icon=icon, data=summary )
                const types = {
                    clear : CLEAR_DAY,
                }
                console.log(summary)

            });

        });   
    }

    function setIcons(icon, data){
        const skycon = new Skycons({color: "blue"});
        const currentIcon = data.replace(/-/g, "_").toUpperCase();
        console.log(currentIcon)
        skycon.play();
        return skycon.set(icon, Skycons.CLEAR_DAY);
    }
});



//Todo's code starts here

//create var 
var addButton = document.getElementById('add'); 
var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks'); // to keep unfinished tasks lists
var finishedTasks = document.getElementById('finished-tasks'); // to keep finished tasks lists


function createNewElement(task, finished) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');

    if(finished){
        checkbox.className = "material-icons checkbox tasks_btn";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    }else {
        checkbox.className = "material-icons checkbox tasks_btn";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }
    var label = document.createElement('label');
    label.innerText = task; //using InnerText you put task here
    var input = document.createElement('input');
    input.type = "text";
    var editButton = document.createElement('button');
    editButton.className = "material-icons edit tasks_btn";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";
    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete tasks_btn";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    //using appendChild metod puts all created var into listItem 
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    //returns created list
    return listItem;
}


//adds new task
function addTask() {
    if (inputTask.value) {
        var listItem = createNewElement(inputTask.value, false);
        unfinishedTasks.appendChild(listItem); //using append child adds new element
        bindTaskEvents(listItem, finishTask)
        inputTask.value = ""; //clears your input
    }
    save(); //saves data to ls
}
addButton.onclick = addTask;

//delete
function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem); //delete li from ul i am using removeChild
    save(); //saves data to ls
}

//edit
function editTask() {
    var editButton = this;
    var listItem = this.parentNode;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type=text]');

    var containsClass = listItem.classList.contains('editMode'); //shows that is there edit mode or not

    if (containsClass) {
        label.innerText = input.value;
        editButton.className = "material-icons edit tasks_btn";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else {
        input.value = label.innerText; //there goes text that was written before
        editButton.className = "material-icons save tasks_btn";
        editButton.innerHTML = "<i class='material-icons'>save</i>";

    }
    listItem.classList.toggle('editMode'); //changes icon from edit to save
}

// proceed when you click on checkbox
function finishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox tasks_btn";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    finishedTasks.appendChild(listItem); //puts your finished task to "finished todo list"
    bindTaskEvents(listItem, unfinishTask); //you gave here another method "unfinishedTask" so it can return back  
    save(); 
}

//proceed when you click on checkbox at unfinished part of todo
function unfinishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox tasks_btn";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

    unfinishedTasks.appendChild(listItem);//puts your finished task to "unfinished todo list"
    bindTaskEvents(listItem, finishTask)
    save(); //saves data to ls
}


//this one connects all methods to elements that will be created created 
function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;

}


//Local storage
//save function saves li on the page when you refresh 
//you put everything you need into arrays
function save() {

    var unfinishedTasksArr = [];
    for (var i = 0; i < unfinishedTasks.children.length; i++) {
        unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);//refering to li using children
    }

    var finishedTasksArr = [];
    for (var i = 0; i < finishedTasks.children.length; i++) {
        finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    //you send your array to local storage
    localStorage.removeItem('todo'); 
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));

}

//load from Local Storage
function load(){
    return JSON.parse(localStorage.getItem('todo'));// make json to obj
}

var data=load();

for(var i=0; i<data.unfinishedTasks.length;i++){
    var listItem=createNewElement(data.unfinishedTasks[i], false);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for(var i=0; i<data.finishedTasks.length; i++){
    var listItem=createNewElement(data.finishedTasks[i], true);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
}




