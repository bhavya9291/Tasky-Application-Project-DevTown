// // console.log("connected ...");
// var state={
//     taskList:[
//         {
//             imageUrl: "",
//             taskTitle:"",
//             taskType:"",
//             taskDescription:""
//         },
//         {
//             imageUrl: "",
//             taskTitle:"",
//             taskType:"",
//             taskDescription:""
//         },
//         {
//             imageUrl: "",
//             taskTitle:"",
//             taskType:"",
//             taskDescription:""
//         },
//         {
//             imageUrl: "",
//             taskTitle:"",
//             taskType:"",
//             taskDescription:""
//         },
//         {
//             imageUrl: "",
//             taskTitle:"",
//             taskType:"",
//             taskDescription:""
//         },
//     ]
// }
// text muted for displaying text in light shade
const state={
    taskList:[],
};
// DOM Operations
const taskContents=document.querySelector(".task_contents");
const taskModal=document.querySelector(".task_modal_body"); 
// console.log(taskContents);
// console.log(taskModal);
const htmlTaskContent = ({id,title,description,type,url}) =>`
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task_card '>
            <div class='card-header d-flex justify-content-end task_card_header'>
                <button type="button" class='btn btn-outline-primary mr-1.5' name=${id} onclick="editTask.apply(this,arguments)">
                    <i class='fas fa-pencil-alt name='${id}'></i>
                </button>
                 <button type="button" class='btn btn-outline-danger mr-1.5' name=${id} onclick="deleteTask.apply(this,arguments)" >
                    <i class='fas fa-trash-alt name=${id}' ></i>
                </button>
            </div>
            <div class="card-body">
                ${
                    // url &&
                    // `<image width='100%' src=${url} alt='Card Image' class="card-img-top md-3 rounded-lg"/>`
                    url 
                    ?`<image width='100%' src=${url} alt='Card Image' class="card-img-top md-3 rounded-lg"/>`
                    :`<image width='100%' src="https://www.bing.com/th?id=OIP.F00dCf4bXxX0J-qEEf4qIQHaD6&w=150&h=79&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" alt='Card Image' class="card-img-top md-3 rounded-lg"/>`
                }
                <h4 class='card-title task_card_title'>${title}</h4>
                <p class='description trim-3-lines text-muted'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>
            <div class="card-footer">
                <button type='button' class='btn btn-outline-primary float-right'  data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this,arguments)" id=${id}> Open Task</button>
            </div>
        </div>
    </div>
`;
// ModalBody on >>click of open Task
const htmlModalContent = ({id,title,description,type,url}) => {
    const date=new Date(parseInt(id));
    return `
        <div id=${id}>
            ${
                //  url && `<image width="100%" src=${url} alt="Card Image" class="img-fluid place_holder_image mb-3"/>`
                url 
                    ?`<image width='100%' src=${url} alt='Card Image' class="card-img-top md-3 rounded-lg"/>`
                    :`<image width='100%' src="https://www.bing.com/th?id=OIP.F00dCf4bXxX0J-qEEf4qIQHaD6&w=150&h=79&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" alt='Card Image' class="card-img-top md-3 rounded-lg"/>`
            }
            <strong class='text-muted text-sm'>Created on : ${date.toDateString()}</strong>
            <h2 class='my-3'>${title}</h2>
            <p class='text-muted'> ${type}</p>
            <p class='text-muted'> ${description}</p>
            
        </div>
    `;
};


// we convert json to str (i,e local storage)
const updateLocalStorage =()=>{
    localStorage.setItem (
        // task is name and tasklist is key
        "task",             
        JSON.stringify({
            tasks:state.taskList,
        })
    );
};
// we convert str to json(i,e localstorage data  is converted to json and storage in taskList .. for rendering the cards on the screen)
const loadInitialData = ()=>{
    const localStorageCopy = JSON.parse(localStorage.task);
    if(localStorageCopy)state.taskList=localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardDate));
    });

}; 

// when we update or when we edit the card  .. we need to save
const handlesubmit = (event)=> {
    // console.log("event triggered");
    const id= `${Date.now()}`;
    // geting things from html to js (i,e for editing the card )
    const input={
        url:document.getElementById("imageUrl").value,
        title:document.getElementById("taskTitle").value,
        type:document.getElementById("tags").value,
        description:document.getElementById("taskDescription").value,

    };
    if(input.title===""||input.type===""){
        return alert("Please fill all the necessary fields");
    }

    taskContents.insertAdjacentHTML(
        "beforeend",htmlTaskContent({ ...input,id}) // getting things displayed on the screen
    );
    state.taskList.push({ ...input,id}); // pushing data into array taskList
    updateLocalStorage(); // storing data in local storage
}
//open Task
const openTask=(e)=>{
    // if(!e)e=window.event;
    const getTask=state.taskList.find(({id})=> id ===e.target.id);
    taskModal.innerHTML=htmlModalContent(getTask)
}
//delete task
const deleteTask=(e)=>{
    if(!e)e=window.event;
    const targetId =e.target.getAttribute("name");
    // console.log(targetId);
    // console.log(e.target);
    const type=e.target.tagName;
    // console.log(type);
    const removeTask=state.taskList.filter(({id})=>id!==targetId);
    console.log(removeTask)
    updateLocalStorage();
    if(type==="BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode.parentNode)
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        ) 
    }
    else if(type==="I"){
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode
        )
    }
};
//edit task
const editTask=(e)=>{
    if(!e)e=window.event;
    const targetId=e.target.id;
    const type=e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton; 
    if(type==="BUTTON"){
        parentNode=e.target.parentNode.parentNode;
    }
    else{
        parentNode=e.target.parentNode.parentNode.parentNode;
    }
    // taskTitle=parentNode.childNodes[3].childNodes[7].childNodes;
    // console.log(taskTitle);
    taskTitle=parentNode.childNodes[3].childNodes[3];
    taskDescription=parentNode.childNodes[3].childNodes[5];
    taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton=parentNode.childNodes[5].childNodes[1];
    console.log(taskTitle,taskDescription,taskType,submitButton);

    taskTitle.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    submitButton.setAttribute('onclick',"saveEdit.apply(this,arguments)");
    // data-bs-toggle="modal" data-bs-target="#showTask"

    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes";

};
const saveEdit=(e)=>{
    if(!e)e=window.event;
    const targetId=e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes)

    const taskTitle=parentNode.childNodes[3].childNodes[3];
    const taskDescription=parentNode.childNodes[3].childNodes[5];
    const taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton=parentNode.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) =>
        task.id===targetId
            ? {
                id:task.id,
                title:updateData.taskTitle,
                description:updateData.taskDescription,
                type:updateData.taskTitle,
                url:task.url,
            }
            :task
    );
    state.taskList=stateCopy;
    updateLocalStorage();

    
    taskTitle.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    submitButton.setAttribute('onclick',"openTask.apply(this,arguments)");

    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","#showTask");
    submitButton.innerHTML="Open Task";



};
const searchTask = (e) => {
    if (!e) e = window.event;

  while(taskContents.firstChild){
    taskContents.removeChild(taskContents.firstChild);
  }
  const resultData = state.taskList.filter(({title}) => 
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

//   console.log(resultData);
  resultData.map((cardData)=>
      taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardData))
    // taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardData))
  );  
};
