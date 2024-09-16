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


import { auth, database, signInWithEmailAndPassword, ref, set } from './database-connection.js';

// Login function
function login(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const userEmail = document.getElementById('userEmail').value;
  const userPassword = document.getElementById('userPassword').value;

  // Validating
  if (!validate_email(userEmail) || !validate_password(userPassword)) {
    alert("Please enter a valid email or password");
    return;
  }

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      const database_ref = ref(database, 'new-users/' + user.uid);

      // Create User Data
      const user_data = {
        lastLogin: Date.now()
      };

      // Log in
      set(database_ref, user_data);

      alert("User logged in!");

      // Redirect to my-activities.html
      window.location.href = 'my-activities.html';
    })
    .catch((error) => {
      // Notifying user about errors
      const error_code = error.code;
      const error_message = error.message;
      alert(error_message);
    });
}

// Attach event listener to form submission
document.getElementById('logInForm').addEventListener('submit', login);

// Validating input fields
function validate_email(userEmail) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(userEmail);
}

function validate_password(userPassword) {
  // Firebase only accepts passwords longer than 6 characters
  return userPassword.length >= 6;
}
