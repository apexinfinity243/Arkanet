// home.js - navigation vers login ou signup
document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "login.html"; // page connexion
});

document.getElementById("signupBtn").addEventListener("click", () => {
  window.location.href = "regist.html"; // page inscription
});