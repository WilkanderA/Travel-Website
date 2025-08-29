let travelData = {};

async function loadTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        travelData = await response.json();
        displayAllRecommendations();
    } catch (error) {
        console.error('Error loading travel data:', error);
        displayErrorMessage();
    }
}

function displayAllRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    const allDestinations = [
        ...travelData.countries || [],
        ...travelData.temples || [],
        ...travelData.beaches || []
    ];
    
    if (allDestinations.length === 0) {
        recommendationsList.innerHTML = '<p>No recommendations available at the moment.</p>';
        return;
    }
    
    allDestinations.forEach(destination => {
        const card = createDestinationCard(destination);
        recommendationsList.appendChild(card);
    });
}

function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    const imageUrl = destination.imageUrl || 'images/default-destination.jpg';
    const flag = destination.flag || '';
    const location = destination.location || '';
    const cities = destination.cities ? destination.cities.join(', ') : '';
    const timeToVisit = destination.timeToVisit || 'Year-round';
    const activities = destination.activities ? destination.activities.join(', ') : '';
    const significance = destination.significance || '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="${destination.name}" onerror="this.src='images/stock1.jpg'">
        </div>
        <div class="card-content">
            <h4>${flag} ${destination.name}</h4>
            ${location ? `<p class="location"><strong>Location:</strong> ${location}</p>` : ''}
            ${cities ? `<p class="cities"><strong>Cities:</strong> ${cities}</p>` : ''}
            <p class="description">${destination.description}</p>
            <p class="time-to-visit"><strong>Best Time to Visit:</strong> ${timeToVisit}</p>
            ${activities ? `<p class="activities"><strong>Activities:</strong> ${activities}</p>` : ''}
            ${significance ? `<p class="significance"><strong>Significance:</strong> ${significance}</p>` : ''}
        </div>
    `;
    
    return card;
}

function filterRecommendations(category) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const destinations = travelData[category] || [];
    
    if (destinations.length === 0) {
        recommendationsList.innerHTML = `<p>No ${category} recommendations available.</p>`;
        return;
    }
    
    destinations.forEach(destination => {
        const card = createDestinationCard(destination);
        recommendationsList.appendChild(card);
    });
}

function showAllRecommendations() {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn:last-child').classList.add('active');
    
    displayAllRecommendations();
}

function showRecommendations() {
    const recommendationsSection = document.getElementById('recommendations');
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
}

function searchDestinations() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayAllRecommendations();
        return;
    }
    
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    const allDestinations = [
        ...travelData.countries || [],
        ...travelData.temples || [],
        ...travelData.beaches || []
    ];
    
    const filteredDestinations = allDestinations.filter(destination => {
        return destination.name.toLowerCase().includes(searchTerm) ||
               destination.description.toLowerCase().includes(searchTerm) ||
               (destination.location && destination.location.toLowerCase().includes(searchTerm)) ||
               (destination.cities && destination.cities.some(city => city.toLowerCase().includes(searchTerm)));
    });
    
    if (filteredDestinations.length === 0) {
        recommendationsList.innerHTML = `<p>No destinations found matching "${searchTerm}". Try a different search term.</p>`;
        return;
    }
    
    filteredDestinations.forEach(destination => {
        const card = createDestinationCard(destination);
        recommendationsList.appendChild(card);
    });
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    displayAllRecommendations();
}

function displayErrorMessage() {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = `
        <div class="error-message">
            <p>Unable to load travel recommendations. Please try again later.</p>
            <button onclick="loadTravelData()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTravelData();
    
    // Add enter key support for search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDestinations();
            }
        });
    }
});

// Add some interactive features
function addToWishlist(destinationName) {
    // This could be expanded to save to localStorage or send to a backend
    alert(`${destinationName} has been added to your wishlist!`);
}

function shareDestination(destinationName) {
    // Simple share functionality
    if (navigator.share) {
        navigator.share({
            title: `Check out ${destinationName}`,
            text: `I found this amazing destination: ${destinationName}`,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`Check out ${destinationName} - ${window.location.href}`)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Unable to share. Please copy the URL manually.'));
    }
}