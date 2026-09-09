var updatingItemId = null;

document.addEventListener("DOMContentLoaded", function() { getTasks(); });

document.getElementById("addNewTaskBtn").addEventListener("click", function() {
    updatingItemId = null;

    document.getElementById("addTaskForm").reset();
    document.getElementById("AddTask").style.display = "block";
});

document.getElementById("cancelBtn").addEventListener("click", function() {
    document.getElementById("AddTask").style.display = "none";
});

function taskSubmit(e) {
    e.preventDefault();

    if (updatingItemId === null) {
        addTaskSubmit(e);
    } else {
        updateTaskSubmit(e);
    } 
}

function signupSubmit(e) {
    e.preventDefault();

    var data = $('#signup-form').serialize();
    var jsonData = Object.fromEntries(new URLSearchParams(data));
    $.ajax({
        type: 'POST',
        url: 'https://todo-list.dcism.org/signup_action.php',
        data: JSON.stringify(jsonData),
        dataType: 'json',
        success: function(response) {
            alert(response["message"]);
            if(response["status"] == 200) {
                $('#signup-form')[0].reset();
            }
        }
    });
}

function signinSubmit(e){
    e.preventDefault();
    var url = 'https://todo-list.dcism.org/signin_action.php';
    var data = $('#signin-form').serialize();
    var urlData = url+"?"+data;
    $.ajax({
        type: 'GET',
        url: urlData,
        data: null,
        success: function(response) {
            console.log(response);
            var res = JSON.parse(response);
            if(res["status"] == 200) {
                $('#signin-form')[0].reset();
                localStorage.setItem("user_id", res["data"]["id"]);
                window.location.replace('../public/home.html');
            }else{
                alert(res["message"]);
            }
        },
    });
}

function signoutClick(e) {
    e.preventDefault();
    window.location.replace('../public/index.html');
}


function getTasks() {
        $.ajax({
        type: 'GET',
        url: 'https://todo-list.dcism.org/getItems_action.php',
        data: {
            status: "active",
            user_id: localStorage.getItem("user_id")
        },
        success: function(response) {
            console.log(response);
            var res = JSON.parse(response);
            var taskTableBody = document.getElementById("taskTableBody");

            taskTableBody.innerHTML = "";
            if(res["status"] == 200) {
                var tasks = res["data"];
                for (var key in tasks) {
                    if (tasks.hasOwnProperty(key)) {
                        let task = tasks[key];
                        var newRow = taskTableBody.insertRow();
                        var cell1 = newRow.insertCell(0);
                        var cell2 = newRow.insertCell(1);
                        var cell3 = newRow.insertCell(2);
                        var cell4 = newRow.insertCell(3);

                        cell1.innerHTML = task["item_name"];
                        cell2.innerHTML = task["item_description"];
                        cell3.innerHTML = `
                            <div class="status-btn">
                                <span>${task["status"]}</span>  
                                <button class="toggle ${task["status"]}"></button>
                                
                            </div>
                        `;
                        cell4.innerHTML = `
                            <div class="action-buttons">
                                <button class="btn updateBtn">Edit</button>
                                <button class="btn deleteBtn">Delete</button>
                            </div>
                        `;

                        var updateBtn = cell4.querySelector(".updateBtn");
                        var deleteBtn = cell4.querySelector(".deleteBtn");
                        var toggleBtn = cell3.querySelector(".toggle");

                        updateBtn.addEventListener("click", function() {
                            updatingItemId = task["item_id"];

                            document.getElementById("item_name").value = task["item_name"];
                            document.getElementById("item_description").value = task["item_description"];

                            document.getElementById("AddTask").style.display = "block";
                        });

                        deleteBtn.addEventListener("click", function() {
                            deleteTask(task.item_id);
                        });

                        toggleBtn.addEventListener("click", function() {
                            var newStatus = task["status"] === "active" ? "inactive" : "active";

                            changeTaskStatus(task["item_id"], newStatus);
                        });
                        
                    }
                }
            }
        },

        error: function(xhr, status, error) {
            console.log("GET Error:", error);
            console.log("Response:", xhr.responseText);
        }

    });
}


function addTaskSubmit(e) {
    e.preventDefault();
    
    var data = $('#addTaskForm').serialize();
    var jsonData = Object.fromEntries(new URLSearchParams(data));
    jsonData.user_id = localStorage.getItem("user_id");
    $.ajax({
        type: 'POST',
        url: 'https://todo-list.dcism.org/addItem_action.php',
        data: JSON.stringify(jsonData),
        dataType: 'json',
        success: function(response) {
            alert(response["message"]);
            if(response["status"] == 200) {
                $('#addTaskForm')[0].reset();
                getTasks();
                document.getElementById("AddTask").style.display = "none";
            }
        }
    });
}


function updateTaskSubmit(e) {
    e.preventDefault();

    var data = $('#addTaskForm').serialize();
    var jsonData = Object.fromEntries(new URLSearchParams(data));

    jsonData.item_id = updatingItemId;

    console.log("Updating item:", updatingItemId);
    console.log("Sending:", jsonData);

    $.ajax({
        type: 'PUT',
        url: 'https://todo-list.dcism.org/editItem_action.php',
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        dataType: 'json',

        success: function(response) {
            console.log("Response:", response);
            alert(response["message"]);

            if (response["status"] == 200) {
                $('#addTaskForm')[0].reset();
                updatingItemId = null;

                getTasks();

                document.getElementById("AddTask").style.display = "none";
            }
        },

        error: function(xhr, status, error) {
            console.log("Status:", xhr.status);
            console.log("Error:", error);
            console.log("Response:", xhr.responseText);
        }
    });
}

function changeTaskStatus(itemId, status){
    $.ajax({
        type: 'PUT',
        url: 'https://todo-list.dcism.org//statusItem_action.php',
        data: JSON.stringify({
            status: status,
            item_id: itemId
        }),
        contentType: 'application/json',
        dataType: 'json',

        success: function(response){
            console.log(response);

            if(response["status"] == 200) {
                getTasks();
            } else {
                alert(response["message"]);
            }
        }
    });
}   

function deleteTask(itemId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

        $.ajax({
            type: 'DELETE',
            url: 'https://todo-list.dcism.org/deleteItem_action.php',
            data: {
                item_id: itemId
            },
            dataType: 'json',
            success: function(response){
                console.log("Delete response:", response);
                alert(response.message);
                if(response.status == 20){
                    getTasks();
                }
            },
            error: function(xhr, status, error) {
            console.log("Delete error:", error);
            console.log("Status:", xhr.status);
            console.log("Response:", xhr.responseText);
        }
    });
}
