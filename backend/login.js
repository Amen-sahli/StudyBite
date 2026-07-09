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

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    errorMessage.textContent = "";

    if (!email.value || !password.value) {
        errorMessage.textContent = "Veuillez remplir tous les champs!";
        return;
    }

    // Admin bypass
    if (email.value === ADMIN_EMAIL) {
        if (password.value === ADMIN_PASSWORD) {
            localStorage.setItem('role', 'admin');
            localStorage.setItem('currentUserEmail', email.value);
            window.location.href = 'admin.html';
            return;
        }
        errorMessage.textContent = "Identifiants admin invalides!";
        return;
    }

    // Supabase Auth login for regular users
    const { data, error } = await db.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        errorMessage.textContent = "Email ou mot de passe incorrect!";
        return;
    }

    const destination = selectedSeat
        ? `place.html?seat=${encodeURIComponent(selectedSeat)}`
        : 'place.html';

    window.location.href = destination;
});