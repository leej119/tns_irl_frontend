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
            } else {
                icon.classList.replace('ph-check', 'ph-dots-three');
                icon.style.color = 'var(--color-black)';
            }
        });
    });
});
