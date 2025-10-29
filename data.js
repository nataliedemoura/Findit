// Sample data storage (in a production app, this would be in Firebase)
let items = [
    {
        id: 1,
        type: 'found',
        category: 'Electronics',
        title: 'iPhone 13 Pro',
        description: 'Black iPhone 13 Pro with cracked screen protector',
        location: 'Campus Center',
        date: '2025-10-10',
        image: null
    },
    {
        id: 2,
        type: 'found',
        category: 'Keys',
        title: 'Set of keys with blue keychain',
        description: 'Found a set of keys with a blue UMass Boston keychain attached',
        location: 'Healey Library',
        date: '2025-10-12',
        image: null
    }
];

let users = [
    {
        name: 'Admin User',
        email: 'admin@umb.edu',
        password: 'admin123',
        staffId: 'STAFF001'
    }
];

// Get items from localStorage if available
function loadItems() {
    const storedItems = localStorage.getItem('findit_items');
    if (storedItems) {
        items = JSON.parse(storedItems);
    }
}

// Save items to localStorage
function saveItems() {
    localStorage.setItem('findit_items', JSON.stringify(items));
}

// Get users from localStorage if available
function loadUsers() {
    const storedUsers = localStorage.getItem('findit_users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('findit_users', JSON.stringify(users));
}

// Initialize data
loadItems();
loadUsers();