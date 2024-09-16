function closePasswordPrompt() {
  document.getElementById('passwordModal').style.display = 'none';
}

function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value;
  const correctPassword = '1password2enter';

  if (enteredPassword === correctPassword) {
      window.location.href = 'activity-of-the-course.html';
  } else {
      alert('Incorrect password. Please try again.');
  }
}
