// Show login form
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
}

// Show signup form
function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials. Try email: admin@umb.edu, password: admin123');
    }
}

// Handle signup
function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const staffId = document.getElementById('signupStaffId').value;

    if (!name || !email || !password || !staffId) {
        alert('Please fill in all fields');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }

    const newUser = { name, email, password, staffId };
    users.push(newUser);
    saveUsers();
    
    alert('Account created successfully! Please login.');
    showLogin();
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupStaffId').value = '';
}