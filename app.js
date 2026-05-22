const requestURL = './json/db.json';

let allTravels = [];

function initPanelToggles() {
    const panels = document.querySelectorAll('.panel');

    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            const isActive = panel.classList.contains('active');
            panels.forEach(p => p.classList.remove('active'));

            if (!isActive) {
                panel.classList.add('active');
            }
        });
    });
}

function renderCards(travels) {
    const destinationsSection = document.getElementById('travelSection');
    destinationsSection.innerHTML = "";
    travels.destinations.forEach(destiny => {
        const { poster, name, country, continent, description } = destiny;
        destinationsSection.innerHTML += `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${poster}" class="card-img-top" alt="${name}">
            </div>
            <div class="card-body">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="card-country-badge">${country}</span>
                        <span class="card-continent-badge">${continent}</span>
                    </div>
                    <h4 class="card-title">${name}</h4>
                    <p class="card-text">${description}</p>
                </div>
                <a href="#" class="btn-card-more">Ver más</a>
            </div>
        </div>
        `;
    });
}

async function fetchTravelsJson() {
    const response = await fetch(requestURL);
    const travels = await response.json();
    return travels;
}

fetchTravelsJson().then(travels => {
    allTravels = travels;
    const destinationsSection = document.getElementById('travelSection');

    travels.forEach(destiny => {
        const {
            poster,
            name,
            country,
            continent,
            description
        } = destiny;

        destinationsSection.innerHTML += `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${poster}" class="card-img-top" alt="${name}">
            </div>

            <div class="card-body">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="card-country-badge">${country}</span>
                        <span class="card-continent-badge">${continent}</span>
                    </div>

                    <h4 class="card-title">${name}</h4>
                    <p class="card-text">${description}</p>
                </div>

                <a href="#" class="btn-card-more">Ver más</a>
                
            </div>
        </div>
        `;
    });
});


function setupFilterEvents() {

    const menuLinks = document.querySelectorAll('.menu-destinos a');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {

            if (link.classList.contains('search-icon')) return;
            
            e.preventDefault();

            const seleccionado = link.textContent.replace('▾', '').trim().toUpperCase();

            if (seleccionado === "TODOS" || seleccionado === "INICIO") {
                renderCards(allTravels);
                return;
            }

            const viajesFiltrados = allTravels.filter(destiny => 
                destiny.continent.trim().toUpperCase() === seleccionado
            );

            renderCards(viajesFiltrados);
        });
    });
}


function setupSearchEvent() {
    const searchInput = document.getElementById("main-search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const textoBusqueda = e.target.value.trim().toUpperCase();
        const destinationsSection = document.getElementById('travelSection');

        const viajesFiltrados = allTravels.filter(destiny => {
            const nombreMatches = destiny.name.toUpperCase().includes(textoBusqueda);
            const paisMatches = destiny.country.toUpperCase().includes(textoBusqueda);
            const continenteMatches = destiny.continent.toUpperCase().includes(textoBusqueda);
            
            return nombreMatches || paisMatches || continenteMatches;
        });

        if (viajesFiltrados.length === 0) {
            destinationsSection.innerHTML = `<p class="no-results">No se encontraron destinos que coincidan con tu búsqueda.</p>`;
            return;
        }

        renderCards(viajesFiltrados);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const triggerSearch = document.getElementById("triggerSearch");
    const closeSearch = document.getElementById("closeSearch");
    const navbar = document.getElementById("mainNavbar");
    const searchInput = document.getElementById("main-search-input");

    if (triggerSearch && navbar && searchInput) {
        triggerSearch.addEventListener("click", function(e) {
            e.preventDefault(); 
            navbar.classList.add("search-active");
            searchInput.placeholder = "Busca por destino, país o continente...";
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        });
    }

    if (closeSearch && navbar && searchInput) {
        closeSearch.addEventListener("click", function() {
            navbar.classList.remove("search-active");
            searchInput.value = ""; 
        });
    }

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && navbar && navbar.classList.contains("search-active")) {
            navbar.classList.remove("search-active");
            searchInput.value = "";
        }
    });

    function initSubscribeModal() {
        const subscribeModal = document.getElementById('subscribeModal');
        const btnSuscribete = document.getElementById('btnSuscribete');
        const closeSubscribeModal = document.getElementById('closeSubscribeModal');
        const btnConfirmSubscribe = document.getElementById('btnConfirmSubscribe');
        const subscribeEmail = document.getElementById('subscribeEmail');
        const subscribeSuccess = document.getElementById('subscribeSuccess');
        const modalDescription = document.querySelector('.modal-description');

        if (btnSuscribete) {
            btnSuscribete.addEventListener('click', () => {
                if (subscribeModal) subscribeModal.style.display = 'flex';
            });
        }

        if (closeSubscribeModal) {
            closeSubscribeModal.addEventListener('click', () => {
                resetSubscribeModal();
                if (subscribeModal) subscribeModal.style.display = 'none';
            });
        }

        if (btnConfirmSubscribe) {
            btnConfirmSubscribe.addEventListener('click', () => {
                const email = subscribeEmail.value;
                
                if (!email || !email.includes('@')) {
                    alert('Por favor ingresa un correo válido.');
                    return;
                }

                if (modalDescription) modalDescription.style.display = 'none';
                if (subscribeEmail) subscribeEmail.style.display = 'none';
                if (btnConfirmSubscribe) btnConfirmSubscribe.style.display = 'none';
                
                if (subscribeSuccess) subscribeSuccess.style.display = 'block';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === subscribeModal) {
                resetSubscribeModal();
                if (subscribeModal) subscribeModal.style.display = 'none';
            }
        });

        function resetSubscribeModal() {
            if (subscribeSuccess) subscribeSuccess.style.display = 'none';
            if (modalDescription) modalDescription.style.display = 'block';
            if (subscribeEmail) {
                subscribeEmail.style.display = 'block';
                subscribeEmail.value = '';
            }
            if (btnConfirmSubscribe) btnConfirmSubscribe.style.display = 'block';
        }
    }

    initSubscribeModal();
    setupFilterEvents();
    setupSearchEvent();
});
