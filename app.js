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

    // ----------------------------------------------------
    // Save Class to LocalStorage Logic
    // ----------------------------------------------------
    const addCourseBtns = document.querySelectorAll('.add-course-btn');
    if (addCourseBtns.length > 0) {
        addCourseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const btnIcon = btn.querySelector('i');
                
                // Visual feedback
                if (btnIcon && btnIcon.classList.contains('ph-plus')) {
                    btnIcon.classList.replace('ph-plus', 'ph-check');
                    btn.classList.add('added'); // optional for styling
                    // Directly apply style since we might not have 'added' class defined
                    btn.style.backgroundColor = 'var(--color-red)';
                    btnIcon.style.color = 'var(--color-white)';
                    
                    // Create course object
                    const courseData = {
                        code: btn.getAttribute('data-code'),
                        title: btn.getAttribute('data-title'),
                        time: btn.getAttribute('data-time'),
                        location: btn.getAttribute('data-location')
                    };
                    
                    // Save to localStorage
                    let savedClasses = JSON.parse(localStorage.getItem('savedClasses')) || [];
                    // Avoid duplicates
                    if (!savedClasses.some(c => c.title === courseData.title)) {
                        savedClasses.push(courseData);
                        localStorage.setItem('savedClasses', JSON.stringify(savedClasses));
                    }
                }
            });
        });
    }

    // ----------------------------------------------------
    // Render Saved Classes on For You Page
    // ----------------------------------------------------
    const classesListContainer = document.getElementById('your-classes-list');
    if (classesListContainer) {
        const savedClasses = JSON.parse(localStorage.getItem('savedClasses')) || [];
        
        if (savedClasses.length > 0) {
            // Clear default classes and render saved ones
            classesListContainer.innerHTML = '';
            
            savedClasses.forEach(course => {
                const formattedTime = course.time ? course.time.replace(' - ', ' -<br>') : '';
                const courseHTML = `
                    <div class="list-item">
                        <div class="list-item-left">
                            <h3 class="item-title">${course.title}</h3>
                            <p class="item-meta">${course.location}</p>
                        </div>
                        <div class="list-item-right">
                            <p class="item-time">${formattedTime}</p>
                        </div>
                    </div>
                `;
                classesListContainer.insertAdjacentHTML('beforeend', courseHTML);
            });
        }
    }

    // Join Club Logic
    const joinBtns = document.querySelectorAll('.join-btn:not(.modal-add-btn)');
    if (joinBtns.length > 0) {
        // Pre-check if already joined
        let savedClubs = JSON.parse(localStorage.getItem('savedClubs')) || [];
        joinBtns.forEach(btn => {
            const title = btn.getAttribute('data-title');
            if (savedClubs.some(c => c.title === title)) {
                btn.classList.add('joined');
                btn.textContent = 'Joined';
            }
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.classList.contains('joined')) return; // Already joined
                
                btn.classList.add('joined');
                btn.textContent = 'Joined';
                btn.style.backgroundColor = 'var(--color-grey-mid)';
                btn.style.color = 'var(--color-black)';
                
                const clubData = {
                    title: btn.getAttribute('data-title'),
                    location: btn.getAttribute('data-location'),
                    members: btn.getAttribute('data-members')
                };
                
                let saved = JSON.parse(localStorage.getItem('savedClubs')) || [];
                if (!saved.some(c => c.title === clubData.title)) {
                    saved.push(clubData);
                    localStorage.setItem('savedClubs', JSON.stringify(saved));
                }
            });
        });
    }

    // Render Saved Clubs on For You Page
    const clubsListContainer = document.getElementById('your-clubs-list');
    if (clubsListContainer) {
        const savedClubs = JSON.parse(localStorage.getItem('savedClubs')) || [];
        if (savedClubs.length > 0) {
            clubsListContainer.innerHTML = '';
            savedClubs.forEach(club => {
                const clubHTML = `
                    <div class="list-item">
                        <div class="list-item-left">
                            <h3 class="item-title">${club.title}</h3>
                            <p class="item-meta">${club.location}</p>
                        </div>
                        <div class="list-item-right">
                            <p class="item-time">Joined</p>
                        </div>
                    </div>
                `;
                clubsListContainer.insertAdjacentHTML('beforeend', clubHTML);
            });
        }
    }

    // Modal Variables
    const modal = document.getElementById('course-detail-modal');
    const closeBtn = document.getElementById('close-course-modal');
    const modalAddBtn = document.getElementById('modal-add-btn');

    if (modal) {
        const courseCards = document.querySelectorAll('.new-course-card');
        courseCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Ignore if clicked on add btn specifically
                if (e.target.closest('.add-course-btn')) return;

                const addBtn = card.querySelector('.add-course-btn');
                if (!addBtn) return;

                const codeRaw = card.querySelector('.course-code-box').innerHTML.replace('<br>', ' ');
                const title = addBtn.getAttribute('data-title');
                const time = addBtn.getAttribute('data-time');
                const location = addBtn.getAttribute('data-location');
                const desc = addBtn.getAttribute('data-desc') || 'A comprehensive course exploring the primary themes and methods related to this subject.';

                document.getElementById('modal-course-code').textContent = codeRaw;
                document.getElementById('modal-course-title').textContent = title;
                document.querySelector('#modal-course-time span').textContent = time;
                document.querySelector('#modal-course-location span').textContent = location;
                document.getElementById('modal-course-desc').textContent = desc;
                
                // Add button pass-through info
                modalAddBtn.setAttribute('data-code', codeRaw);
                modalAddBtn.setAttribute('data-title', title);
                modalAddBtn.setAttribute('data-time', time);
                modalAddBtn.setAttribute('data-location', location);
                
                modal.classList.remove('hidden');
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        // Add from modal
        if (modalAddBtn) {
            modalAddBtn.addEventListener('click', () => {
                const courseData = {
                    code: modalAddBtn.getAttribute('data-code'),
                    title: modalAddBtn.getAttribute('data-title'),
                    time: modalAddBtn.getAttribute('data-time'),
                    location: modalAddBtn.getAttribute('data-location')
                };
                let savedClasses = JSON.parse(localStorage.getItem('savedClasses')) || [];
                if (!savedClasses.some(c => c.title === courseData.title)) {
                    savedClasses.push(courseData);
                    localStorage.setItem('savedClasses', JSON.stringify(savedClasses));
                }
                modalAddBtn.textContent = 'ADDED!';
                modalAddBtn.classList.add('joined');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modalAddBtn.textContent = 'ADD TO YOUR CLASSES';
                    modalAddBtn.classList.remove('joined');
                }, 1000);
            });
        }
    }

});

// Toggle Advanced Search Form
window.toggleAdvancedSearch = function() {
    const form = document.getElementById('advancedSearchForm');
    if (form) {
        // We use inline style 'display' toggling instead of a CSS utility class because 
        // the initial 'none' state is hardcoded inline in the HTML to prevent a flash of content on load.
        if (form.style.display === 'none') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }
};
