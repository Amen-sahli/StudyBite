const nameInput = document.getElementById("nom");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupBtn = document.getElementById("signup-btn");
const errorMessage = document.getElementById("error-message");

// 🔐 Fonction de cryptage simple (César +3)
function hasherPassword(password) {
    let result = "";
    for (let i = 0; i < password.length; i++) {
        result += String.fromCharCode(password.charCodeAt(i) + 3);
    }
    return result;
}

function verifierChamps() {
    errorMessage.textContent = "";

    if (!nameInput.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.textContent += "Veuillez remplir tous les champs!\n";
    }
    if (nameInput.value.length < 3 || nameInput.value.length > 20 || nameInput.value.match(/\d/)) {
        errorMessage.textContent += "Le nom doit comporter entre 3 et 20 caractères et ne doit pas contenir de chiffres!\n";
    }
    if (!email.value.includes("@") || !email.value.includes(".")) {
        errorMessage.textContent += "Veuillez entrer une adresse e-mail valide!\n";
    }
    if (password.value.length < 8) {
        errorMessage.textContent += "Le mot de passe doit comporter au moins 8 caractères!\n";
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.textContent += "Les mots de passe ne correspondent pas!\n";
    }

    return errorMessage.textContent === "";
}

signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!verifierChamps()) return;

    // Vérifier si l'email existe déjà dans la table Client
    const { data: existing } = await db
        .from('Client')
        .select('email')
        .eq('email', email.value)
        .single();

    if (existing) {
        errorMessage.textContent = "Cet email est déjà utilisé!";
        return;
    }

    // 🔐 Crypter le mot de passe avant sauvegarde
    const passwordHash = hasherPassword(password.value);

    // Ajouter le client avec le mot de passe crypté
    const { error } = await db.from('Client').insert({
        name: nameInput.value,
        email: email.value,
        password: passwordHash
    });

    if (error) {
        alert("Erreur lors de l'inscription: " + error.message);
        return;
    }

    alert("Inscription réussie!");
    window.location.href = "login.html";
});