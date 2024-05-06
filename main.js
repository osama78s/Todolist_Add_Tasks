let submit = document.querySelector(".form input[type='submit']");
let input = document.querySelector(".form input[type='text']");
let mood = 'create';
let timp;
// save the tasks in localstorage 
let getLocal = localStorage.getItem("storage");
if (getLocal){
    const parsedData = JSON.parse(getLocal);
    todoArray = Array.isArray(parsedData) ? parsedData : [];
} else{
    todoArray = [];
}
window.onload = () =>{
    focus();
    // if (!document.querySelector(".adds")){
    //     document.querySelector(".return").style.display = 'none';
    // }
}
// change the background color of submit is the value of input is find
input.addEventListener("keyup", () =>{
    if (input.value){
        submit.style.backgroundColor = '#41B06E';
    } 
    if (todoArray.some(el => el.todo && el.todo.trim().toUpperCase() === input.value.trim().toUpperCase())){
        submit.style.backgroundColor = 'red';
        input.classList.add('focus');
    } else{
        if (input.value){
            submit.style.backgroundColor = '#41B06E';
            input.classList.remove('focus');
        } else{
            submit.style.backgroundColor = '#1679AB';
            input.classList.remove('focus');
        }
    }
})
// adds the value of inputs 
function adds(){
    if (mood === 'create'){
        // document.querySelector(".return").style.display = 'none';
        submit.style.backgroundColor = '#1679AB';
        if (input.value != ''){
            let inputValue = input.value.trim().toUpperCase();
            // if the input value is not empty but the value === the value of todo 
            if (todoArray.some(todo => todo.todo && todo.todo.trim().toUpperCase() === inputValue)) {
                document.querySelector(".alert").classList.add("hide");
                document.querySelector(".form").style.display = 'none';
                document.querySelector(".list").style.display = 'none';
                document.querySelector('.info').style.display = 'none';
                document.querySelector(".ok").onclick = () =>{
                    document.querySelector(".alert").classList.remove("hide");
                    setTimeout(() => {
                        document.querySelector(".form").style.display = 'block';
                        document.querySelector(".list").style.display = 'block';
                        if (document.querySelector(".adds")){
                            document.querySelector('.info').style.display = 'block';
                        } else{
                            return false;
                        }    
                        focus();
                    },300);
                    input.classList.remove('focus');
                    input.value = '';       
                }
                // if the input value is not empty but the value !== the value of todo
            } else{
                focus();
                // the random id
                let id = Math.random() * 10000;
                // the new object
                let todo = new todolist(id, input.value);
                // add object to array
                todoArray.push(todo)
                UI.displayTodo();
                UI.removeTodo();
                input.value = '';    
                localStorage.setItem("storage", JSON.stringify(todoArray));
                document.querySelector('.info').style.display = 'block';
            }
            // if the input value is empty
        } else {
            message()
            display();
        }

    } else if (mood === 'update') {
        document.querySelector(".return").style.display = 'none';
        const inputValue = input.value.trim();
        if (todoArray.some(el => el.todo && el.todo.trim() === inputValue)){
            message();
            input.value = "";
            if (document.querySelector('.display')){
                submit.classList.add('opacity');
                document.querySelector('.return').style.display = 'none';
            } else{
                submit.classList.remove('opacity');
                document.querySelector('.return').style.display = 'block';
            }
            document.querySelector('.error').innerHTML = 'The Task Already Exists';
            document.querySelector('.ok').addEventListener('click', () =>{
                submit.classList.remove('opacity');
                document.querySelector('.return').style.display = 'block';
            })
        } else{
            // Update the todo item at the timp index with the new input value
            todoArray[timp].todo = inputValue;
            // Update UI
            UI.displayTodo();
            // Reset mood back to 'create'
            mood = 'create';
            // Clear input field
            input.value = '';
            // Change the submit value
            submit.value = 'Create';
            // Update localStorage
            localStorage.setItem("storage", JSON.stringify(todoArray));
        }
    }
}
function message(){
    let error = document.createElement('span');
    let ok = document.createElement('span');
    ok.className = "ok";
    error.className = 'error';
    ok.appendChild(document.createTextNode(`ok`));
    error.appendChild(document.createTextNode(`Please Write Your Task`));

    document.querySelector(".message").innerHTML = ''; 
    document.querySelector(".message").appendChild(error);
    document.querySelector(".message").appendChild(ok);

    document.querySelector(".list").style.display = 'none';
    document.querySelector(".message").classList.add("display");

    ok.addEventListener('click', () => {
        document.querySelector(".list").style.display = 'block';
        document.querySelector(".message").classList.remove("display");
        document.querySelector(".message").innerHTML = ''; 
        focus();
        display();
        input.style.display = 'block';
    });
}
// when click on the submit add function adds
submit.addEventListener('click', () =>{
    adds();
});
// Add event listener for keydown event on input
input.addEventListener('keydown', (e) => {
    // Rest of the keydown event handling logic
    if (document.querySelector('.display')) {
        e.preventDefault(); 
        submit.classList.add("margin_left");
        media();
        document.querySelector(".error").innerHTML = 'Click On Ok To Add Your Task'
    } else if (e.key === 'Enter') {
        adds(); 
    } 
});
// make object instance
class todolist{
    constructor(id, todo){
        this.id = id;
        this.todo = todo;
    }
}
// display the todo in the dom 
class UI{
    static displayTodo(){
    let adds = '';
    let haveID;
    let allSpans = '';
    for(let i = 0; i < todoArray.length; i++){
        adds += `
                <div class="adds">
                    <span class="todo">${todoArray[i].todo}</span>
                    <div class="collect">
                        <i onclick="UI.update(${i})" class="fa-solid fa-pen-to-square update"></i>
                        <i onclick="UI.reduceNumber()" class="fa-solid fa-trash delete" data-id="${todoArray[i].id}"></i>
                    </div>
                </div>
        ` 
        haveID = i;
    }
    allSpans = `
        <span class="count">you have (${haveID + 1}) task</span>
        <span onclick="clearAlll()" class="clear">Clear All</span>
    `
    document.querySelector(".list").innerHTML = adds;
    document.querySelector(".spans").innerHTML = allSpans;
    }
    // update the value when click on the icon
    static update(index){
        focus();
        input.value = todoArray[index].todo;
        timp = index;
        mood = 'update';
        document.querySelector('.return').style.display = 'block';
        // change the text of submit
        submit.value = 'Update';
        // return the background color to the submit input 
        submit.addEventListener('click', (e) =>{
            if (input.value !== null){
                e.target.style.backgroundColor = '#41B06E';
            }
        })
        function checkInput() {
            let inputValue = input.value;
            let isMatching = todoArray.some((el) => el.todo === inputValue);
            if (isMatching) {
                submit.classList.add('event');
            } else {
                submit.classList.remove('event');
            }
        }
        checkInput();
        function removeFocus(e){
            e.preventDefault();
        }
        input.addEventListener('keyup', checkInput);
        input.addEventListener('paste', removeFocus);
    }
    // return the value when click on the return icon
    static return(){
        if (mood === 'update'){
            mood = 'create';
            submit.value = 'Create';
            input.value = '';
            submit.classList.remove('event');
            document.querySelector('.return').style.display = 'none';
        }
    }
    // when click on the delete remove the todo element or the parent
    static removeTodo() {
        document.querySelector(".list").addEventListener('click', function(e){
            if (e.target.classList.contains("delete")){
                let parentElement = e.target.parentElement;
                // Navigate up again to the grandparent element
                let grandparentElement = parentElement.parentElement;
                // Remove the grandparent element
                grandparentElement.remove();
                removeAndAddInfo();
                focus();
            }
            let btnId = e.target.dataset.id;
            UI.removeToArray(btnId);
        })
    }
    // remove element from the array
    static removeToArray(id){
         todoArray = todoArray.filter((task) => task.id !== +id);
         localStorage.storage = JSON.stringify(todoArray);
         if (todoArray.length === 0){
            UI.return();
         }
    }
    // reduce the number of the span have numbers when click on the delete
    static reduceNumber(){
       let allSpans = '';
        for (let i = 1; i <= todoArray.length; i++){
            allSpans = `
            <span class="count">you have (${todoArray.length - 1}) tasks</span>
            <span onclick="clearAlll()" class="clear">Clear All</span>
        `
        }
        document.querySelector(".spans").innerHTML = allSpans;
    }
}
// remove all elements
function clearAlll(){
    document.querySelector('.sure').classList.add('push');
    document.querySelector('.info').style.display = 'none';
    document.querySelectorAll(".btn span").forEach((span) =>{
        span.addEventListener('click', (e) =>{
            if (e.target.classList.contains('yes')){
                todoArray = [];
                localStorage.removeItem('storage');
                UI.displayTodo();
                document.querySelector('.sure').classList.remove('push');
                focus();
                document.querySelector('.return').style.display = 'none';
            } else{
                focus();
                document.querySelector(".sure").classList.remove('push');
                setTimeout(() =>{
                    if (document.querySelector(".adds")){
                        document.querySelector('.info').style.display = 'block';
                    } else{
                        return false;
                    }
                } ,400)
            }
        })
    })
}
// show the elements when reload
window.addEventListener('DOMContentLoaded', () =>{
    UI.displayTodo();
    UI.removeTodo();
    removeAndAddInfo();
})
// remove and add class info that have count and clear span
function removeAndAddInfo(){
    if (document.querySelector(".adds")){
        return false;
    } else{
        document.querySelector('.info').style.display = 'none';
    }
}
// add event class when click on the submit button
function display(){
    if (document.querySelector('.display')){
        submit.classList.add('event');
        document.querySelector(".clear").classList.add('event');
    } else{
        submit.classList.remove("event");
        document.querySelector(".clear").classList.remove('event');
    }
}
// media queries
function media(){
    if (matchMedia("(max-width: 500px)").matches) {
        input.style.display = 'none';
    }
}
// add event focus to the elements 
function focus(){
    if (matchMedia("(min-width: 500px)").matches) {
        input.focus();
    }    
}

















// save localstorage 
// class storage{
//     static addToLocal(todoArray){
//         let storage = localStorage.setItem("todo", JSON.stringify(todoArray));
//         return storage;
//     }
//     static getToLocal(){
//         let storage = localStorage.getItem("todo") === null ? 
//         [] : JSON.parse(localStorage.getItem("todo"));
//         return storage;
//     }
// }


// empty array
// let todoArray = storage.getToLocal();


    // let todo = todoArray.map((task) => {
    //     return `
    //         <div class="adds">
    //             <span>${task.todo}</span>
    //             <i class="fa-solid fa-trash delete"></i>
    //         </div>
    //     `
    // })
    // document.querySelector(".list").innerHTML = todo;



            // document.querySelectorAll(".delete").forEach((Element) => {
        //     Element.addEventListener('click', (e) =>{
        //         e.target.parentElement.remove();
        //         let btnId = e.target.dataset.id;
        //         UI.removeToArray(btnId);
        //     })
        // })