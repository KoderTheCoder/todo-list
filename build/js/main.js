class Task{
  constructor(task, quantity){
    this.name = task;
    this.quantity = quantity;
    this.id = new Date().getTime();
    this.status = 0;
    return this;
  }
}

//form module
var formmodule = (
  function () {
    var formobj = {};
    const formelm = document.getElementById('task-form');
    const inputelm = document.getElementById('task-input');

    formobj.getValue = function() {
      inputval = inputelm.value;
      formobj.val = inputval;
      return inputval;
    }
    return formobj;
  }()
);


//form module
var formmodule2 = (
  function () {
    var formobj = {};
    const formelm = document.getElementById('task-form');
    const inputelm = document.getElementById('task-quantity');

    formobj.getValue = function() {
      inputval = inputelm.value;
      formobj.val = inputval;
      return inputval;
    }
    return formobj;
  }()
);


var task = ( function(){
  var object = {};
  object.taskArray = [];
  
  object.add = function(taskname){
    let taskitem = new Task(taskname);
    object.taskArray.push(taskitem);
    object.sort();
  }
  
  object.changeStatus = function(id,status){
    let taskcount = object.taskArray.length;
    for(let i=0; i<taskcount; i++){
      let item = object.taskArray[i];
      if( item.id == id ){
        item.status = status;
        break;
        return true;
      }
    }
    object.sort();
  }
  object.delete = function(id){
    let taskcount = object.taskArray.length;
    for(let i=0; i<taskcount; i++){
      let item = object.taskArray[i];
      if( item.id == id ){
        object.taskArray.splice(i,1);
        break;
        return true;
      }
    }
  }
  object.sort = function(){
    if(settings.sort = "status"){
      //sort array according to its status
      object.taskArray.sort(function(task1,task2){
        return parseInt(task1.status) - parseInt(task2.status);
      });
    }
    else if(settings.sort = "date"){
      object.taskArray.sort(function(task1,task2){
        return parseInt(task1.id) - parseInt(task2.id);
      });
    }
  }
  return object;
}
());
var storage = ( function(){
  var stg = {};
  stg.store = function(arr){
    let data = JSON.stringify(arr);
    stg.data = data;
    window.localStorage.setItem("data",data);
  }
  stg.read = function(){
    if(window.localStorage.getItem("data")){
      try{
        if(JSON.parse(localStorage.getItem("data"))){
          let data = JSON.parse(localStorage.getItem("data"));
        }
      }
      catch(error){
        console.log("error"+error);
      }
      let data = window.localStorage.getItem("data");
      return JSON.parse(data);
    }
    else{
      return false;
    }
  }
  return stg;
}());
var template = ( function(){
  var templateobject = {};
  //wait for window to load before selecting the template
  window.addEventListener('load',() => { 
    const tmpl = document.querySelector('#task-template');
    templateobject.template = tmpl;
  });
  
  templateobject.create = function(taskobj){
    //import the content of the template
    let template = document.importNode(templateobject.template.content,true);
    let temphtml = template.querySelector('li');
    //fill the template with data from taskobj
    temphtml.setAttribute('data-id',taskobj.id);
    temphtml.setAttribute('data-status',taskobj.status);
    temphtml.setAttribute('data-name',taskobj.name);
    temphtml.setAttribute('data-quantity',taskobj.quantity);
    
    temphtml.querySelector('.task-text').innerText = taskobj.name + ": " + taskobj.quantity;
    //temphtml.querySelector('.task-text').setAttribute('data-id',taskobj.id);
    //temphtml.querySelector('.task-row').setAttribute('data-id',taskobj.id);
    temphtml.querySelector('button[data-function="delete"]').setAttribute('data-id',taskobj.id);
    temphtml.querySelector('button[data-function="status"]').setAttribute('data-id',taskobj.id);
    
    return temphtml;
  }
  
  return templateobject;
} ());
var uimodule = ( function(){
  var module = {};
  const listelem = document.getElementById('task-list');
  module.render = function(){
    let tasks = task.taskArray;
    listelem.innerHTML = "";
    for(let i=0; i<tasks.length; i++){
      let item = tasks[i];
      //create a template
      let listitem = template.create(item);
      
      listelem.appendChild(listitem);
    }
  }
  module.bindListener = function() {
    listelem.addEventListener('click', (event) => {
      //get the id of the task
      //itemid = event.target.getAttribute('data-id');
      if(event.target.getAttribute('data-function') == 'status'){
        itemid = event.target.getAttribute('data-id');
        task.changeStatus(itemid,1);
      }
      if(event.target.getAttribute('data-function') == 'delete'){
        itemid = event.target.getAttribute('data-id');
        task.delete(itemid);
      }
      module.render();
      storage.store(task.taskArray);
    });
  }  
  return module;
} () );

var settings = (function(){
  var module = {};
  window.addEventListener('load',() => {
    module.menu = document.querySelector('.settings-panel');
    module.btn = document.querySelector('.settings-button');
    module.form = document.querySelector('#settings');
    module.init();
  });
  module.init = function(){
    module.btn.addEventListener('click',() => {
      //toggle menu
      module.toggleMenu();
    });
    module.form.addEventListener('change',() =>{
      module.getSort();
      task.sort();
      uimodule.render();
    });
    module.getSort();
  }
  module.toggleMenu = function(){
    if( module.menu.classList.contains('open') ){
      // menu is open, remove the open class -- close the menu
      module.menu.classList.remove('open');
      module.btn.classList.remove('open');
    }
    else{
      //menu is closed, open it by adding class open
      module.menu.classList.add('open');
      module.btn.classList.add('open');
    }
  }
  module.getSort = function (){
    module.sort = document.querySelector("[name='sort']:checked").value;
  }
  return module;
}());
var app = (function(){
  const form = document.getElementById('task-form');
  form.addEventListener('submit',(event) => {
    event.preventDefault();
    let newtask = formmodule.getValue();
    let newquant = formmodule2.getValue();
    if(newtask && newquant){
      task.add(newtask, newquant);
      storage.store(task.taskArray);
      uimodule.render();
    }
    form.reset();
  });
  uimodule.bindListener();
  window.addEventListener('load',() => {
    //check if read returns valid data eg if storage is not empty
    if(storage.read()){
      task.taskArray = storage.read() ;
    }
    uimodule.render();
  });
}());