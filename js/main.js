// Constants
let CLEARBIT_API_KEY = '';
// let GOOGLE_TRANSLATE_API_KEY = ''; // Translation feature - commented out

// DOM Elements
const searchInput = document.getElementById('company-search');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const carousel = document.getElementById('company-carousel');
const featuredPromptInput = document.getElementById('featured-prompt-input');
const savePromptButton = document.getElementById('save-prompt-btn');

// Sample company data for carousel
const sampleCompanies = [
    {
        name: 'Google',
        domain: 'google.com',
        logo: 'https://logo.clearbit.com/google.com',
        description: 'Technology company specializing in internet-related services and products.'
    },
    {
        name: 'Microsoft',
        domain: 'microsoft.com',
        logo: 'https://logo.clearbit.com/microsoft.com',
        description: 'Technology company developing and supporting software, consumer electronics, and services.'
    },
    {
        name: 'Apple',
        domain: 'apple.com',
        logo: 'https://logo.clearbit.com/apple.com',
        description: 'Technology company that designs and develops consumer electronics, software, and services.'
    },
    {
        name: 'Amazon',
        domain: 'amazon.com',
        logo: 'https://logo.clearbit.com/amazon.com',
        description: 'Technology company focusing on e-commerce, cloud computing, and artificial intelligence.'
    },
    {
        name: 'Meta',
        domain: 'meta.com',
        logo: 'https://logo.clearbit.com/meta.com',
        description: 'Technology company specializing in social networking and virtual reality technologies.'
    },
    {
        name: 'Netflix',
        domain: 'netflix.com',
        logo: 'https://logo.clearbit.com/netflix.com',
        description: 'Entertainment company providing streaming media and video on demand services.'
    }
];

let currentCarouselPosition = 0;
const cardsPerView = 4;

// Initialize carousel
function initializeCarousel() {
    const carousel = document.getElementById('company-carousel');
    if (!carousel) {
        console.error('Carousel element not found');
        return;
    }

    carousel.innerHTML = '';
    sampleCompanies.forEach(company => {
        const companyCard = document.createElement('div');
        companyCard.className = 'carousel-item';
        companyCard.innerHTML = `
            <div class="company-logo">
                <img src="${company.logo}" alt="${company.name} logo" onerror="this.src='images/default-company.png'">
            </div>
            <div class="company-info">
                <h3>${company.name}</h3>
                <p class="company-domain">${company.domain}</p>
                <p class="company-description">${company.description}</p>
                <a href="https://${company.domain}" class="visit-btn" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Visit this Business
                </a>
            </div>
        `;
        carousel.appendChild(companyCard);
    });
    updateCarouselPosition();
}

// Move carousel
function moveCarousel(direction) {
    const carousel = document.getElementById('company-carousel');
    if (!carousel) return;

    const maxPosition = sampleCompanies.length - cardsPerView;
    currentCarouselPosition = Math.max(0, Math.min(currentCarouselPosition + direction, maxPosition));
    updateCarouselPosition();
}

// Update carousel position
function updateCarouselPosition() {
    const carousel = document.getElementById('company-carousel');
    if (!carousel) return;

    const cardWidth = carousel.querySelector('.carousel-item')?.offsetWidth || 0;
    const gap = parseInt(window.getComputedStyle(carousel).gap) || 0;
    carousel.style.transform = `translateX(-${currentCarouselPosition * (cardWidth + gap)}px)`;
}

// Search functionality
function setupSearchListeners() {
    const searchInput = document.getElementById('company-search');
    const searchButton = document.getElementById('search-button');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput?.value.trim();
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Featured prompt functionality
function setupPromptListener() {
    const saveButton = document.querySelector('.save-btn');
    if (saveButton) {
        saveButton.addEventListener('click', handleSavePrompt);
    }
}

function handleSavePrompt() {
    const promptInput = document.getElementById('featured-prompt-input');
    if (!promptInput) return;

    const prompt = promptInput.value.trim();
    if (prompt) {
        showMessage('Prompt saved successfully!', 'success');
        promptInput.value = '';
    } else {
        showMessage('Please enter a prompt before saving.', 'error');
    }
}

// Message display
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Load components
async function loadComponents() {
    try {
        // Load navbar
        const navbarResponse = await fetch('components/navbar.html');
        const navbarHtml = await navbarResponse.text();
        const navbarContent = new DOMParser()
            .parseFromString(navbarHtml, 'text/html')
            .querySelector('nav');
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder && navbarContent) {
            navbarPlaceholder.innerHTML = '';
            navbarPlaceholder.appendChild(navbarContent);
        }

        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHtml = await footerResponse.text();
        const footerContent = new DOMParser()
            .parseFromString(footerHtml, 'text/html')
            .querySelector('footer');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder && footerContent) {
            footerPlaceholder.innerHTML = '';
            footerPlaceholder.appendChild(footerContent);
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initializeCarousel();
    setupSearchListeners();
    setupPromptListener();

    // Add window resize listener to update carousel
    window.addEventListener('resize', () => {
        updateCarouselPosition();
    });
});
