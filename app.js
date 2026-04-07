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
    // Global Events Initialization (LocalStorage)
    // ----------------------------------------------------
    let globalEvents = JSON.parse(localStorage.getItem('tns_events_v3') || 'null');
    
    if (!globalEvents) {
        const mockDate = new Date();
        const yStr = mockDate.getFullYear();
        const mStr = String(mockDate.getMonth() + 1).padStart(2, '0');
        const dStr = String(mockDate.getDate()).padStart(2, '0');
        
        globalEvents = [
            { date: `${yStr}-${mStr}-15`, title: 'Design wireframes', time: '10:00-13:00', desc: 'Meowwww', isPublic: false },
            { date: `${yStr}-${mStr}-15`, title: 'Eat donuts', time: '13:00-14:00', desc: 'I like the twisty one', isPublic: false },
            { date: `${yStr}-${mStr}-22`, title: 'Review Frontend Design', time: '15:00-16:30', desc: 'Discussing component styling', isPublic: false },
            { 
                date: `${yStr}-${mStr}-${dStr}`, 
                title: 'Radiohead Ensemble Concert', 
                time: '3:00 PM', 
                desc: 'ALVIN JOHNSON/J.M. KAPLAN HALL', 
                isPublic: true,
                placeholderClass: 'placeholder-img-1',
                isSpecialGraphic: true
            },
            { 
                date: `${yStr}-${mStr}-${dStr}`, 
                title: 'Not Generated: An Adobe × Parsons Collaboration', 
                time: 'TBA', 
                desc: '', 
                isPublic: true,
                placeholderClass: 'placeholder-img-2'
            }
        ];

        const endOfSemester = new Date(2026, 4, 15);
        let iterDate = new Date(2026, 0, 1);
        while (iterDate <= endOfSemester) {
            const dayOfWeek = iterDate.getDay();
            const yearStr = iterDate.getFullYear();
            const monthStr = String(iterDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(iterDate.getDate()).padStart(2, '0');
            const dateString = `${yearStr}-${monthStr}-${dayStr}`;

            if (dayOfWeek === 2) { 
                globalEvents.push({ date: dateString, title: 'Software Engineering Applications', time: '10:00 - 11:40 AM', desc: '6 EAST 16TH STREET - ROOM 600', isPublic: false });
            } else if (dayOfWeek === 4) { 
                globalEvents.push({ date: dateString, title: 'Currents: Design as a Chance Operations', time: '12:10 AM - 2:50 PM', desc: 'PARSONS 2 W 13TH - ROOM 1111', isPublic: false });
            }
            iterDate.setDate(iterDate.getDate() + 1);
        }
        
        localStorage.setItem('tns_events_v3', JSON.stringify(globalEvents));
    }
    window.globalEvents = globalEvents;

    // ----------------------------------------------------
    // Calendar & Events Logic
    // ----------------------------------------------------
    const calendarGrid = document.getElementById('calendar-grid');
    const calMonthLabel = document.getElementById('cal-month');
    const calYearLabel = document.getElementById('cal-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const upcomingSessionsList = document.getElementById('upcoming-sessions-list');

    if (calendarGrid && calMonthLabel && calYearLabel) {
        // State
        let currentDate = new Date(); // Start with today
        let selectedDate = new Date(); // Track user selection

        const calendarEvents = window.globalEvents;

        const monthNames = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            // Set labels
            calMonthLabel.textContent = monthNames[month];
            calYearLabel.textContent = year;

            // Clear existing days (except headers)
            const dayHeaders = Array.from(calendarGrid.querySelectorAll('.cal-day-header'));
            calendarGrid.innerHTML = '';
            dayHeaders.forEach(header => calendarGrid.appendChild(header));

            // Calculate dates
            const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();

            // Adjust for Monday start (0=Sunday -> 6, 1=Monday -> 0, etc)
            let startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

            // Render Previous Month Days
            for (let i = startDayOffset - 1; i >= 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('cal-day', 'past');
                dayDiv.textContent = daysInPrevMonth - i;
                calendarGrid.appendChild(dayDiv);
            }

            // Render Current Month Days
            const today = new Date();
            for (let i = 1; i <= daysInMonth; i++) {
                const currentIterationDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('cal-day');
                dayDiv.textContent = i;
                
                // Add click listener
                dayDiv.addEventListener('click', () => {
                    selectedDate = new Date(year, month, i);
                    renderCalendar(); // Re-render to update outline
                    renderEvents();   // Update events list
                });

                // Check for current day highlighting (solid red)
                if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                    dayDiv.classList.add('active-red');
                }
                
                // Check if it's the selected day (outline red, unless it's today)
                if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && i === selectedDate.getDate()) {
                    if (!dayDiv.classList.contains('active-red')) {
                        dayDiv.classList.add('active-red', 'outline');
                    }
                }

                // Check for events
                const eventsForDay = calendarEvents.filter(e => e.date === currentIterationDateString);
                if (eventsForDay.length > 0) {
                    eventsForDay.forEach(() => {
                        const dotDiv = document.createElement('div');
                        dotDiv.classList.add('dot-indicator');
                        dayDiv.appendChild(dotDiv);
                    });
                }

                calendarGrid.appendChild(dayDiv);
            }

            // Render Next Month Days to fill grid
            const totalCellsSoFar = startDayOffset + daysInMonth;
            const remainingCells = 42 - totalCellsSoFar; // 6 rows * 7 days
            const cellsToAdd = remainingCells >= 7 ? remainingCells - 7 : remainingCells;
            
            for (let i = 1; i <= cellsToAdd; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('cal-day', 'past');
                dayDiv.textContent = i;
                calendarGrid.appendChild(dayDiv);
            }
        }

        function renderEvents() {
            if (!upcomingSessionsList) return;
            
            upcomingSessionsList.innerHTML = '';
            
            // Format selected date
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            // Get events
            const events = calendarEvents.filter(e => e.date === dateString);

            if (events.length === 0) {
                upcomingSessionsList.innerHTML = `<p style="text-align: center; color: var(--color-grey-dark); padding: var(--spacing-md) 0;">No sessions scheduled for this day.</p>`;
                return;
            }

            events.forEach((event, index) => {
                const isLast = index === events.length - 1;
                
                const card = document.createElement('div');
                card.className = `session-card ${isLast ? '' : 'border-bottom'}`;
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.more-btn')) return;
                    localStorage.setItem('tns_active_event', JSON.stringify(event));
                    window.location.href = 'event_details.html';
                });
                
                card.innerHTML = `
                    <div class="session-indicator red"></div>
                    <div class="session-details">
                        <p class="session-time">${event.time}</p>
                        <h3 class="session-title">${event.title}</h3>
                        <p class="session-desc">${event.desc}</p>
                    </div>
                    <button class="more-btn"><i class="ph ph-dots-three"></i></button>
                `;
                upcomingSessionsList.appendChild(card);
            });
            
            // Re-apply More button logic for dynamically added buttons
            const moreBtns = upcomingSessionsList.querySelectorAll('.more-btn');
            moreBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const icon = btn.querySelector('i');
                    if (icon.classList.contains('ph-dots-three')) {
                        icon.classList.replace('ph-dots-three', 'ph-check');
                        icon.style.color = 'var(--color-red)';
                    } else if (icon.classList.contains('ph-check')) {
                        icon.classList.replace('ph-check', 'ph-dots-three');
                        icon.style.color = 'var(--color-black)';
                    }
                });
            });
        }

        // Navigation listeners
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Add Event Modal Logic
        const addEventModal = document.getElementById('add-event-modal');
        const addNewBtns = document.querySelectorAll('.add-new-btn');
        const cancelEventBtn = document.getElementById('cancel-event-btn');
        const saveEventBtn = document.getElementById('save-event-btn');
        const titleInput = document.getElementById('event-title-input');
        const dateInput = document.getElementById('event-date-input');
        const timeInput = document.getElementById('event-time-input');
        const descInput = document.getElementById('event-desc-input');

        if (addEventModal) {
            addNewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    dateInput.value = `${year}-${month}-${day}`;
                    addEventModal.classList.add('active');
                });
            });

            cancelEventBtn.addEventListener('click', () => {
                addEventModal.classList.remove('active');
                titleInput.value = '';
                timeInput.value = '';
                descInput.value = '';
            });

            saveEventBtn.addEventListener('click', () => {
                if (!titleInput.value || !dateInput.value) return;

                calendarEvents.push({
                    date: dateInput.value,
                    title: titleInput.value,
                    time: timeInput.value || 'TBA',
                    desc: descInput.value || '',
                    isPublic: false
                });

                localStorage.setItem('tns_events_v3', JSON.stringify(calendarEvents));

                const [ey, em, ed] = dateInput.value.split('-');
                if (ey && em && ed) {
                    selectedDate = new Date(ey, em - 1, ed);
                    currentDate = new Date(ey, em - 1, 1);
                }

                addEventModal.classList.remove('active');
                titleInput.value = '';
                timeInput.value = '';
                descInput.value = '';

                renderCalendar();
                renderEvents();
            });
        }

        // Initial render
        renderCalendar();
        renderEvents();
    }

    // ----------------------------------------------------
    // Home Page Feed Logic
    // ----------------------------------------------------
    const homeEventFeed = document.getElementById('home-event-feed');
    if (homeEventFeed) {
        homeEventFeed.innerHTML = '';
        const today = new Date();
        const yStr = today.getFullYear();
        const mStr = String(today.getMonth() + 1).padStart(2, '0');
        const dStr = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yStr}-${mStr}-${dStr}`;

        // Get public events that are upcoming or today
        const publicEvents = window.globalEvents.filter(e => e.isPublic && e.date >= todayStr);
        
        // Sort chronologically
        publicEvents.sort((a,b) => a.date.localeCompare(b.date));

        if (publicEvents.length === 0) {
            homeEventFeed.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--color-grey-dark);">No public events happening soon.</p>`;
        } else {
            publicEvents.forEach(evt => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    localStorage.setItem('tns_active_event', JSON.stringify(evt));
                    window.location.href = 'event_details.html';
                });

                const [ey, em, ed] = evt.date.split('-');
                const eventDateObj = new Date(ey, em - 1, ed);
                const monthName = eventDateObj.toLocaleString('default', { month: 'long' });
                const dateDisplay = `${monthName} ${parseInt(ed)}`;

                let imageHtml = '';
                if (evt.image) {
                    imageHtml = `<div class="event-image" style="background:transparent;"><img src="${evt.image}" style="width:100%; height:100%; object-fit:cover;"></div>`;
                } else if (evt.placeholderClass) {
                    let internalSpan = evt.isSpecialGraphic ? `<span class="graphic-text">NOT<br>GEN<br>ERA<br>TED</span>` : '';
                    imageHtml = `<div class="event-image ${evt.placeholderClass}">${internalSpan}</div>`;
                } else {
                    imageHtml = `<div class="event-image placeholder-img-2"></div>`;
                }

                card.innerHTML = `
                    <div class="event-info">
                        <h3 class="event-title">${evt.title}</h3>
                        <p class="event-meta">${dateDisplay} | ${evt.desc || 'TBA'}</p>
                        <p class="event-time">${evt.time}</p>
                    </div>
                    ${imageHtml}
                `;
                homeEventFeed.appendChild(card);
            });
        }
    }

});
