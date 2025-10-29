// Display items on home page
function displayItems(itemsToDisplay) {
    const container = document.getElementById('itemsContainer');
    const itemCount = document.getElementById('itemCount');
    
    itemCount.textContent = itemsToDisplay.length;
    
    if (itemsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="no-items" style="grid-column: 1 / -1;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem; color: #9ca3af;">
                    <path d="m7.5 4.27 9 5.15"></path>
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <path d="m3.3 7 8.7 5 8.7-5"></path>
                    <path d="M12 22V12"></path>
                </svg>
                <p>No items found matching your search.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = itemsToDisplay.map(item => `
        <div class="item-card">
            ${item.image ? `<img src="${item.image}" class="item-image" alt="${item.title}">` : ''}
            <div class="item-header">
                <span class="item-badge badge-found">FOUND</span>
                <span class="item-category">${item.category}</span>
            </div>
            
            <h4 class="item-title">${item.title}</h4>
            <p class="item-description">${item.description}</p>
            
            <div class="item-details">
                <div class="detail-row">
                    <svg class="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${item.location}</span>
                </div>
                <div class="detail-row">
                    <svg class="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <span>${item.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter items based on search
function filterItems() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchQuery) {
        displayItems(items);
        return;
    }
    
    const filtered = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery) ||
        item.location.toLowerCase().includes(searchQuery)
    );
    
    displayItems(filtered);
}

// Initialize home page
window.onload = function() {
    displayItems(items);
};