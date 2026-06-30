

document.addEventListener("DOMContentLoaded", function () {


    const triggerSearch = document.getElementById("triggerSearch");
    const closeSearch   = document.getElementById("closeSearch");
    const navbar        = document.getElementById("mainNavbar");
    const searchInput   = document.getElementById("main-search-input");

    if (triggerSearch && navbar && searchInput) {
        triggerSearch.addEventListener("click", function (e) {
            e.preventDefault();
            navbar.classList.add("search-active");
            searchInput.placeholder = "Busca por destino, país o continente...";
            setTimeout(() => searchInput.focus(), 300);
        });
    }

    if (closeSearch && navbar && searchInput) {
        closeSearch.addEventListener("click", function () {
            navbar.classList.remove("search-active");
            searchInput.value = "";
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navbar?.classList.contains("search-active")) {
            navbar.classList.remove("search-active");
            searchInput.value = "";
        }
    });


    const subscribeModal      = document.getElementById("subscribeModal");
    const btnSuscribete       = document.getElementById("btnSuscribete");
    const closeSubscribeModal = document.getElementById("closeSubscribeModal");
    const btnConfirmSubscribe = document.getElementById("btnConfirmSubscribe");
    const subscribeEmail      = document.getElementById("subscribeEmail");
    const subscribeSuccess    = document.getElementById("subscribeSuccess");
    const modalDescription    = document.querySelector(".modal-description");

    function resetSubscribeModal() {
        if (subscribeSuccess)    subscribeSuccess.style.display    = "none";
        if (modalDescription)    modalDescription.style.display    = "block";
        if (subscribeEmail) { subscribeEmail.style.display = "block"; subscribeEmail.value = ""; }
        if (btnConfirmSubscribe) btnConfirmSubscribe.style.display = "block";
    }

    btnSuscribete?.addEventListener("click", () => {
        if (subscribeModal) subscribeModal.style.display = "flex";
    });

    closeSubscribeModal?.addEventListener("click", () => {
        resetSubscribeModal();
        if (subscribeModal) subscribeModal.style.display = "none";
    });

    btnConfirmSubscribe?.addEventListener("click", () => {
        const email = subscribeEmail?.value;
        if (!email || !email.includes("@")) { alert("Por favor ingresa un correo válido."); return; }
        if (modalDescription)    modalDescription.style.display    = "none";
        if (subscribeEmail)      subscribeEmail.style.display       = "none";
        if (btnConfirmSubscribe) btnConfirmSubscribe.style.display  = "none";
        if (subscribeSuccess)    subscribeSuccess.style.display     = "block";
    });

    window.addEventListener("click", (e) => {
        if (e.target === subscribeModal) {
            resetSubscribeModal();
            if (subscribeModal) subscribeModal.style.display = "none";
        }
    });
});