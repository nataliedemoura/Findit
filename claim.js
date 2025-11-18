let selectedClaimItem = null;
let isDrawing = false;
let signatureCanvas = null;
let signatureContext = null;

// Display claim list
function displayClaimList() {
    const container = document.getElementById('claimItemsList');
    
    if (!container) return;
    
    // Filter out claimed items
    const unclaimedItems = items.filter(item => !item.claimed);
    
    if (unclaimedItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">No items available to claim</p>';
        return;
    }

    container.innerHTML = unclaimedItems.map(item => `
        <div class="claim-item" onclick="selectClaimItem('${item.id}')">
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
    
    selectedClaimItem = items.find(item => item.id === itemId || item.id == itemId);
    
    if (!selectedClaimItem) {
        console.error('Item not found:', itemId);
        alert('Error: Could not find selected item');
        return;
    }
    
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

// Validate ID number
function validateIdNumber() {
    const idNumber = document.getElementById('claimIdNumber').value;
    const validationMessage = document.getElementById('idValidationMessage');
    
    if (validationMessage) {
        if (idNumber.length > 0 && idNumber.length < 5) {
            validationMessage.style.display = 'block';
        } else {
            validationMessage.style.display = 'none';
        }
    }
}

// Close claim modal
function closeClaimModal(event) {
    if (!event || event.target === document.getElementById('claimModal')) {
        document.getElementById('claimModal').classList.add('hidden');
        const firstName = document.getElementById('claimFirstName');
        const lastName = document.getElementById('claimLastName');
        const idNumber = document.getElementById('claimIdNumber');
        
        if (firstName) firstName.value = '';
        if (lastName) lastName.value = '';
        if (idNumber) idNumber.value = '';
        
        selectedClaimItem = null;
    }
}

// Process claim with Firestore
async function processClaim() {
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

    try {
        // Save claim record to Firestore
        await db.collection('claims').add({
            itemId: selectedClaimItem.id,
            itemTitle: selectedClaimItem.title,
            claimedBy: currentUser ? currentUser.uid : 'anonymous',
            claimerEmail: currentUser ? currentUser.email : 'unknown',
            firstName: firstName,
            lastName: lastName,
            idNumber: idNumber,
            claimedAt: firebase.firestore.FieldValue.serverTimestamp(),
            signature: signatureCanvas.toDataURL()
        });

        // Mark item as claimed instead of deleting
        await db.collection('items').doc(selectedClaimItem.id).update({
            claimed: true,
            claimedBy: currentUser ? currentUser.uid : 'anonymous',
            claimedByName: `${firstName} ${lastName}`,
            claimedAt: firebase.firestore.FieldValue.serverTimestamp(),
            claimerId: idNumber
        });
        
        alert(`Item claimed successfully!\n\nItem: ${selectedClaimItem.title}\nClaimed by: ${firstName} ${lastName}\nID: ${idNumber}`);
        
        document.getElementById('claimModal').classList.add('hidden');
        document.getElementById('claimFirstName').value = '';
        document.getElementById('claimLastName').value = '';
        document.getElementById('claimIdNumber').value = '';
        
        // Reload items
        await loadItemsFromFirestore();
        displayClaimList();
    } catch (error) {
        console.error('Error claiming item:', error);
        alert('Failed to process claim: ' + error.message);
    }
}

// Initialize claim page
window.onload = async function() {
    await checkAuth();
    await loadItemsFromFirestore();
    displayClaimList();
};
