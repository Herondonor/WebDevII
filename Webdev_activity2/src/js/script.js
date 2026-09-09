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
    var url = "https://todo-list.dcism.org/signin_action.php";
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
        url: "https://todo-list.dcism.org/getItems_action.php",
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
                        var task = tasks[key];
                        var newRow = taskTableBody.insertRow();
                        var cell1 = newRow.insertCell(0);
                        var cell2 = newRow.insertCell(1);
                        var cell3 = newRow.insertCell(2);
                        var cell4 = newRow.insertCell(3);

                        cell1.innerHTML = task["item_name"];
                        cell2.innerHTML = task["item_description"];
                        cell3.innerHTML = task["status"];
                        cell4.innerHTML = `
                            <div class="action-buttons">
                                <button id="edit-status-btn" class="editBtn">Edit</button>
                                <button id="delete-btn" class="deleteBtn">Delete</button>
                            </div>
                        `;
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
    console.log("annyeonghaseyo");
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
            console.log("wonyoung");
            alert(response["message"]);
            if(response["status"] == 200) {
                $('#addTaskForm')[0].reset();
                getTasks();
                document.getElementById("AddTask").style.display = "none";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() { getTasks(); });

document.getElementById("addNewTaskBtn").addEventListener("click", function() {
    document.getElementById("AddTask").style.display = "block";
});

document.getElementById("cancelBtn").addEventListener("click", function() {
    document.getElementById("AddTask").style.display = "none";
});