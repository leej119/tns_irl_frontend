document.addEventListener('DOMContentLoaded', () => {
    // Determine the current page for navigation highlighting
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';

    // Bottom Navigation Interactions
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Let the link navigate normally if it has an href that isn't "#"
            if (item.getAttribute('href') && item.getAttribute('href') !== '#') {
                return;
            }

            e.preventDefault();
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Subtle pop animation
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.transform = 'translateY(-2px)';
            }, 100);
        });
    });

    // Quick Link Tab Interactions
    const quickTabs = document.querySelectorAll('.tab-link');
    quickTabs.forEach(tab => {
        // Tab visual confirmation before unloading page
        tab.addEventListener('click', (e) => {
            // Let the anchor tag do the real navigation
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = 'translateY(0)';
            }, 100);
        });
    });

    // Interaction for list item "More options" buttons
    const moreBtns = document.querySelectorAll('.more-btn');
    moreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = btn.querySelector('i');

            // simple visual toggle interaction
            if (icon.classList.contains('ph-dots-three')) {
                icon.classList.replace('ph-dots-three', 'ph-check');
                icon.style.color = 'var(--color-red)';
            } else if (icon.classList.contains('ph-check')) {
                icon.classList.replace('ph-check', 'ph-dots-three');
                icon.style.color = 'var(--color-black)';
            }
        });
    });

    // ----------------------------------------------------
    // Messages Dropdown Logic
    // ----------------------------------------------------
    const messageMoreBtns = document.querySelectorAll('.message-card .more-options-btn');
    const overlay = document.getElementById('dropdown-overlay');
    let activeDropdown = null;

    if (overlay) {
        // Toggle dropdowns on message item clicks
        messageMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = btn.nextElementSibling;

                // If clicking the currently open one, close it
                if (activeDropdown === dropdown) {
                    closeDropdowns();
                    return;
                }

                // Close any existing
                closeDropdowns();

                // Open new
                dropdown.classList.remove('hidden');
                overlay.classList.remove('hidden');
                activeDropdown = dropdown;
            });
        });

        // Close dropdown when clicking overlay
        overlay.addEventListener('click', closeDropdowns);

        function closeDropdowns() {
            if (activeDropdown) {
                activeDropdown.classList.add('hidden');
                activeDropdown = null;
            }
            overlay.classList.add('hidden');
        }
    }

    // ----------------------------------------------------
    // Report "Other" Radio Button Logic
    // ----------------------------------------------------
    const reportRadios = document.querySelectorAll('input[name="report_reason"]');
    const otherInputContainer = document.getElementById('other-input-container');

    if (reportRadios.length > 0 && otherInputContainer) {
        reportRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'other') {
                    // Show the text area
                    otherInputContainer.classList.remove('hidden');
                    // Focus the text area for UX
                    setTimeout(() => {
                        otherInputContainer.querySelector('textarea').focus();
                    }, 100);
                } else {
                    // Hide the text area
                    otherInputContainer.classList.add('hidden');
                }
            });
        });
    }

});
