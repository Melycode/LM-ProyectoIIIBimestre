const requestURL = './json/db.json';

let allTravels = [];


function initPanelToggles() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            const isActive = panel.classList.contains('active');
            panels.forEach(p => p.classList.remove('active'));
            if (!isActive) panel.classList.add('active');
        });
    });
}



function renderCards(travels) {
    const destinationsSection = document.getElementById('travelSection');
    destinationsSection.innerHTML = '';

    if (!travels || travels.length === 0) {
        destinationsSection.innerHTML = `<p class="no-results">No se encontraron destinos.</p>`;
        return;
    }

    travels.forEach(destiny => {
        const { id, poster, name, country, continent, description } = destiny;
        const optimizedPoster = poster.replace('w_750', 'w_490');

        destinationsSection.innerHTML += `
        <div class="card" data-id="${id}">
            <div class="card-img-wrapper">
                <img src="${optimizedPoster}" class="card-img-top" alt="${name}" loading="lazy" width="490" height="330">
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
                <button class="btn-card-more" data-id="${id}">Ver más</button>
            </div>
        </div>`;
    });
}


function showDetail(id) {
    const destiny = allTravels.find(t => t.id === parseInt(id));

    if (!destiny || !destiny.detail) {
        alert('Información detallada aún no disponible.');
        return;
    }

    const destinationsSection = document.getElementById('travelSection');
    const detailContainer     = document.getElementById('detailView');

    destinationsSection.style.display = 'none';
    detailContainer.style.display     = 'block';

    const allHighlights = [
    { name: 'Vista general', image: destiny.detail.heroImage },
    ...destiny.detail.highlights
];

    const highlightChips = allHighlights
        .map((h, i) => `<button class="highlight-chip ${i === 0 ? 'active' : ''}" data-image="${h.image}">${h.name}</button>`)
        .join('');



    detailContainer.innerHTML = `
        <div class="detail-card">
            <button class="btn-back-detail" id="btnBack">← Volver a destinos</button>

            <div class="detail-layout">
                <div class="detail-img-col">
                    <img src="${destiny.detail.heroImage}" alt="${destiny.name}" class="detail-main-img" id="detailHeroImg" fetchpriority="high">
                    <div class="detail-badges-overlay">
                    </div>
                </div>

                <div class="detail-text-col">
                    <p class="detail-label">✈ ${destiny.country} · ${destiny.continent}</p>
                    <h1 class="detail-heading">${destiny.name}</h1>
                    <div class="detail-divider"></div>
                    <p class="detail-long-desc">${destiny.detail.longDescription}</p>
                    <h3 class="detail-highlights-title">Lugares destacados</h3>
                    <div class="detail-highlights">${highlightChips}</div>
                </div>
            </div>

        </div>`;

        detailContainer.querySelectorAll('.highlight-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const heroImg = document.getElementById('detailHeroImg');

        detailContainer.querySelectorAll('.highlight-chip')
            .forEach(c => c.classList.remove('active'));

        chip.classList.add('active');

        const newImg = new Image();
        newImg.src = chip.dataset.image;

        newImg.onload = () => {
            heroImg.src = newImg.src;
        };
    });
});

    detailContainer.classList.remove('detail-visible');
    requestAnimationFrame(() => {
        detailContainer.classList.add('detail-visible');
        detailContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btnBack').addEventListener('click', () => {
        detailContainer.style.display = 'none';
        detailContainer.classList.remove('detail-visible');
        destinationsSection.style.display = '';
    });
}


document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-card-more');
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.id;
    if (id) showDetail(id);
});


function setupFilterEvents() {
    const menuLinks = document.querySelectorAll('.menu-destinos a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('search-icon')) return;
            e.preventDefault();

            const selected = link.textContent.replace('▾', '').trim().toUpperCase();

            if (selected === 'TODOS' || selected === 'INICIO') {
                renderCards(allTravels);
                return;
            }

            const filtered = allTravels.filter(d =>
                d.continent.trim().toUpperCase() === selected
            );
            renderCards(filtered);
        });
    });
}


function setupSearchEvent() {
    const searchInput = document.getElementById('main-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toUpperCase();
        const filtered = allTravels.filter(d =>
            d.name.toUpperCase().includes(query) ||
            d.country.toUpperCase().includes(query) ||
            d.continent.toUpperCase().includes(query)
        );
        renderCards(filtered);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('travelSection')
                .scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}


async function fetchTravelsJson() {
    const response = await fetch(requestURL);
    const data = await response.json();
    return data;
}

fetchTravelsJson().then(data => {
    allTravels = data.destinations;
    renderCards(allTravels);   
    setupFilterEvents();
    setupSearchEvent();
    initPanelToggles();
});



