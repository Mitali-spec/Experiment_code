let add_task = document.getElementById("add_task");
let save_task = document.getElementById("save_task");
let task_list = document.getElementById("task_list");


//AFTER USER CLICKS ADD BUTTON
save_task.addEventListener("click", async function (e) {

    e.preventDefault(); // ✅ stop page reload (VERY IMPORTANT)

    let task = add_task.value.trim();

    if (task === "") {
        alert("ADD TASK");
        return;
    }

    try {
        let response = await fetch("/add_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ add_task: task })
        });

        if (!response.ok) {
            alert("TASK NOT ADDED");
            return;
        }

        // IN IT THE RESPONSE SERVER SENDS TO FRONTEND res.status(201).json(new_task); IS STORED
        let data = await response.json(); 

        createTaskElement(data); // ✅ reusable function

        add_task.value = "";

    } catch (err) {
        alert("SERVER ERROR");
    }
});


// ✅ FUNCTION TO CREATE TASK (IMPORTANT)
function createTaskElement(data) {

    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = data.add_task;

    li.appendChild(span);
    li.setAttribute("data-id", data._id);

    // ===== DELETE =====
    let del_btn = document.createElement("button");
    del_btn.innerText = "❌";

    del_btn.addEventListener("click", async function () {

        let id = li.getAttribute("data-id");

        console.log("Deleting ID:", id); // ✅ debug

        let response = await fetch(`/delete_task/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if (response.ok && result.success) {
            li.remove(); // ✅ remove from UI
        } else {
            alert("FAILED TO DELETE TASK");
        }
    });

    li.appendChild(del_btn);

    // ===== UPDATE =====
    let update_btn = document.createElement("button");
    update_btn.innerText = "✏️";

    update_btn.addEventListener("click", async function () {

        let id = li.getAttribute("data-id");

        let newValue = prompt("Update task:", span.innerText);

        if (!newValue || newValue.trim() === "") return;

        let response = await fetch(`/update_task/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ add_task: newValue })
        });

        let result = await response.json();

        if (response.ok && result.success) {
            span.innerText = newValue; // ✅ update UI
        } else {
            alert("FAILED TO UPDATE TASK");
        }
    });

    li.appendChild(update_btn);

    task_list.appendChild(li);

    //ADD A NEW BUTTON PERFORM TASK IN FROM OF TASK
    let do_task=document.createElement("button");
    do_task.innerText="☑️";
    do_task.addEventListener("click", function(){
        //CREATE OPTION BOX
        let option_box=document.createElement("div"); 

        //OPTION 1 : MANUAL CHECK
        let manualbtn=document.createElement("button");
        manualbtn.innerText="MANUAL CHECKMARK ✔️";

        //MANUAL CHECK FUNCTIONALITY
        manualbtn.addEventListener("click", async function(){


        });

        //OPTION 2 : UPLOAD PROOF
        let uploadproof=document.createElement("button");
        uploadproof.innerText="UPLOAD PROOF 📎"

        //OPTION 3: INTEGRATE API
        let api=document.createElement("button");
        api.innerText="INTEGRATE API 🔌";

        option_box.appendChild(manualbtn);
        option_box.appendChild(uploadproof);
        option_box.appendChild(api);

        li.appendChild(option_box);

    });


    li.appendChild(do_task);
}