var Actions = [];
var highestID = 0;

function start()
{
    document.getElementById('fileInput').addEventListener('change', (event) =>
    {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function()
        {
            Actions = JSON.parse(reader.result.toString());
            for(var i = 0; i < Actions.length; i++)
            {
                addTab(Actions[i],Actions[i].done);
            }
            document.getElementById('fileInput').style.display = "none";
        };

        reader.onerror = function ()
        {
            console.error('Error reading the file');
        };

        reader.readAsText(file, 'utf-8');
    });
}
start();

function UniqueId()
{
    highestID++;
    return highestID;
}

class action{
    constructor(activityName,done){
        this.activity = activityName;
        this.done = done;
        this.id = UniqueId();
    }
}

function AddAction()
{
    var actionName = document.getElementById("inputText").value;
    if(actionName == null ||actionName == "")
    {
        return;
    }
    console.log("actionName is " + actionName);
    document.getElementById("inputText").value = "";
    var newAction = new action(actionName, false);
    Actions.push(newAction);
    addTab(newAction,false);
}

function addTab(newAction,done)
{
    var div = document.createElement("div");
    div.id = newAction.id;
    div.className = "activity";

    var a = document.createElement("input");
    a.type = "checkbox";
    a.id = newAction.id + "-checkbox";
    a.addEventListener("change", function() {
        ChangeDone(newAction.id);
    });
    a.checked = done;

    var b = document.createElement("input");
    b.disabled = "true";
    b.type = "text";
    b.value = newAction.activity;

    var c = document.createElement("button");
    c.type = "button";
    c.innerHTML = "Edit";
    c.id = "Edit-" + newAction.id;
    var listener = Edit2(listener,c,b,newAction.id);

    var d = document.createElement("button");
    d.type = "button";
    d.addEventListener("click", function() {
        RemoveAction(newAction.id);
      }); 
    d.innerHTML = "Remove";
    
    div.appendChild(a);
    div.appendChild(b);
    div.appendChild(c);
    div.appendChild(d);

    document.getElementById("main").appendChild(div);
}

function Edit1(listener, element1, element2, id){
    element2.disabled = false;
    element1.removeEventListener("click", listener);
    element1.addEventListener("click", function() {
        Edit2(listener, element1, element2, id);
    });
}

function Edit2(listener, element1, element2, id)
{
    EditAction(id,element2)
    element2.disabled = true;
    element1.removeEventListener("click", listener);
    element1.addEventListener("click", function() {
        Edit1(listener, element1, element2, id);
    });
}

function RemoveAction(id)
{
    var index = -1;
    for(var i = 0; i < Actions.length; i++)
    {
        if(Actions[i].id == id)
        {
            index = i;
            break;
        }
    }
    Actions = Actions.splice(index,index + 1);
    document.getElementById(id).remove();
}

function EditAction(id,element)
{
    var index = -1;
    for(var i = 0; i < Actions.length; i++)
    {
        if(Actions[i].id == id){
            index = i;
            break;
        }
    }
    if(index == -1)
    {
        console.log("Fucks here");
        return;
    }
    if(element.value == "")
    {
        console.log("or here");
        element.value = Actions[index].activity;
        return;
    }
    Actions[index].activity = element.value;
}

function printData()
{
    for(var i = 0; i < Actions.length; i++)
    {
        console.log(Actions[i].activity, Actions[i].done, Actions[i].id);
    }
}

function ChangeDone(id)
{
    index = -1;
    for(var i = 0; i < Actions.length; i++)
    {
        if(Actions[i].id == id)
        {
            index = i;
            break;
        }
    }
    if(index == -1)
    {
        console.log("ID " + id + " NOT FOUND AT CHANGEDONE(id)");
    }
    Actions[index].done = !Actions[index].done;
}

function showNone()
{
    for(var i = 0; i < Actions.length; i++)
    {
        if(document.getElementById(Actions[i].id) != null)
        {
            document.getElementById(Actions[i].id).remove();
        }
    }
}

function showAll()
{
    showNone();
    for(var i = 0; i < Actions.length; i++)
    {
        addTab(Actions[i],Actions[i].done);
    }
}

function showDone()
{
    showNone();
    for(var i = 0; i < Actions.length; i++)
    {
        if(Actions[i].done)
        {
            addTab(Actions[i],true);
        }
    }
}

function showUndone()
{
    showNone();
    for(let i = 0; i < Actions.length; i++)
    {
        if(!Actions[i].done)
        {
            addTab(Actions[i],false);
        }
    }
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function () {
        var json = JSON.stringify(Actions),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "todo.json";
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());