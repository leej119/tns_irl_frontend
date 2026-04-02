function navTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    // Show the targeted screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    // Handle safari bar visibility
    const safariBar = document.getElementById('safari-bar');
    if (['screen-3', 'screen-4', 'screen-6'].includes(screenId)) {
        safariBar.style.display = 'flex';
    } else {
        safariBar.style.display = 'none';
    }

    // Scroll to top of browser content
    if (target) {
        const content = target.querySelector('.browser-content');
        if (content) content.scrollTop = 0;
    }
}

function togglePasswordVisibility(inputId, checkboxId) {
    const pwdInput = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);
    if (pwdInput && checkbox) {
        if (checkbox.checked) {
            pwdInput.type = 'text';
        } else {
            pwdInput.type = 'password';
        }
    }
}

function toggleGeneralInputState(inputId, wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    const input = document.getElementById(inputId);
    if (input && wrapper) {
        if (input.value.length > 0) {
            wrapper.classList.add('focus');
        } else {
            wrapper.classList.remove('focus');
        }
    }
}

// Initialize state on load
document.addEventListener('DOMContentLoaded', () => {
    navTo('screen-1'); // explicitly force the Get Started screen to be the first one
    toggleGeneralInputState('password-input', 'password-wrapper');
    toggleGeneralInputState('username-input', 'username-wrapper');
    toggleGeneralInputState('password-native-input', 'password-native-wrapper');
});
