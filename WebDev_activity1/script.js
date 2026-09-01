const AddContactbtn = document.getElementById("addContactBtn");
const Cancelbtn = document.getElementById("cancelBtn");
const ContactTableBody = document.getElementsByTagName("table")[0];
const AddContactForm = document.getElementById("AddContactForm");
const ContactForm = document.getElementById("contactForm");

// ADD CONTACT FORM
AddContactbtn.addEventListener("click", () => {AddContactForm.style.display = "block"});

Cancelbtn.addEventListener("click", () => {AddContactForm.style.display = "none"});

ContactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let newRow = ContactTableBody.insertRow();
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    let cell5 = newRow.insertCell(4);

    cell1.innerHTML = document.getElementById("lastName").value;
    cell2.innerHTML = document.getElementById("firstName").value;
    cell3.innerHTML = document.getElementById("email").value;
    cell4.innerHTML = document.getElementById("contactNumber").value;
    cell5.innerHTML = `
        <div class="action-buttons">
            <button id="edit-button" class="editBtn">Edit</button>
            <button id="delete-button" class="deleteBtn">Delete</button>
        </div>
    `;

    ContactForm.reset();
    AddContactForm.style.display = "none";
});

//EDIT AND DELETE BUTTONS
ContactTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteBtn")) {
        let row = event.target.closest("tr");
        row.remove();
    }   
    if (event.target.classList.contains("editBtn")) {
        let row = event.target.closest("tr");
        document.getElementById("lastName").value = row.cells[0].innerHTML;
        document.getElementById("firstName").value = row.cells[1].innerHTML;
        document.getElementById("email").value = row.cells[2].innerHTML;
        document.getElementById("contactNumber").value = row.cells[3].innerHTML;
    
    AddContactForm.style.display = "block";
    row.remove();
    }   

});