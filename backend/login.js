const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const seatHint = document.getElementById('seat-hint');

const ADMIN_EMAIL = 'admin@espacevip.tn';
const ADMIN_PASSWORD = 'Admin123!';

const params = new URLSearchParams(window.location.search);
const selectedSeat = params.get('seat');

if (seatHint && selectedSeat) {
    seatHint.textContent = `Place choisie: ${selectedSeat}. Connectez-vous pour terminer la reservation.`;
}

// 🔐 Fonction de cryptage simple (César +3)
function hasherPassword(plainPassword) {
    let result = "";
    for (let i = 0; i < plainPassword.length; i++) {
        result += String.fromCharCode(plainPassword.charCodeAt(i) + 3);
    }
    return result;
}

async function verifierClient() {
    errorMessage.textContent = "";

    if (!email.value || !password.value) {
        errorMessage.textContent = "Veuillez remplir tous les champs!";
        return false;
    }

    // Connexion admin (détection automatique par e-mail)
    if (email.value === ADMIN_EMAIL) {
        if (email.value === ADMIN_EMAIL && password.value === ADMIN_PASSWORD) {
            return true;
        }
        errorMessage.textContent = "Identifiants admin invalides!";
        return false;
    }

    // Récupérer le client par email + password crypté
    const { data, error } = await db
        .from('Client')
        .select('email, password')
        .eq('email', email.value)
        .single();

    if (error || !data) {
        errorMessage.textContent = "Adresse e-mail client non trouvée!";
        return false;
    }

    // 🔐 Comparer le mot de passe crypté
    if (hasherPassword(password.value) !== data.password) {
        errorMessage.textContent = "Mot de passe incorrect!";
        return false;
    }

    return true;
}

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const isValid = await verifierClient();
    if (!isValid) return;

    // Connexion admin (détection automatique par e-mail)
    if (email.value === ADMIN_EMAIL) {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('currentUserEmail', email.value);
        window.location.href = 'admin.html';
        return;
    }

    // Connexion client réussie
    localStorage.setItem('role', 'user');
    localStorage.setItem('currentUserEmail', email.value);

    const destination = selectedSeat
        ? `place.html?seat=${encodeURIComponent(selectedSeat)}`
        : 'index.html';

    window.location.href = destination;
});