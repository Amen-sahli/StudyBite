document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const seat = document.querySelector('.seat.selected')?.dataset.seat;
    
    if (!seat) {
        alert('⚠️ Choisissez une place !');
        return;
    }

    const nom        = document.getElementById('fullName').value;
    const email      = document.getElementById('email').value;
    const telephone  = document.getElementById('phone').value;
    const boisson    = document.querySelector('input[name="m"]:checked').value;
    const reclamation = document.getElementById('complaint').value.trim();
    const date       = document.getElementById('reservationDate').value;
    const heure      = document.getElementById('reservationTime').value;
    const duree      = parseFloat(document.getElementById('reservationDuration').value);

    if (!date || !heure || !duree) {
        alert('⚠️ Remplissez date, heure et durée !');
        return;
    }

    

    const heureFin = new Date(`${date}T${heure}:00Z`);
    heureFin.setHours(heureFin.getHours() + Math.floor(duree));
    heureFin.setMinutes(heureFin.getMinutes() + (duree % 1) * 60);


    const { error } = await db.from('reservations').insert({
        full_name      : nom,
        email          : email,
        phone          : telephone,
        machroub       : boisson,
        seat           : seat,
        date_reservation: date,
        heure_debut    : heure,
        duree          : duree,
        complaint      : reclamation || null,
        heure_fin      : heureFin.toISOString()
    });

   
    if (error) {
        alert('❌ Erreur : ' + error.message);
        console.error(error);
    } else {

       
        alert(`✅ Place ${seat} réservée !`);
        
        this.reset();
        document.getElementById('heureFin').textContent = '';
        
        window.chargerSiegesOccupes?.();
    }
});
