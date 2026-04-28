const ADMIN_EMAIL = 'admin@espacevip.tn';

document.addEventListener('DOMContentLoaded', function () {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('currentUserEmail');

    if (role !== 'admin' || email !== ADMIN_EMAIL) {
        window.location.href = 'login.html';
        return;
    }

    const tableBody = document.getElementById('reservationsTable');
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const totalReservations = document.getElementById('totalReservations');
    const todayReservations = document.getElementById('todayReservations');
    const uniqueClients = document.getElementById('uniqueClients');
    const logoutBtn = document.getElementById('logoutBtn');

    let reservations = [];

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
            try {
                await db.auth.signOut();
            } catch (e) {
                console.error(e);
            }

            localStorage.removeItem('role');
            localStorage.removeItem('currentUserEmail');
            window.location.href = 'login.html';
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function applyFilters() {
        const placeQuery = (searchInput.value || '').trim().toUpperCase();
        const selectedDate = dateFilter.value;

        const filtered = reservations.filter((item) => {
            const seat = (item.seat || '').toUpperCase();
            const byPlace = !placeQuery || seat.includes(placeQuery);
            const byDate = !selectedDate || item.date_reservation === selectedDate;
            return byPlace && byDate;
        });

        renderTable(filtered);
        renderStats(filtered);
    }

    function renderStats(list) {
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = list.filter((r) => r.date_reservation === today).length;
        const distinctSeats = new Set(list.map((r) => r.seat).filter(Boolean)).size;

        totalReservations.textContent = String(list.length);
        todayReservations.textContent = String(todayCount);
        uniqueClients.textContent = String(distinctSeats);
    }

    function renderTable(list) {
        if (!list.length) {
            tableBody.innerHTML = '<tr><td colspan="10">Aucune reservation trouvee pour ce filtre.</td></tr>';
            return;
        }

        tableBody.innerHTML = list.map((r) => {
            return `
                <tr>
                    <td>${escapeHtml(r.full_name || '-')}</td>
                    <td>${escapeHtml(r.email || '-')}</td>
                    <td>${escapeHtml(r.phone || '-')}</td>
                    <td>${escapeHtml(r.machroub || '-')}</td>
                    <td>${escapeHtml(r.seat || '-')}</td>
                    <td>${escapeHtml(r.date_reservation || '-')}</td>
                    <td>${escapeHtml(r.heure_debut || '-')}</td>
                    <td>${escapeHtml(r.duree != null ? r.duree : '-')}</td>
                    <td>${escapeHtml(r.heure_fin || '-')}</td>
                    <td>${escapeHtml(r.complaint || '-')}</td>
                    <td>${escapeHtml(r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '-')}</td>
                </tr>
            `;
        }).join('');
    }

    async function loadReservations() {
        const { data, error } = await db
            .from('reservations')
            .select('id, full_name, email, phone, machroub, seat, date_reservation, heure_debut, duree, heure_fin, complaint, created_at')
            .order('date_reservation', { ascending: false })
            .order('heure_debut', { ascending: false });

        if (error) {
            console.error(error);
            alert('Erreur lors du chargement des reservations.');
            return;
        }

        reservations = data || [];
        applyFilters();
    }

    searchInput.addEventListener('input', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    loadReservations();
});
