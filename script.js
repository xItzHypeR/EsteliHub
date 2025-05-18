document.addEventListener('DOMContentLoaded', function () {
    renderBusinessDirectory();
    initCategoryFilters();

    // Initialize map 
    document.getElementById('map').innerHTML = '<div class="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-map-marked-alt text-4xl mr-3"></i><span>Mapa interactivo</span></div>';

    // Initialize mini map in modal
    document.getElementById('miniMap').innerHTML = '<div class="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-map-marker-alt text-2xl mr-2"></i><span>Ubicación del local</span></div>';

    // Filtro de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            const filtered = businesses.filter(business =>
                business.name.toLowerCase().includes(query) ||
                business.category.toLowerCase().includes(query) ||
                business.address.toLowerCase().includes(query) ||
                (business.tags && business.tags.some(tag => tag.toLowerCase().includes(query)))
            );
            renderBusinessDirectory(filtered);
        });
    }
    // Diccionario de traducción para tags
    const tagsDictionary = {
        es: {
            "Cafeterías": "Cafeterías",
            "WiFi": "WiFi",
            "Terraza": "Terraza",
            "Moda": "Moda",
            "Local": "Local",
            "Accesorios": "Accesorios",
            "Libros": "Libros",
            "Cultural": "Cultural",
            "Historia local": "Historia local",
            "Estudio": "Estudio",
            "Investigación": "Investigación",
            "Arte": "Arte",
            "Literatura": "Literatura"
        },
        en: {
            "Cafeterías": "Coffee Shops",
            "WiFi": "WiFi",
            "Terraza": "Terrace",
            "Moda": "Fashion",
            "Local": "Local",
            "Accesorios": "Accessories",
            "Libros": "Books",
            "Cultural": "Cultural",
            "Historia local": "Local history",
            "Estudio": "Study",
            "Investigación": "Research",
            "Arte": "Art",
            "Literatura": "Literature"
        }
    };
    const categoriesText = {
        es: ["Todos", "Cafeterías", "Tiendas", "Moda", "Belleza", "Salud", "Hogar", "Biblioteca"],
        en: ["All", "Coffee Shops", "Stores", "Fashion", "Beauty", "Health", "Home", "Library"]
    };

    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.addEventListener('change', function () {
            const lang = this.value;
            if (lang === 'en') {
                document.querySelector('h1').textContent = 'EstelíHub';
                document.querySelector('input#searchInput').placeholder = 'Search places...';
                document.querySelector('button.bg-blue-500').innerHTML = '<i class="fas fa-plus mr-2"></i>Add Place';
                document.querySelector('h2').textContent = 'Discover the best places in your city';
                document.querySelector('p.text-xl').textContent = 'Explore, discover and support local businesses with detailed info, photos and real reviews.';

                // Traducir botones del Hero Section
                const heroButtons = document.querySelectorAll('.bg-white.text-blue-600, .bg-transparent.border-2.border-white');
                if (heroButtons[0]) heroButtons[0].innerHTML = '<i class="fas fa-map-marker-alt mr-2"></i>Explore on the map';
                if (heroButtons[1]) heroButtons[1].innerHTML = '<i class="fas fa-star mr-2"></i>Featured places';
            } else {
                document.querySelector('h1').textContent = 'EstelíHub';
                document.querySelector('input#searchInput').placeholder = 'Buscar locales...';
                document.querySelector('button.bg-blue-500').innerHTML = '<i class="fas fa-plus mr-2"></i>Agregar Local';
                document.querySelector('h2').textContent = 'Descubre los mejores locales de tu ciudad';
                document.querySelector('p.text-xl').textContent = 'Explora, conoce y apoya el comercio local con información detallada, fotos y reseñas reales.';

                // Traducir botones del Hero Section
                const heroButtons = document.querySelectorAll('.bg-white.text-blue-600, .bg-transparent.border-2.border-white');
                if (heroButtons[0]) heroButtons[0].innerHTML = '<i class="fas fa-map-marker-alt mr-2"></i>Explorar en el mapa';
                if (heroButtons[1]) heroButtons[1].innerHTML = '<i class="fas fa-star mr-2"></i>Locales destacados';
            }
            // Traducir tags en las tarjetas
            document.querySelectorAll('.business-card').forEach((card, idx) => {
                const tagsContainer = card.querySelectorAll('.flex.flex-wrap.gap-1 span');
                if (businesses[idx]) {
                    businesses[idx].tags.forEach((tag, i) => {
                        if (tagsContainer[i]) {
                            tagsContainer[i].textContent = tagsDictionary[lang][tag] || tag;
                        }
                    });
                }
            });

            // Traducir los botones de categorías
            const categoryButtons = document.querySelectorAll('.category-filter');
            categoriesText[lang].forEach((text, i) => {
                if (categoryButtons[i]) {
                    // Mantener el icono y solo cambiar el texto
                    const icon = categoryButtons[i].querySelector('i');
                    categoryButtons[i].innerHTML = '';
                    if (icon) categoryButtons[i].appendChild(icon);
                    categoryButtons[i].insertAdjacentText('beforeend', text);
                }
            });
        });
    }

});

// Renderizar el directorio de negocios al buscar o filtrar
function renderBusinessDirectory(filteredBusinesses = businesses) {
    const directory = document.getElementById('businessDirectory');
    directory.innerHTML = '';

    filteredBusinesses.forEach(business => {
        const businessCard = document.createElement('div');
        businessCard.className = 'bg-white rounded-xl overflow-hidden shadow-sm relative business-card';
        businessCard.innerHTML = `
            <div class="h-48 w-full bg-gray-200 overflow-hidden relative">
                <img src="${business.images[0]}" alt="${business.name}" class="w-full h-full object-cover">
                <div class="absolute top-3 left-3 bg-white bg-opacity-80 px-2 py-1 rounded-full text-sm">
                    <i class="fas fa-${getCategoryIcon(business.category)} mr-1"></i>${business.category}
                </div>
                <div class="business-overlay absolute inset-0 bg-black bg-opacity-40 opacity-0 flex items-center justify-center">
                    <button class="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50" onclick="openBusinessModal(${business.id})">
                        Ver detalles
                    </button>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg">${business.name}</h4>
                    <button class="text-${business.isFavorite ? 'red-500' : 'gray-300'} hover:text-red-500" onclick="toggleFavorite(${business.id}, this)">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="flex items-center mb-2">
                    <div class="rating-stars">
                        ${renderStars(business.rating)}
                    </div>
                    <span class="text-gray-600 ml-2">${business.rating} (${business.reviewCount})</span>
                </div>
                <div class="flex items-center text-gray-500 text-sm mb-3">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    <span>${business.address}</span>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${business.tags.map(tag => `<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        directory.appendChild(businessCard);
    });

    // Si no hay resultados
    if (filteredBusinesses.length === 0) {
        directory.innerHTML = '<div class="col-span-full text-center text-gray-500 py-10">No se encontraron locales.</div>';
    }
}




// iconos de categorías
function getCategoryIcon(category) {
    const icons = {
        'Cafetería': 'coffee',
        'Moda': 'tshirt',
        'Librería': 'book',
        'Tienda': 'shopping-bag',
        'Belleza': 'spa',
        'Salud': 'heartbeat',
        'Hogar': 'home'
    };
    return icons[category] || 'store';
}

// Renderizar estrellas de calificación
function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// inicializar filtros de categoría
function initCategoryFilters() {
    const filters = document.querySelectorAll('.category-filter');
    filters.forEach(filter => {
        filter.addEventListener('click', function () {
            // Quitar clase activa de todos
            document.querySelector('.category-filter.active').classList.remove('active');
            this.classList.add('active');

            // Obtener el texto de la categoría seleccionada
            const categoryText = this.textContent.trim().toLowerCase();

            // Filtrar negocios
            let filtered;
            if (categoryText === 'todos') {
                filtered = businesses;
            } else {
                filtered = businesses.filter(business =>
                    business.category.toLowerCase().includes(categoryText)
                );
            }

            // Limpiar el input de búsqueda al cambiar de categoría
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';

            renderBusinessDirectory(filtered);
        });
    });
}

// Agregar o quitar favorito
function toggleFavorite(businessId, button) {
    const business = businesses.find(b => b.id === businessId);
    business.isFavorite = !business.isFavorite;

    if (business.isFavorite) {
        button.classList.remove('text-gray-300');
        button.classList.add('text-red-500');
    } else {
        button.classList.remove('text-red-500');
        button.classList.add('text-gray-300');
    }

    // Update favorite button in modal if this business is currently being viewed
    const modal = document.getElementById('businessModal');
    if (!modal.classList.contains('hidden')) {
        const modalBusinessId = parseInt(modal.getAttribute('data-business-id'));
        if (modalBusinessId === businessId) {
            const favButton = document.getElementById('favoriteButton');
            favButton.innerHTML = business.isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            favButton.className = business.isFavorite ?
                'w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200' :
                'w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200';
        }
    }
}

// Abrir modal de negocio
function openBusinessModal(businessId) {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const modal = document.getElementById('businessModal');
    modal.setAttribute('data-business-id', businessId);

    // detalles del negocio
    document.getElementById('modalBusinessName').textContent = business.name;
    document.getElementById('modalBusinessAddress').textContent = business.address;
    document.getElementById('modalBusinessPhone').textContent = business.phone;
    document.getElementById('modalDescription').textContent = business.description;

    // calificación y reseñas
    document.getElementById('modalRatingStars').innerHTML = renderStars(business.rating);
    document.getElementById('modalRatingText').textContent = `${business.rating} (${business.reviewCount} reseñas)`;

    // categorías
    const categoriesContainer = document.getElementById('modalCategories');
    categoriesContainer.innerHTML = business.tags.map(tag =>
        `<span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">${tag}</span>`
    ).join('');

    // poner características
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = business.features.map(feature =>
        `<div class="flex items-center">
                    <i class="fas fa-check text-green-500 mr-2"></i>
                    <span class="text-gray-700">${feature}</span>
                </div>`
    ).join('');

    // Poner horarios
    const hoursContainer = document.getElementById('businessHours');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    hoursContainer.innerHTML = days.map((day, index) => {
        const hours = business.hours[day];
        return `
                    <div class="flex justify-between py-2 ${index < days.length - 1 ? 'border-b border-gray-200' : ''}">
                        <span class="text-gray-700">${dayNames[index]}</span>
                        <span class="font-medium">${hours === 'Cerrado' ? '<span class="text-red-500">Cerrado</span>' : hours}</span>
                    </div>
                `;
    }).join('');

    // Galería de imágenes
    document.getElementById('mainGalleryImage').src = business.images[0];
    document.getElementById('currentImageIndex').textContent = '1';
    document.getElementById('totalImages').textContent = business.images.length;

    const galleryThumbnails = document.getElementById('galleryThumbnails');
    galleryThumbnails.innerHTML = business.images.map((image, index) => `
                <div class="gallery-thumbnail cursor-pointer ${index === 0 ? 'ring-2 ring-blue-500' : ''}" onclick="changeGalleryImage(${businessId}, ${index})">
                    <img src="${image}" alt="" class="w-full h-16 object-cover rounded">
                </div>
            `).join('');

    // Reseñas
    const reviewsContainer = document.getElementById('reviewsPreview');
    reviewsContainer.innerHTML = business.reviews.map(review => `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-bold">${review.author}</h5>
                        <div class="text-sm text-gray-500">${review.date}</div>
                    </div>
                    <div class="rating-stars mb-2">
                        ${renderStars(review.rating)}
                    </div>
                    <p class="text-gray-700">${review.comment}</p>
                </div>
            `).join('');

    // Actualizar el botón de favorito
    const favButton = document.getElementById('favoriteButton');
    favButton.innerHTML = business.isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    favButton.className = business.isFavorite ?
        'w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200' :
        'w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200';
    favButton.onclick = function () {
        toggleFavorite(businessId);
        this.innerHTML = business.isFavorite ? '<i class="far fa-heart"></i>' : '<i class="fas fa-heart"></i>';
        this.className = business.isFavorite ?
            'w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200' :
            'w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200';
    };

    // Show modal
    modal.classList.remove('hidden');
}

// Change gallery image
function changeGalleryImage(businessId, imageIndex) {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    document.getElementById('mainGalleryImage').src = business.images[imageIndex];
    document.getElementById('currentImageIndex').textContent = imageIndex + 1;

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === imageIndex) {
            thumb.classList.add('ring-2', 'ring-blue-500');
        } else {
            thumb.classList.remove('ring-2', 'ring-blue-500');
        }
    });
}

// Close modal
function closeModal() {
    document.getElementById('businessModal').classList.add('hidden');
}

// Mostrar modal para agregar local
function showAddBusinessModal() {
    // Si ya existe el modal, solo muéstralo
    let modal = document.getElementById('addBusinessModal');
    if (!modal) {
        // Crear modal si no existe
        modal = document.createElement('div');
        modal.id = 'addBusinessModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-8 w-full max-w-lg shadow-lg relative">
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onclick="closeAddBusinessModal()">
                    <i class="fas fa-times"></i>
                </button>
                <h2 class="text-2xl font-bold mb-6">Agregar nuevo local</h2>
                <form id="addBusinessForm" class="space-y-4">
                    <input type="text" id="newBusinessName" class="w-full border rounded px-3 py-2" placeholder="Nombre del local" required>
                    <input type="text" id="newBusinessCategory" class="w-full border rounded px-3 py-2" placeholder="Categoría" required>
                    <input type="text" id="newBusinessAddress" class="w-full border rounded px-3 py-2" placeholder="Dirección" required>
                    <input type="text" id="newBusinessTags" class="w-full border rounded px-3 py-2" placeholder="Etiquetas (separadas por coma)">
                    <input type="url" id="newBusinessImage" class="w-full border rounded px-3 py-2" placeholder="URL de imagen">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Agregar</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Manejar envío del formulario
        document.getElementById('addBusinessForm').onsubmit = function (e) {
            e.preventDefault();
            const name = document.getElementById('newBusinessName').value.trim();
            const category = document.getElementById('newBusinessCategory').value.trim();
            const address = document.getElementById('newBusinessAddress').value.trim();
            const tags = document.getElementById('newBusinessTags').value.split(',').map(t => t.trim()).filter(Boolean);
            const image = document.getElementById('newBusinessImage').value.trim();

            if (name && category && address) {
                businesses.push({
                    id: businesses.length ? businesses[businesses.length - 1].id + 1 : 1,
                    name,
                    category,
                    rating: 0,
                    reviewCount: 0,
                    address,
                    description: '',
                    phone: '',
                    features: [],
                    hours: {
                        monday: '',
                        tuesday: '',
                        wednesday: '',
                        thursday: '',
                        friday: '',
                        saturday: '',
                        sunday: ''
                    },
                    tags,
                    images: image ? [image] : [],
                    reviews: [],
                    isFavorite: false
                });
                renderBusinessDirectory();
                closeAddBusinessModal();
            }
        };
    }
    modal.classList.remove('hidden');
}

// Cerrar modal de agregar local
function closeAddBusinessModal() {
    const modal = document.getElementById('addBusinessModal');
    if (modal) modal.classList.add('hidden');
}


// Sample business data
const businesses = [
    {
        id: 1,
        name: "Coffee Brothers",
        category: "Cafeterías",
        rating: 4.6,
        reviewCount: 63,
        address: "Pali central, 20 vrs al Norte, Estelí 31000",
        description: "Una de las mejores Cafeterías de Centroamerica, en el corazón de la ciudad de Estelí",
        phone: "",
        features: ["WiFi gratis", "Terraza", "Accesible"],
        hours: {
            monday: "8 a.m.–9 p.m.",
            tuesday: "8 a.m.–9 p.m.",
            wednesday: "8 a.m.–9 p.m.",
            thursday: "8 a.m.–9 p.m.",
            friday: "8 a.m.–9 p.m.",
            saturday: "8 a.m.–9:15 p.m.",
            sunday: "8 a.m.–9:15 p.m."
        },
        tags: ["Cafeterías", "WiFi", "Terraza"],
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noIwt_g41iHh0mLvIdqW_WAZOm4Ic9TMRe_70gy-4AhSfAPuf_1BTcMh_YQpD5qHpnqBtocvTxBzodwW642gELTkf_cImGDtMeBDqC6L_aaR82T_YUEfWl8gXaeznftaqOVlomkwQ=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/p/AF1QipMwDlQJ9yDWNTSNbcrf0bUH1-xSlJLJZg2kvUVq=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrn8N7frhEYQJb8iqgNXKbMH40fB6Qt_VdAfAFU8aUvRXUoK68tFcpCtcITgMWu_lx7wg5yHe1BzFd_kaIbsW8Abcbj01bFSFyLWE7ajdqF3OMrFvQagm1pnMqXaUPWKrprsx4DHw=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nocyTFG7GEjRlj3hYiTvnZo2uZoCF9QfkStc7zlsJvqNDaCa4833fZgyw4hmFugoPbCKbKAbnEE-jvt7S1vM3nOiteyaONFqEWgg-D_fxjViys79l86EfIhUs-LQDlOiwOsmRI=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/p/AF1QipN7LvOj8E3da8zEyekdT0A9t9FfVT21O4qx-yWZ=s1360-w1360-h1020-rw"
        ],
        reviews: [
            {
                author: "Soledad Rivera",
                rating: 5,
                date: "Hace 1 semana",
                comment: "Super bonito el lugar y la ubicación , Un lugar prefecto para pasar un rato agradable tiene un buen personal"
            },
            {
                author: "Yelkis Carrión",
                rating: 5,
                date: "Hace 1 mes",
                comment: "Uno de los mejores lugares que hemos visitado en Estelí, son buenos precios y el lugar es precioso. Las muchachas que atienden son muy amables, todo el tiempo estuvieron pendientes y la comida no tardó en llegar a nuestra mesa. Puntos extras por la playlist que tenían, muy buena música."
            }
        ],
        isFavorite: false
    },
    {
        id: 2,
        name: "TIENDA QUINTA AVENIDA",
        category: "Moda",
        rating: 4.5,
        reviewCount: 11,
        address: "Petronic el carmen 1 cuadra al oeste 10 vrs al Sur ESTELI, Estelí",
        description: "Tienda de ropa y accesorios con diseños exclusivos de diseñadores locales. Ofrecemos prendas de calidad con estilo contemporáneo para hombres y mujeres.",
        phone: "2713 2856",
        features: [ "Ropa", "Accesorios", "Moda"],
        hours: {
            monday: "8 a.m.–5 p.m.",
            tuesday: "8 a.m.–5 p.m.",
            wednesday: "8 a.m.–5 p.m.",
            thursday: "8 a.m.–5 p.m.",
            friday: "8 a.m.–5 p.m.",
            saturday: "Cerrado",
            sunday: "Cerrado"

        },
        tags: ["Moda", "Local", "Accesorios"],
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nowkue32367LoGzkO22zx2yJN37j0Pi7L2XCc2EOg-MxUxvuAbxmVlyJ9jVUkmlX0R0u31rsPVTzNrdKjNv70HEMSz2FgXfUrww_s0RVFA8spqf-nj4SqyW3vHzgXWMYxdaKrDK=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noe9PSmE7kgf6tsm8NdIoxyehjG-hzepkY9-6WJ78faQ52PxE5_JyzNrDo8u1aQ2sGA7znJKaGCM-CIjHGTRY-AWSitAazkFxp6c9mGQD9Cv-ENnqyJCu2XhRs1_b-sS6hbFpYM_g=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nretcPoNeOwsPi2ukUb07HZabT_tAS7yaJXKWvtDt-C7XXU7PeEDkH_EHxKYCQtG2DvTc2ZsgbUiS9-BNeNJl00ObbgQq5NU88_jVZMfmpY1EMS3V4TjlSYvSwJQX078OZForD4=s1360-w1360-h1020-rw",
        ],
        reviews: [
            {
                author: "Ana Torres",
                rating: 5,
                date: "Hace 3 días",
                comment: "Me encanta esta tienda! Tienen prendas únicas y de muy buena calidad. El servicio es excelente."
            },
            {
                author: "Luis Ramírez",
                rating: 3,
                date: "Hace 2 semanas",
                comment: "Buena selección de ropa, pero los precios son un poco altos. El personal es muy atento."
            }
        ],
        isFavorite: true
    },
    {
        id: 3,
        name: "Biblioteca Pública Municipal Dr. Samuel Meza",
        category: "Biblioteca",
        rating: 4.6,
        reviewCount: 9,
        address: "3JWW+HG9, Estelí",
        description: "",
        phone: "2713 0214",
        features: ["Turismo", "Historia", "Área de lectura"],
        hours: {
            monday: "8 a.m.–5 p.m.",
            tuesday: "8 a.m.–5 p.m.",
            wednesday: "8 a.m.–5 p.m.",
            thursday: "8 a.m.–5 p.m.",
            friday: "8 a.m.–5 p.m.",
            saturday: "Cerrado",
            sunday: "Cerrado"

        },
        tags: ["Libros", "WiFi", "Cultural", "Historia local", "Estudio", "Investigación", "Arte", "Literatura"],
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqMf-9pQvqgqBs9Wr0m6C_T2ure_W8GVewb9Z6aPh_1zsalSNimVvjOLY_3G2NlW-UpaPg_Zd6eOtcsuH43oDYPxuDck_2FEg7w3zoyCY_kfOk0DNxwO40r6Fib3h1kxvTP-qXl=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqjeNwqcGC9Zss96m_sKB1a32JKFFN57ILRZgf9HK_XxWgiqMuZaRLDhJj_alqX_O-WSAqqfYbB75mFHu2_4Qts_Vp5vgNk7uzTU4G7ceqhRR3OYGqTCg6ItSy9AQu3MMiAApq0=s1360-w1360-h1020-rw",
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqraz38BYZQ8EQG0S04f3vkxlavj7fWKBEFrzWXd0hzzcaL3dTvIhQ7w6Vb1vz6IKeXBCUXX7F0PAXbjBGS_mBUBPDjqj4Ot8FRWYu7EEndumWhVXPuVIAovTILG38xGZrrKu0=s1360-w1360-h1020-rw"
        ],
        reviews: [
            {
                author: "Sofía Jiménez",
                rating: 5,
                date: "Hace 1 semana",
                comment: "Mi lugar favorito en la ciudad! Tienen una selección increíble de libros y el ambiente es perfecto para leer."
            },
            {
                author: "Roberto Sánchez",
                rating: 4,
                date: "Hace 1 mes",
                comment: "La biblioteca tiene una gran variedad de libros y recursos. El personal es muy amable y siempre dispuesto a ayudar."
            }
        ],
        isFavorite: false
    }
];