// Function to show/hide user password
let eyeicon = document.getElementById('show-psw-icon');
let password = document.getElementById('userPassword');

eyeicon.onclick = function(){
    if(password.type == "password"){
        password.type = "text";
        eyeicon.src = "img/eye-open.png";
        eyeicon.style.filter = "invert(1)";
    } else {
        password.type = "password";
        eyeicon.src = "img/eye-close.png";
        eyeicon.style.filter = "none";
    }
}

import { auth, database, createUserWithEmailAndPassword, ref, set, remove } from './database-connection.js';

// Registration function
function register(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Getting all input fields
  const userName = document.getElementById('userName').value;
  const userLastName = document.getElementById('userLastName').value;
  const userEmail = document.getElementById('userEmail').value;
  const userPassword = document.getElementById('userPassword').value;
  
  // Validating
  if (!validate_email(userEmail) || !validate_password(userPassword)) {
    alert("Please enter a valid email or password");
    return;
  }
  if (!validate_fields(userName) || !validate_fields(userLastName)) {
    alert("User data cannot be empty");
    return;
  }

  // Continue registration process
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      const user = userCredential.user;

      // Create User Data
      const user_data = {
        email: userEmail,
        name: userName,
        lastName: userLastName,
        lastLogin: Date.now()
      };

      // Adding user to database
      set(ref(database, 'new-users/' + user.uid), user_data);

      alert("User created!");
    })
    .catch((error) => {
      // Notifying user about errors
      const error_message = error.message;
      alert(error_message);
    });
}

// Validating input fields
function validate_email(userEmail) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(userEmail);
}

function validate_password(userPassword) {
  // Firebase only accepts passwords longer than 6 characters
  return userPassword.length >= 6;
}

function validate_fields(field) {
  return field.trim() !== '';
}

// Attach event listener to form submission
document.getElementById('registrationForm').addEventListener('submit', register);

