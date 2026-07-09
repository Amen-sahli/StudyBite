const nameInput = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");
const signupBtn = document.getElementById("signup-btn");
const errorMessage = document.getElementById("error-message");

function verifierChamps() {
    errorMessage.textContent = "";

    if (!nameInput.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.textContent += "Veuillez remplir tous les champs!\n";
        return;
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

    const { data, error } = await db.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: {
                name: nameInput.value
            }
        }
    });

    if (error) {
        errorMessage.textContent = error.message;
        return;
    }

    const user = data.user;

    const { error: insertError } = await db
    .from("clients")
    .insert({
        id: user.id,
        name: nameInput.value,
        email: email.value
    });

    if (insertError) {
        console.log(insertError);
        alert(insertError.message);
    }


    alert("Inscription réussie ! Connectez-vous.");
    window.location.href = "login.html";
});