document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    // --- Create Post Modal ---
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const toggleModal = (show) => {
        if (!createPostModal) return; // Exit if modal not found

        if (show) {
            createPostModal.classList.remove('hidden');
            body.classList.add('no-scroll');
            createPostModal.setAttribute('aria-hidden', 'false');
            // Store the element that triggered the modal
            lastFocusedElement = document.activeElement; 
            // Set focus to the first focusable element inside the modal
            setTimeout(() => { // Timeout to ensure modal is visible and focusable elements are rendered
                const focusableElements = createPostModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                firstFocusableElement = focusableElements[0];
                lastFocusableElement = focusableElements[focusableElements.length - 1];
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }, 100); 
        } else {
            createPostModal.classList.add('hidden');
            body.classList.remove('no-scroll');
            createPostModal.setAttribute('aria-hidden', 'true');
            // Restore focus to the element that triggered the modal
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null; // Clear stored element
            }
        }
    };
    
    let lastFocusedElement;
    let firstFocusableElement;
    let lastFocusableElement;

    // Trap focus inside the modal
    createPostModal.addEventListener('keydown', function(e) {
        const isTabPressed = (e.key === 'Tab');

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift key pressed for shift + tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus to the last focusable element
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus(); // add focus to the first focusable element
                e.preventDefault();
            }
        }
    });

    if (createPostBtn) {
         createPostBtn.addEventListener('click', () => toggleModal(true));
    }
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => toggleModal(false));
    }
    if(createPostModal){
         createPostModal.addEventListener('click', (e) => {
            if (e.target === createPostModal) {
                toggleModal(false);
            }
        });
    }

    // --- Like Button ---
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            btn.classList.toggle('liked');
            icon.classList.toggle('far'); // regular
            icon.classList.toggle('fas'); // solid
        });
    });

    // --- Friend Request ---
    document.querySelectorAll('.friend-request-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.friend-request-card');
            if (card) {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, margin 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.marginBottom = `-${card.offsetHeight}px`;
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
        });
    });

    // Initialize AOS
    AOS.init({
        duration: 800, // duration of the animation
        once: true,    // whether animation should happen only once - while scrolling down
    });
});