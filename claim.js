let selectedClaimItem = null;
let isDrawing = false;
let signatureCanvas = null;
let signatureContext = null;

// Check if user is logged in
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// Display claim list
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

// Select claim item
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

// Signature drawing functions
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

// Switch ID type
function switchIdType() {
    const idType = document.querySelector('input[name="idType"]:checked').value;
    const label = document.getElementById('idLabel');
    
    if (idType === 'license') {
        label.textContent = "Driver's License / State ID Number";
    } else {
        label.textContent = "Student ID Number";
    }
}

// Validate ID number (basic validation)
function validateIdNumber() {
    const idNumber = document.getElementById('claimIdNumber').value;
    const validationMessage = document.getElementById('idValidationMessage');
    
    if (idNumber.length > 0 && idNumber.length < 5) {
        validationMessage.style.display = 'block';
    } else {
        validationMessage.style.display = 'none';
    }
}

// Close claim modal
function closeClaimModal(event) {
    if (!event || event.target === document.getElementById('claimModal')) {
        document.getElementById('claimModal').classList.add('hidden');
        document.getElementById('claimFirstName').value = '';
        document.getElementById('claimLastName').value = '';
        document.getElementById('claimIdNumber').value = '';
        selectedClaimItem = null;
    }
}

// Process claim
function processClaim() {
    const firstName = document.getElementById('claimFirstName').value;
    const lastName = document.getElementById('claimLastName').value;
    const idNumber = document.getElementById('claimIdNumber').value;
    
    if (!firstName || !lastName) {
        alert('Please enter first and last name');
        return;
    }
    
    if (!idNumber) {
        alert('Please enter your ID number');
        return;
    }

    // Check if signature is drawn
    const imageData = signatureContext.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
    const hasSignature = imageData.data.some(channel => channel !== 0);
    
    if (!hasSignature) {
        alert('Please provide your digital signature');
        return;
    }

    // Remove item from list
    items = items.filter(item => item.id !== selectedClaimItem.id);
    saveItems();
    
    alert(`Item claimed successfully!\n\nItem: ${selectedClaimItem.title}\nClaimed by: ${firstName} ${lastName}\nID: ${idNumber}`);
    
    document.getElementById('claimModal').classList.add('hidden');
    document.getElementById('claimFirstName').value = '';
    document.getElementById('claimLastName').value = '';
    document.getElementById('claimIdNumber').value = '';
    
    displayClaimList();
}

// Initialize claim page
window.onload = function() {
    checkAuth();
    displayClaimList();
};