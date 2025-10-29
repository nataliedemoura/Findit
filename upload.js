let uploadedImage = null;

// Check if user is logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

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

// Submit upload
function submitUpload() {
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
        id: Date.now(),
        type: 'found',
        category,
        title,
        description,
        location,
        date,
        image: uploadedImage
    };

    items.unshift(newItem);
    saveItems();
    
    alert('Item posted successfully!');
    
    // Clear form
    document.getElementById('uploadCategory').value = '';
    document.getElementById('uploadTitle').value = '';
    document.getElementById('uploadDescription').value = '';
    document.getElementById('uploadLocation').value = '';
    document.getElementById('uploadDate').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    uploadedImage = null;
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Initialize upload page
window.onload = function() {
    checkAuth();
    setupDragAndDrop();
};