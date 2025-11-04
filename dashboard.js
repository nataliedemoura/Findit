// Handle logout
async function handleLogout() {
    try {
        await auth.signOut();
        currentUser = null;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

// Initialize dashboard
window.onload = async function() {
    await checkAuth();
};