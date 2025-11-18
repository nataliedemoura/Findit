let uploadedImage = null;
let cameraStream = null;
let capturedPhotoBlob = null;

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            document.getElementById('imagePreview').src = uploadedImage;
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('clearPhotoBtn').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Clear photo - THIS FUNCTION WAS MISSING!
function clearPhoto() {
    uploadedImage = null;
    capturedPhotoBlob = null; // Clear camera blob too
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreview').classList.add('hidden');
    const clearBtn = document.getElementById('clearPhotoBtn');
    if (clearBtn) clearBtn.classList.add('hidden');
    document.getElementById('fileInput').value = '';
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
        // CHECK CAMERA PHOTO FIRST!
        if (capturedPhotoBlob) {
            // Upload captured camera photo (blob)
            const storageRef = storage.ref(`items/${Date.now()}_camera_photo.jpg`);
            const snapshot = await storageRef.put(capturedPhotoBlob);
            imageUrl = await snapshot.ref.getDownloadURL();
            console.log('Camera photo uploaded:', imageUrl);
        } else if (document.getElementById('fileInput').files[0]) {
            // Upload file from file input
            const imageFile = document.getElementById('fileInput').files[0];
            const storageRef = storage.ref(`items/${Date.now()}_${imageFile.name}`);
            const snapshot = await storageRef.put(imageFile);
            imageUrl = await snapshot.ref.getDownloadURL();
            console.log('File uploaded:', imageUrl);
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
        clearPhoto();
        
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
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('uploadDate').value = today;
};

/* ===== CAMERA FUNCTIONS FOR UPLOAD PAGE ===== */

// Open camera modal
async function openCamera() {
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('photoCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const usePhotoBtn = document.getElementById('usePhotoBtn');

    modal.classList.remove('hidden');

    // Reset UI
    video.classList.remove('hidden');
    canvas.classList.add('hidden');
    captureBtn.classList.remove('hidden');
    retakeBtn.classList.add('hidden');
    usePhotoBtn.classList.add('hidden');

    try {
        // Request camera access with back camera preference on mobile
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();
    } catch (err) {
        console.error('Camera error:', err);
        alert('Could not access your camera. Please check permissions or use "Upload from Files" instead.');
        closeCameraModal();
    }
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('photoCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const usePhotoBtn = document.getElementById('usePhotoBtn');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
        capturedPhotoBlob = blob;
        console.log('Photo captured:', (blob.size / 1024).toFixed(2) + 'KB');
    }, 'image/jpeg', 0.95);

    // Switch UI
    video.classList.add('hidden');
    canvas.classList.remove('hidden');
    captureBtn.classList.add('hidden');
    retakeBtn.classList.remove('hidden');
    usePhotoBtn.classList.remove('hidden');
}

// Retake photo
function retakePhoto() {
    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('photoCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const usePhotoBtn = document.getElementById('usePhotoBtn');

    video.classList.remove('hidden');
    canvas.classList.add('hidden');
    captureBtn.classList.remove('hidden');
    retakeBtn.classList.add('hidden');
    usePhotoBtn.classList.add('hidden');

    capturedPhotoBlob = null;
}

// Use captured photo
function usePhoto() {
    if (!capturedPhotoBlob) {
        alert('No photo captured.');
        return;
    }

    const preview = document.getElementById('imagePreview');
    const clearBtn = document.getElementById('clearPhotoBtn');
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        if (clearBtn) clearBtn.classList.remove('hidden');
    };

    reader.readAsDataURL(capturedPhotoBlob);
    closeCameraModal();
}

// Close camera modal
function closeCameraModal(event) {
    const modal = document.getElementById('cameraModal');

    // If clicked inside modal content, ignore
    if (event && event.target !== modal) return;

    if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
        cameraStream = null;
    }

    modal.classList.add('hidden');
}