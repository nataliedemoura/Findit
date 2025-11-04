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

// Handle login with Firebase Auth
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        
        // Load user profile from Firestore
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            console.log('User profile loaded:', userDoc.data().name);
        }
        
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Invalid credentials: ' + error.message);
    }
}

// Handle signup with Firebase Auth
async function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const staffId = document.getElementById('signupStaffId').value;

    if (!name || !email || !password || !staffId) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Create Firebase Auth user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Store additional user data in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            staffId: staffId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('Account created successfully! Please login.');
        showLogin();
        
        // Clear form
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupStaffId').value = '';
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
}