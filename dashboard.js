// Check if user is logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize dashboard
window.onload = function() {
    const user = checkAuth();
    
    if (user) {
        document.getElementById('userName').textContent = user.name;
    }
};