document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE STATIC INPUT MASKS
    const phoneInput = document.getElementById('phone');
    if (phoneInput) IMask(phoneInput, { mask: '(000) 000-0000' });

    const postalInput = document.getElementById('postalCode');
    if (postalInput) IMask(postalInput, { mask: 'a0a 0a0', prepare: str => str.toUpperCase() });

    const mileageInput = document.getElementById('mileage');
    if (mileageInput) IMask(mileageInput, { mask: Number, thousandsSeparator: ',' });

    // 2. DYNAMIC CONTACT ROWS
    const addContactBtn = document.getElementById('addContactBtn');
    const container = document.getElementById('additionalContactsContainer');

    if (addContactBtn && container) {
        addContactBtn.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'row g-2 mt-2 align-items-center additional-contact-row';
            row.innerHTML = `
                <div class="col-md-3">
                    <select name="contactType" class="form-select text-muted">
                        <option value="Phone">Phone</option>
                        <option value="Email">Email</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" name="contactLabel" class="form-control" placeholder="Label (e.g. Wife's Cell)">
                </div>
                <div class="col-md-5">
                    <input type="text" name="contactValue" class="form-control dynamic-value" placeholder="Number or Address" required>
                </div>
                <div class="col-md-1 text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm remove-contact" title="Remove"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
            container.appendChild(row);

            const select = row.querySelector('select');
            const input = row.querySelector('.dynamic-value');
            let mask = IMask(input, { mask: '(000) 000-0000' });

            select.addEventListener('change', (e) => {
                if (e.target.value === 'Email') {
                    if (mask) mask.destroy();
                    input.value = '';
                    input.placeholder = 'Email Address';
                } else {
                    input.value = '';
                    input.placeholder = 'Phone Number';
                    mask = IMask(input, { mask: '(000) 000-0000' });
                }
            });

            row.querySelector('.remove-contact').addEventListener('click', () => row.remove());
        });
    }

    // 3. TAB LOCKING LOGIC
    const fName = document.getElementById('firstName');
    const lName = document.getElementById('lastName');
    const phone = document.getElementById('phone');
    const nextBtn = document.getElementById('nextVehicleBtn');
    const vehicleTab = document.getElementById('vehicle-tab');

    function checkValidation() {
        if (!fName || !lName || !phone) return;
        const phoneDigits = phone.value.replace(/\D/g, '');
        const isValid = fName.value.trim() !== '' && lName.value.trim() !== '' && phoneDigits.length >= 10;
        
        if (nextBtn) nextBtn.disabled = !isValid;
        if (vehicleTab) {
            if (isValid) vehicleTab.classList.remove('disabled');
            else vehicleTab.classList.add('disabled');
        }
    }

    if (fName) fName.addEventListener('input', checkValidation);
    if (lName) lName.addEventListener('input', checkValidation);
    if (phone) phone.addEventListener('input', checkValidation);
    checkValidation();

    // 4. SUBMIT ANIMATION
    const form = document.getElementById('intakeForm');
    if (form) {
        form.addEventListener('submit', () => {
            const btn = document.getElementById('submitIntakeBtn');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Saving Intake...';
            }
        });
    }
});

// 5. THE OMNI-DECODER
async function decodeVin() {
    const vinInput = document.getElementById('vinInput');
    const vin = vinInput.value.trim();
    
    // AUDIT FIX: Swapped alert for customAlert
    if (vin.length < 11) return window.customAlert ? customAlert('Please enter a valid VIN.', 'warning') : alert('Please enter a valid VIN.');

    const btn = document.getElementById('decodeVinBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const response = await fetch(`/vehicles/api/decode/${vin}`);
        const result = await response.json();

        if (result.success && result.data.make) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el && val) el.value = val;
            };

            setVal('makeInput', result.data.make);
            setVal('modelInput', result.data.model);
            setVal('yearInput', result.data.year);
            setVal('engineSize', result.data.engineSize);
            setVal('transmission', result.data.transmission);
            setVal('drivetrain', result.data.drivetrain);
            setVal('fuelType', result.data.fuelType);
            setVal('bodyStyle', result.data.bodyStyle);
            setVal('weightClass', result.data.weightClass);
            
            const preview = document.getElementById('vehicleImagePreview');
            const placeholder = document.getElementById('imagePlaceholder');
            const imageUrlInput = document.getElementById('imageUrlInput');

            if (result.data.imageUrl) {
                if (imageUrlInput) imageUrlInput.value = result.data.imageUrl;
                if (preview) {
                    preview.src = result.data.imageUrl;
                    preview.style.display = 'inline-block';
                }
                if (placeholder) placeholder.style.display = 'none';
            }
        } else {
            // AUDIT FIX: Swapped alert for customAlert
            window.customAlert ? customAlert('Could not decode VIN. Please enter details manually.', 'error') : alert('Could not decode VIN.');
        }
    } catch (error) {
        console.error('Decoding error:', error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}