document.addEventListener('DOMContentLoaded', () => {

    // 1. OVERRIDE GENERIC ALERTS (Replaces standard alert('message'))
    // Usage: customAlert('Invalid VIN!', 'error');
    window.customAlert = function(message, iconType = 'info') {
        Swal.fire({
            text: message,
            icon: iconType,
            confirmButtonColor: 'var(--shop-primary)', // Uses your custom shop theme color
            confirmButtonText: 'Got it'
        });
    };

    // 2. INTERCEPT INLINE FORMS (e.g., Settings "Delete Canned Job" form)
    document.querySelectorAll('form[data-confirm]').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the form from submitting immediately
            
            const message = this.getAttribute('data-confirm');
            
            Swal.fire({
                title: 'Are you sure?',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--shop-primary)', 
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, proceed',
                reverseButtons: true // Puts "Cancel" on the left, "Confirm" on the right
            }).then((result) => {
                if (result.isConfirmed) {
                    this.removeAttribute('data-confirm'); // Prevent infinite loop
                    this.submit(); // Actually submit the form
                }
            });
        });
    });

    // 3. INTERCEPT BUTTONS THAT TRIGGER HIDDEN FORMS (e.g., User Edit "Revoke Access" button)
    document.querySelectorAll('button[data-confirm-target]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const message = this.getAttribute('data-confirm-message');
            const targetFormId = this.getAttribute('data-confirm-target');
            
            Swal.fire({
                title: 'Are you sure?',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--shop-primary)',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, proceed',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById(targetFormId).submit();
                }
            });
        });
    });
});