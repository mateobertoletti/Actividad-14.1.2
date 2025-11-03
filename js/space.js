document.addEventListener("DOMContentLoaded", () => {
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const contenedor = document.getElementById("contenedor");

  async function buscarImagenes() {
    const termino = inputBuscar.value.trim();
    if (termino === "") {
      contenedor.innerHTML = `<p class="text-center text-warning">⚠️ Ingrese un término de búsqueda.</p>`;
      return;
    }

    contenedor.innerHTML = `<p class="text-center">🔎 Buscando imágenes...</p>`;

    try {
      const response = await fetch(`https://images-api.nasa.gov/search?q=${termino}`);
      const data = await response.json();
      const items = data.collection.items;

      if (!items || items.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-warning">No se encontraron resultados para "${termino}".</p>`;
        return;
      }

      contenedor.innerHTML = "";

      items.forEach(item => {
        const info = item.data[0];
        const imgSrc = item.links ? item.links[0].href : "https://via.placeholder.com/400x300?text=Sin+imagen";

        const card = document.createElement("div");
        card.classList.add("col-md-4", "col-sm-6", "mb-4");

        card.innerHTML = `
          <div class="card h-100 bg-card text-light shadow-sm">
            <img src="${imgSrc}" class="card-img-top" alt="${info.title}">
            <div class="card-body">
              <h5 class="card-title">${info.title}</h5>
              <p class="card-text">${info.description ? info.description : "Sin descripción disponible."}</p>
            </div>
            <div class="card-footer">
              <small class="text-muted">📅 ${new Date(info.date_created).toLocaleDateString()}</small>
            </div>
          </div>
        `;
        contenedor.appendChild(card);
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      contenedor.innerHTML = `<p class="text-center text-danger">❌ Ocurrió un error al cargar las imágenes.</p>`;
    }
  }

  btnBuscar.addEventListener("click", buscarImagenes);
  inputBuscar.addEventListener("keypress", e => {
    if (e.key === "Enter") buscarImagenes();
  });
});
