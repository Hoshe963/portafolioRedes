document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA CAMBIAR DE VISTA (TIENDA, BIBLIOTECA, ETC.) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const viewTitle = document.getElementById('view-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página

            // Quita la clase 'active' de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));

            // Añade la clase 'active' al enlace clickeado
            link.classList.add('active');

            // Actualiza el título principal (simulación de cambio de vista)
            const viewName = link.querySelector('span').textContent;
            viewTitle.textContent = viewName;

            // Aquí iría la lógica para cargar el contenido de la nueva vista.
            // Por ahora, solo cambiamos el título. La biblioteca siempre está visible.
        });
    });

    // --- LÓGICA DE LA BARRA DE BÚSQUEDA EN LA BIBLIOTECA ---
    const searchInput = document.getElementById('game-search-input');
    const gameCards = document.querySelectorAll('.game-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        gameCards.forEach(card => {
            const gameTitle = card.dataset.title.toLowerCase();
            
            // Comprueba si el título del juego incluye el término de búsqueda
            if (gameTitle.includes(searchTerm)) {
                card.style.display = 'flex'; // Muestra la tarjeta
            } else {
                card.style.display = 'none'; // Oculta la tarjeta
            }
        });
    });

});