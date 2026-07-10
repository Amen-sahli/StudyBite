const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const seatHint = document.getElementById('seat-hint');


const params = new URLSearchParams(window.location.search);
const selectedSeat = params.get('seat');

if (seatHint && selectedSeat) {
    seatHint.textContent = `Place choisie: ${selectedSeat}. Connectez-vous pour terminer la réservation.`;
    seatHint.style.display = 'block';
}

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    errorMessage.textContent = "";

    if (!email.value || !password.value) {
        errorMessage.textContent = "Veuillez remplir tous les champs!";
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

    const {data: { user }} = await db.auth.getUser();
    const { data: client } = await db
        .from("clients")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    if (client.role === "admin") {
        window.location.href = "admin.html";
    } else {
        const destination = selectedSeat
        ? `place.html?seat=${encodeURIComponent(selectedSeat)}`
        : '../index.html';
        window.location.href = destination;
    }
    
});