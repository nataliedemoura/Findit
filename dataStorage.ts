    <script>

   // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSeMIZ3OBwArgmZHYWpthMoY2gHlx4j2U",
  authDomain: "it-capstone-e5fd1.firebaseapp.com",
  projectId: "it-capstone-e5fd1",
  storageBucket: "it-capstone-e5fd1.firebasestorage.app",
  messagingSenderId: "1008409958623",
  appId: "1:1008409958623:web:8ca6af3c63b56e0185b16a",
  measurementId: "G-BYHJVS9RRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Make Firestore, Auth, and Storage available globally
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        window.storage = firebase.storage();

        // Data storage
       // NEW - Load from Firestore
let items = [];

window.onload = async function() {
    showPage('home');
    await loadItemsFromFirestore();
    displayItems(items);
};

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('User logged in:', user.email);
        
        // Load user profile from Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                document.getElementById('userName').textContent = userDoc.data().name;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    } else {
        currentUser = null;
        console.log('User logged out');
    }
});

async function loadItemsFromFirestore() {
    try {
        const snapshot = await db.collection('items').orderBy('date', 'desc').get();
        items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Failed to load items from database');
    }
}

        window.onload = function() {
    showPage('home');
    displayItems(items);
};

        let users = [
            {
                name: 'Admin User',
                email: 'admin@umb.edu',
                password: 'admin123',
                staffId: 'STAFF001'
            }
        ];

        let currentUser = null;
        let selectedClaimItem = null;
        let uploadedImage = null;

        // Signature pad variables
        let isDrawing = false;
        let signatureCanvas = null;
        let signatureContext = null;

        // Initialize
        window.onload = function() {
            showPage('home');
            displayItems(items);
        };

        // Page navigation
        function showPage(pageName) {
            const pages = ['homePage', 'loginPage', 'dashboardPage', 'uploadPage', 'claimListPage', 'contactPage', 'pickupPage'];
            pages.forEach(page => {
                document.getElementById(page).classList.add('hidden');
            });
            
            document.getElementById(pageName + 'Page').classList.remove('hidden');
            
            if (pageName === 'home') {
                displayItems(items);
            }
        }

        // Authentication functions
        function showLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('signupForm').classList.add('hidden');
        }

        function showSignup() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.remove('hidden');
        }

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
            document.getElementById('userName').textContent = userDoc.data().name;
        } else {
            document.getElementById('userName').textContent = email.split('@')[0];
        }
        
        showPage('dashboard');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } catch (error) {
        console.error('Login error:', error);
        alert('Invalid credentials: ' + error.message);
    }
}

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

async function handleLogout() {
    try {
        await auth.signOut();
        currentUser = null;
        showPage('home');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}
        // Display items
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

        // Upload functionality
        function showUploadForm() {
            showPage('upload');
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImage = e.target.result;
                    document.getElementById('imagePreview').src = uploadedImage;
                    document.getElementById('imagePreview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        // Drag and drop for file upload
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        uploadedImage = event.target.result;
                        document.getElementById('imagePreview').src = uploadedImage;
                        document.getElementById('imagePreview').classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        async function submitUpload() {
    const category = document.getElementById('uploadCategory').value;
    const title = document.getElementById('uploadTitle').value;
    const description = document.getElementById('uploadDescription').value;
    const location = document.getElementById('uploadLocation').value;
    const date = document.getElementById('uploadDate').value;

    if (!category || !title || !description || !location || !date) {
        alert('Please fill in all fields');
        return;
    }

    const newItem = {
        type: 'found',
        category,
        title,
        description,
        location,
        date,
        image: uploadedImage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Save to Firestore
        await db.collection('items').add(newItem);
        
        alert('Item posted successfully!');
        
        // Reload items from Firestore
        await loadItemsFromFirestore();
        displayItems(items);
        
        // Clear form
        document.getElementById('uploadCategory').value = '';
        document.getElementById('uploadTitle').value = '';
        document.getElementById('uploadDescription').value = '';
        document.getElementById('uploadLocation').value = '';
        document.getElementById('uploadDate').value = '';
        document.getElementById('imagePreview').classList.add('hidden');
        uploadedImage = null;
        
        showPage('dashboard');
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item');
    }
}

        // Claim functionality
        function showClaimList() {
            showPage('claimList');
            displayClaimList();
        }

        function displayClaimList() {
            const container = document.getElementById('claimItemsList');
            
            if (items.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #6b7280;">No items available to claim</p>';
                return;
            }

            container.innerHTML = items.map(item => `
                <div class="claim-item" onclick="selectClaimItem(${item.id})">
                    ${item.image ? `<img src="${item.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">` : ''}
                    <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${item.title}</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.25rem;">${item.category} - ${item.location}</p>
                    <p style="color: #4b5563; font-size: 0.875rem;">${item.description}</p>
                </div>
            `).join('');
        }

        function selectClaimItem(itemId) {
            // Remove selection from all items
            document.querySelectorAll('.claim-item').forEach(el => el.classList.remove('selected'));
            
            // Add selection to clicked item
            event.target.closest('.claim-item').classList.add('selected');
            
            selectedClaimItem = items.find(item => item.id === itemId);
            
            // Show claim modal
            document.getElementById('claimModal').classList.remove('hidden');
            
            // Initialize signature pad
            signatureCanvas = document.getElementById('signaturePad');
            signatureContext = signatureCanvas.getContext('2d');
            signatureContext.strokeStyle = '#000';
            signatureContext.lineWidth = 2;
            
            // Set up signature pad events
            signatureCanvas.addEventListener('mousedown', startDrawing);
            signatureCanvas.addEventListener('mousemove', draw);
            signatureCanvas.addEventListener('mouseup', stopDrawing);
            signatureCanvas.addEventListener('mouseout', stopDrawing);
            
            // Touch events for mobile
            signatureCanvas.addEventListener('touchstart', handleTouchStart);
            signatureCanvas.addEventListener('touchmove', handleTouchMove);
            signatureCanvas.addEventListener('touchend', stopDrawing);
        }

        function startDrawing(e) {
            isDrawing = true;
            const rect = signatureCanvas.getBoundingClientRect();
            signatureContext.beginPath();
            signatureContext.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function draw(e) {
            if (!isDrawing) return;
            const rect = signatureCanvas.getBoundingClientRect();
            signatureContext.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            signatureContext.stroke();
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function handleTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            isDrawing = true;
            signatureContext.beginPath();
            signatureContext.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        }

        function handleTouchMove(e) {
            e.preventDefault();
            if (!isDrawing) return;
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            signatureContext.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            signatureContext.stroke();
        }

        function clearSignature() {
            signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }

        function closeClaimModal(event) {
            if (!event || event.target === document.getElementById('claimModal')) {
                document.getElementById('claimModal').classList.add('hidden');
                document.getElementById('claimIdNumber').value = '';
                selectedClaimItem = null;
            }
        }

        async function processClaim() {
    const idNumber = document.getElementById('claimIdNumber').value;
    
    if (!idNumber) {
        alert('Please enter your ID number');
        return;
    }

    const imageData = signatureContext.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
    const hasSignature = imageData.data.some(channel => channel !== 0);
    
    if (!hasSignature) {
        alert('Please provide your digital signature');
        return;
    }

    try {
        // Delete from Firestore
        await db.collection('items').doc(selectedClaimItem.id).delete();
        
        alert(`Item claimed successfully!\n\nItem: ${selectedClaimItem.title}\nID: ${idNumber}`);
        
        document.getElementById('claimModal').classList.add('hidden');
        document.getElementById('claimIdNumber').value = '';
        
        // Reload items
        await loadItemsFromFirestore();
        displayClaimList();
    } catch (error) {
        console.error('Error claiming item:', error);
        alert('Failed to process claim');
    }
}
    </script>