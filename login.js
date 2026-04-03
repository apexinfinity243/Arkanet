// Initialisation Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtSoHWjzLEri5Y9axIfVLyUVFki3Fwt7Y",
  authDomain: "inscription-otp.firebaseapp.com",
  projectId: "inscription-otp",
  storageBucket: "inscription-otp.firebasestorage.app",
  messagingSenderId: "393651016787",
  appId: "1:393651016787:web:7245c438d115853e8ee2a6"
};
firebase.initializeApp(firebaseConfig);

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Connexion réussie ✅");
      window.location.href = "dashboard.html"; // Page après login
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});