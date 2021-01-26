/*This is all the javascript used in the project. */

const formVariable = document.querySelector( "#task-form" ); //for the form button
const taskListVariable = document.querySelector( ".collection" ); //for the tasks in the list(the ul)
const clearButtonVariable = document.querySelector( ".clear-tasks" ); //for the clear tasks button
const filterVariable = document.querySelector( "#filter" ); //for the filter tasks button
const taskInputVariable = document.querySelector( "#task" ); //to get the text when the user types in a task

//create global function to run all event listners at one time
runAllEventListners();

/*-------------------------------------------------------------------------------------------
    //All functions defined in the global function runAllEventListners() defined below
-------------------------------------------------------------------------------------------*/

//define the global function
function runAllEventListners() {

  //load stuff from the dom local storage if there is stuff to be loaded
    document.addEventListener( "DOMContentLoaded", getTasksFromDomStorage );

  //add a task
    formVariable.addEventListener( "submit", addTask );

  //remove a task
    taskListVariable.addEventListener( "click", removeTask );

  //clear all tasks
    clearButtonVariable.addEventListener( "click", clearAllTasks );

  //filter all tasks
    filterVariable.addEventListener( "keyup", filterTasks );
}

/*-------------------------------------------------------------------------------------------
    //All helper functions defined in the global function runAllEventListners() defined below
-------------------------------------------------------------------------------------------*/

function getTasksFromDomStorage() {

  //variable to hold local storage array
    let localStorageArray;

    if( localStorage.getItem( "localStorageArray" ) === null ) //if nothing there, set it to an empty array
        localStorageArray = [];

      //if something is there, pull it out and add it to the array. Have to use JSON.parse because it is stored as a string in LS
    else
        localStorageArray = JSON.parse( localStorage.getItem( "localStorageArray" ) );

    localStorageArray.forEach(function( taskCounterLoopVariable ) {

    //dynamically create a list item to show up
      const listItemVariable = document.createElement( "li" );

    //give it a class/id
      listItemVariable.className = "collection-item"; /*NOTE: list must be called collection and items in list called
                                                        collection -item for materialize to style it*/

    //now create a text node element with text from the user adding a task.
      const textNodeVariable = document.createTextNode(taskCounterLoopVariable);

    //append/add the text node to the list
      listItemVariable.appendChild( textNodeVariable );

    //create new link in text node to delete a task
      const deleteLinkVariable = document.createElement( "a" );

    //give it a class
      deleteLinkVariable.className = "delete-item secondary-content"; /* NOTE: secondary content allows link to go to the right 
                                                                        of an element when using matrerialize*/
    //add the html icon
      deleteLinkVariable.innerHTML = '<i class="fa fa-remove"></i>';

    //append/add the link to the list item
      listItemVariable.appendChild( deleteLinkVariable );

    //now append the list item to the actual list on the form.(Add the li to the ul)
      taskListVariable.appendChild( listItemVariable );
  });
}

//addTask function defined here, used in runAllEventListners global function
function addTask(e) {

  //check if user entered anything. If nothing entered, alert them to enter a task before pressing submit
  if( taskInputVariable.value === "" )
    alert( "Please add a task before submitting" );

  else 
  {
    //now if not empty, take the text and dynamically create a list item to show up
      const listItemVariable = document.createElement( "li" );

    //give it a class/id
      listItemVariable.className = "collection-item"; /*NOTE: list must be called collection and items in list called
                                                    collection -item for materialize to style it*/

    //now create a text node element with text from the user adding a task.
      const textNodeVariable = document.createTextNode( taskInputVariable.value );

    //append/add the text node to the list
      listItemVariable.appendChild( textNodeVariable );

    //create new link in text node to delete a task
      const deleteLinkVariable = document.createElement( "a" );

    //give it a class
      deleteLinkVariable.className = "delete-item secondary-content"; /* NOTE: secondary content allows link to go to the right of an element when using matrerialize*/

    //add the html icon
      deleteLinkVariable.innerHTML = '<i class="fa fa-remove"></i>';

    //append/add the link to the list item
      listItemVariable.appendChild( deleteLinkVariable );

    //now append the list item to the actual list on the form.(Add the li to the ul)
      taskListVariable.appendChild( listItemVariable );

    //add to local storage
      addTaskToLocalStorage( taskInputVariable.value );

    //clear the input from user so they can re-write a task
      taskInputVariable.value = "";

    e.preventDefault();
  }
}

//addToLocalStorage function defined here, used in addTask global function
function addTaskToLocalStorage( taskValueToBeAdded ) {

  let localStorageArray;

  //if nothing there, set it to an empty array
    if( localStorage.getItem( "localStorageArray") === null )
      localStorageArray = [];

  //if something is there, pull it out and add it to the array. Have to use JSON.parse because it is stored as a string in LS
      else
        localStorageArray = JSON.parse( localStorage.getItem( "localStorageArray" ) );

  //no that the other previous task has been added, add the current task to the array
    localStorageArray.push( taskValueToBeAdded );

  //push the array back onto local storage
    localStorage.setItem( "localStorageArray" , JSON.stringify( localStorageArray ) );
}

//removeTask function defined here, used in runnAllEventListners global function
function removeTask(e) {

  //check to see if the class delete-item is  there
    if( e.target.parentElement.classList.contains( "delete-item" ) ) 
    {
      //NOTE: the order is li, then anchor tag, then icon. so parent element is anchortag therefore parentElement.Parentelement is the li.
      if( confirm( "Are you sure" ) ) 
      {
        //this removes from the ui
          e.target.parentElement.parentElement.remove();

        //remove from local storage
          RemoveTaskFromLocalStorage(e.target.parentElement.parentElement);

          filterVariable.value = " ";

          document.querySelectorAll( ".collection-item" ).forEach(function ( task ) {

            task.style.display = "block"; //else if not found, do nothing
          });
      }
    }
}

//removeTaskFromLocalStorage function defined here, used in remove Task global function
function RemoveTaskFromLocalStorage( taskToBeDeleted ) {

  let taskToBeDeletedFromLocalStorageArray;

  //if nothing there, set it to an empty array
    if( localStorage.getItem( "localStorageArray" ) === null ) 
      taskToBeDeletedFromLocalStorageArray = [];

  //if something is there, pull it out and add it to the array. Have to use JSON.parse because it is stored as a string in LS
    else
      taskToBeDeletedFromLocalStorageArray = JSON.parse(localStorage.getItem( "localStorageArray" ));

  //loop through array to delete the required task. callback function takes in a counter and index
    taskToBeDeletedFromLocalStorageArray.forEach(function ( taskCounterLoopVariable,index )
    { 
      //if you find what you want to delete
        if( taskToBeDeleted.textContent === taskCounterLoopVariable ) 
        {
          //splice it out from the array. Find what you want to remove and remove 1 element from that index and replace it with nothing
            taskToBeDeletedFromLocalStorageArray.splice( index, 1 );

          /*NOTE: splice(a, b, c). a is index where to start, b is how many to remove, 
          c is what to replace it with.*/
        }
    });

  //put the array - after the element has been deleted - back into local storage
    localStorage.setItem( "localStorageArray", JSON.stringify( taskToBeDeletedFromLocalStorageArray ));
}

//clearAllTasks function removes all tasks
function clearAllTasks() {

  if( taskListVariable.contains (taskListVariable.firstChild) ) 
  {
    //while it has a first child (beginniong node)
        while ( taskListVariable.firstChild ) 
        {
          taskListVariable.removeChild ( taskListVariable.firstChild );
            //or you could just say taskListVariable = ' ';
        }
   
    //clear any remaining text from the filter box
      filterVariable.value = " ";

    //this clears all things in local storage. So when you click 'clear tasks', the tasks won't appear again on reload
      localStorage.clear();
  } 
  
  else 
  {
    alert( "There are no tasks to be cleared" );

  //clear any remaining text from the filter box
    filterVariable.value = " ";
  }
   
}

//filterTask function defined here
function filterTasks(e) {

  //get value of text and convert to upper case                                            
    const text = e.target.value.toUpperCase();

  //run through all the divs
    document.querySelectorAll( ".collection-item" ).forEach(function ( task ) {

    const item = task.firstChild.textContent;

  //if the text fro the current item matches the text of the index of the target value searched for
    if ( item.toUpperCase().indexOf( text ) != -1 ) 
      task.style.display = "block";  //else if not found, do nothing
    else 
      task.style.display = "none"; //block that div
     

  });
}
