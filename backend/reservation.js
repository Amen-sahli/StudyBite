document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const seat = document.querySelector('.seat.selected')?.dataset.seat;

    if (!seat) {
        alert('⚠️ Choisissez une place !');
        return;
    }

    const nom        = document.getElementById('nom').value;
    const email      = document.getElementById('email').value;
    const telephone  = document.getElementById('tel').value;
    const boisson    = document.querySelector('input[name="drink"]:checked')?.value;
    const reclamation = document.getElementById('remarque').value.trim();
    const date       = document.getElementById('date').value;
    const heureDebut = document.getElementById('heureDebut').value;
    const heureFin   = document.getElementById('heureFin').value;

    if (!date || !heureDebut || !heureFin) {
        alert('⚠️ Remplissez date et heures !');
        return;
    }

    const debut = new Date(`${date}T${heureDebut}:00`);
    const fin   = new Date(`${date}T${heureFin}:00`);

    if (fin <= debut) {
        alert('⚠️ L\'heure de fin doit être après l\'heure de début !');
        return;
    }

    const dureeMs  = fin - debut;
    const duree    = dureeMs / (1000 * 60 * 60);

    const { data: { user } } = await db.auth.getUser();

    const { error } = await db.from('reservations').insert({
        full_name       : nom,
        email           : email,
        phone           : telephone,
        machroub        : boisson,
        seat            : seat,
        date_reservation: date,
        heure_debut     : heureDebut,
        duree           : duree,
        complaint       : reclamation || null,
        heure_fin       : fin.toISOString(),
        user_id         : user.id
    });

    if (error) {
        alert('❌ Erreur : ' + error.message);
        console.error(error);
    } else {
        alert(`✅ Place ${seat} réservée !`);

        this.reset();
        document.getElementById('selectedSeatDisplay').textContent = 'Aucune';

        document.querySelectorAll('.seat.selected').forEach(s => {
            s.classList.remove('selected');
            s.classList.add('free');
        });

        window.chargerSiegesOccupes?.();
    }
});
