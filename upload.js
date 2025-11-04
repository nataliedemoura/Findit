let uploadedImage = null;

// Handle file selection
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

// Setup drag and drop
function setupDragAndDrop() {
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
}

// Submit upload to Firestore
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

    let imageUrl = null;

    try {
        // Upload image to Firebase Storage if present
        const fileInput = document.getElementById('fileInput');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const imageFile = fileInput.files[0];
            const storageRef = storage.ref(`items/${Date.now()}_${imageFile.name}`);
            const snapshot = await storageRef.put(imageFile);
            imageUrl = await snapshot.ref.getDownloadURL();
            console.log('Image uploaded:', imageUrl);
        }

        const newItem = {
            type: 'found',
            category,
            title,
            description,
            location,
            date,
            image: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: currentUser ? currentUser.uid : 'anonymous'
        };

        // Save to Firestore
        await db.collection('items').add(newItem);
        
        alert('Item posted successfully!');
        
        // Clear form
        document.getElementById('uploadCategory').value = '';
        document.getElementById('uploadTitle').value = '';
        document.getElementById('uploadDescription').value = '';
        document.getElementById('uploadLocation').value = '';
        document.getElementById('uploadDate').value = '';
        document.getElementById('imagePreview').classList.add('hidden');
        if (fileInput) fileInput.value = '';
        uploadedImage = null;
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item: ' + error.message);
    }
}

// Initialize upload page
window.onload = async function() {
    await checkAuth();
    setupDragAndDrop();
};