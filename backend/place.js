document.addEventListener('DOMContentLoaded', async function () {
    const logoutBtn = document.getElementById('logoutBtn');
      
    const {data: { user }} = await db.auth.getUser();

    if (!user) {
        window.location.href = "login.html";
    }

    const params = new URLSearchParams(window.location.search);
    const requestedSeat = params.get('seat');

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
        const { error } = await db.auth.signOut();

        console.log("Logout error:", error);

        const {data: { user }} = await db.auth.getUser();

        console.log("User after logout:", user);

        console.log("Session after logout:",
        await db.auth.getSession());

        

        window.location.href = "login.html";
});
    }

    async function chargerSiegesOccupes() {
        const now = new Date().toISOString();
        const { data, error } = await db
            .from('reservations')
            .select('seat')
            .gte('heure_fin', now); 

        if (error) {
            console.error(error);
            return;
        }


        document.querySelectorAll('.seat').forEach(s => {
            s.classList.remove('occupied', 'selected');
            s.classList.add('free');
        });


        data.forEach(r => {
            const seat = document.querySelector(`[data-seat="${r.seat}"]`);
            if (seat) {
                seat.classList.remove('free');
                seat.classList.add('occupied');
            }
        });

        attacherClics();

        if (requestedSeat) {
            const seat = document.querySelector(`[data-seat="${requestedSeat}"]`);
            if (seat && seat.classList.contains('free')) {
                seat.click();
            }
        }
    }

    window.chargerSiegesOccupes = chargerSiegesOccupes;


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

    chargerSiegesOccupes();

}); 
