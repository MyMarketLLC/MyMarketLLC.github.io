// Constants
let CLEARBIT_API_KEY = '';
const searchInput = document.getElementById('company-search');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

// Initialize API keys
async function initializeAPIKeys() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) {
            throw new Error('Failed to load API configuration');
        }
        const config = await response.json();
        CLEARBIT_API_KEY = config.clearbitKey;
    } catch (error) {
        console.error('Error loading API configuration:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to load API configuration. Please try again later.';
        document.body.insertBefore(errorMessage, document.body.firstChild);
    }
}

// Search functionality
async function searchCompanies(query) {
    try {
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`, {
            headers: {
                'Authorization': `Bearer ${CLEARBIT_API_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        searchResults.innerHTML = '<p class="error">Error fetching company data. Please try again.</p>';
    }
}

// Display search results
function displayResults(companies) {
    searchResults.innerHTML = '';
    
    if (companies.length === 0) {
        searchResults.innerHTML = '<p>No companies found.</p>';
        return;
    }

    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'results-grid';

    companies.forEach(company => {
        const companyCard = document.createElement('div');
        companyCard.className = 'company-card';
        companyCard.innerHTML = `
            <img src="${company.logo}" alt="${company.name} logo" onerror="this.style.display='none'">
            <h3>${company.name}</h3>
            <p>${company.domain}</p>
        `;
        resultsGrid.appendChild(companyCard);
    });

    searchResults.appendChild(resultsGrid);
}

// Get search query from URL
function getSearchQueryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
}

// Initialize page
async function initialize() {
    await initializeAPIKeys();
    const query = getSearchQueryFromURL();
    if (query) {
        searchInput.value = query;
        searchCompanies(query);
    }
}

// Event listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
