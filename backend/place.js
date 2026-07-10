document.addEventListener('DOMContentLoaded', async function () {
    const logoutBtn = document.getElementById('logoutBtn');
      
    const {data: { user }} = await db.auth.getUser();

    if (!user) {
        window.location.href = "login.html";
    }

    const { data: client } = await db
        .from('clients')
        .select('name')
        .eq('id', user.id)
        .single();

    if (client) {
        const nomInput = document.getElementById('nom');
        const emailInput = document.getElementById('email');
        if (nomInput) nomInput.value = client.name || '';
        if (emailInput) emailInput.value = user.email || '';
    }

    const params = new URLSearchParams(window.location.search);
    const requestedSeat = params.get('seat');

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await db.auth.signOut();
            window.location.href = "login.html";
        });
    }

    function attacherClics() {
        document.querySelectorAll('.seat.free').forEach(seat => {
            seat.onclick = function () {
                document.querySelectorAll('.seat.selected').forEach(s => {
                    s.classList.remove('selected');
                    s.classList.add('free');
                });
                this.classList.remove('free');
                this.classList.add('selected');
                const display = document.getElementById('selectedSeatDisplay');
                if (display) display.textContent = this.dataset.seat;
            };
        });
    }

    attacherClics();

    if (requestedSeat) {
        const seat = document.querySelector(`[data-seat="${requestedSeat}"]`);
        if (seat && seat.classList.contains('free')) {
            seat.click();
        }
    }

}); 
