// 🔹 Initialisation téléphone
const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  initialCountry: "cd",
  separateDialCode: true
});

// 🔹 Mot de passe (toggle + force)
const passInput = document.getElementById("pass1");
const toggle = document.getElementById("togglePass");

if (toggle) {
  toggle.addEventListener("click", () => {
    if (passInput.type === "password") {
      passInput.type = "text";
      toggle.textContent = "🙈";
    } else {
      passInput.type = "password";
      toggle.textContent = "👁️";
    }
  });
}

// 🔹 Indicateur + bordure mot de passe
passInput.addEventListener("input", function () {
  const value = this.value;
  const strengthText = document.getElementById("strengthText");

  // Bordure
  if (value.length < 6 || value.length > 8) {
    this.style.border = "2px solid red";
  } else {
    this.style.border = "2px solid green";
  }

  // Force
  let strength = "Faible";
  let color = "red";

  if (value.length >= 6) {
    strength = "Moyen";
    color = "orange";
  }

  if (value.match(/^(?=.*[A-Za-z])(?=.*\d).{6,8}$/)) {
    strength = "Fort";
    color = "green";
  }

  strengthText.textContent = "Sécurité : " + strength;
  strengthText.style.color = color;
});

// 🔹 Soumission formulaire
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const postnom = document.getElementById("post-nom").value;
  const prenom = document.getElementById("prenom").value;
  const birthdate = document.getElementById("birthdate").value;
  const lieu = document.getElementById("lieu").value;
  const email = document.getElementById("email").value;
  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;

  // 🔐 Vérification mot de passe
  if (pass1.length < 6 || pass1.length > 8) {
    return alert("Le mot de passe doit contenir entre 6 et 8 caractères ❌");
  }

  const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,8}$/;
  if (!regex.test(pass1)) {
    return alert("Le mot de passe doit contenir au moins une lettre et un chiffre ❌");
  }

  if (pass1 !== pass2) {
    return alert("Les mots de passe ne correspondent pas ❌");
  }

  // 📱 Vérification numéro
  if (!iti.isValidNumber()) {
    return alert("Numéro invalide ❌");
  }

  // 🎂 Vérification âge (≥18)
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 18) {
    return alert("Vous devez avoir au moins 18 ans ❌");
  }

  const phone = iti.getNumber();

  // 🔹 UI changement
  document.getElementById("form").style.display = "none";
  document.getElementById("otpSection").style.display = "block";

  // 🔹 Envoi OTP
  try {
    const res = await fetch("https://ton-backend.com/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, phone })
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error();
    }

    console.log("OTP envoyé ✅");

  } catch (error) {
    alert("Erreur envoi OTP ❌");
  }
});

// 🔹 Vérification OTP
document.getElementById("verifyOtp").addEventListener("click", async () => {
  const otp = Array.from(document.querySelectorAll(".otp-box"))
    .map(input => input.value)
    .join("");

  const email = document.getElementById("email").value;
  const phone = iti.getNumber();

  try {
    const res = await fetch("https://ton-backend.com/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, phone, otp })
    });

    const data = await res.json();

    if (data.success) {
      alert("Compte vérifié ✅");
    } else {
      alert("OTP incorrect ❌");
    }

  } catch {
    alert("Erreur serveur ❌");
  }
});

// 🔹 OTP UX (auto + backspace)
document.querySelectorAll(".otp-box").forEach((input, i, arr) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1 && i < arr.length - 1) {
      arr[i + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && i > 0) {
      arr[i - 1].focus();
    }
  });
});
