// ===== AUTHENTICATION JAVASCRIPT =====

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth functionality based on current page
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login.html')) {
        initializeLoginForm();
    } else if (currentPage.includes('register.html')) {
        initializeRegisterForm();
    }
    
    // Initialize common auth functionality
    initializePasswordToggles();
    initializeFormValidation();
});

// ===== LOGIN FORM =====
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', handleLogin);
    
    // Real-time validation
    const identifier = document.getElementById('loginIdentifier');
    const password = document.getElementById('loginPassword');
    
    identifier.addEventListener('input', () => validateLoginIdentifier(identifier.value));
    password.addEventListener('input', () => validateLoginPassword(password.value));
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        identifier: formData.get('identifier').trim(),
        password: formData.get('password'),
        rememberMe: formData.get('rememberMe') === 'on'
    };
    
    // Validate form
    if (!validateLoginForm(loginData)) {
        return;
    }
    
    // Show loading state
    showLoadingState('loginBtn');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Login successful! Redirecting...', 'success');
            
            // Store token
            const storage = loginData.rememberMe ? localStorage : sessionStorage;
            storage.setItem('authToken', result.token);
            storage.setItem('user', JSON.stringify(result.user));
            
            // Redirect based on role
            setTimeout(() => {
                if (result.user.role === 'Admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
        } else {
            showAlert(result.message || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoadingState('loginBtn');
    }
}

// ===== REGISTER FORM =====
function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', handleRegister);
    
    // Real-time validation
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    username.addEventListener('input', (e) => validateUsername(e.target.value));
    email.addEventListener('input', (e) => validateEmail(e.target.value));
    password.addEventListener('input', (e) => {
        validatePassword(e.target.value);
        updatePasswordStrength(e.target.value);
        if (confirmPassword.value) {
            validatePasswordMatch(password.value, confirmPassword.value);
        }
    });
    confirmPassword.addEventListener('input', (e) => {
        validatePasswordMatch(password.value, e.target.value);
    });
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const registerData = {
        username: formData.get('username').trim(),
        email: formData.get('email').trim().toLowerCase(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role'),
        agreeTerms: formData.get('agreeTerms') === 'on'
    };
    
    // Validate form
    if (!validateRegisterForm(registerData)) {
        return;
    }
    
    // Show loading state
    showLoadingState('registerBtn');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Account created successfully! Redirecting to login...', 'success');
            
            // Clear form
            document.getElementById('registerForm').reset();
            clearPasswordStrength();
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(result.message || 'Registration failed. Please try again.', 'error');
            
            // Show specific field errors
            if (result.errors) {
                result.errors.forEach(error => {
                    showFieldError(error.field, error.message);
                });
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
        hideLoadingState('registerBtn');
    }
}

// ===== FORM VALIDATION =====
function validateLoginForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    if (!validateLoginIdentifier(data.identifier)) {
        isValid = false;
    }
    
    if (!validateLoginPassword(data.password)) {
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    if (!validateUsername(data.username)) isValid = false;
    if (!validateEmail(data.email)) isValid = false;
    if (!validatePassword(data.password)) isValid = false;
    if (!validatePasswordMatch(data.password, data.confirmPassword)) isValid = false;
    if (!validateRole(data.role)) isValid = false;
    if (!validateTerms(data.agreeTerms)) isValid = false;
    
    return isValid;
}

function validateLoginIdentifier(identifier) {
    if (!identifier) {
        showFieldError('identifier', 'Email or username is required');
        return false;
    }
    
    if (identifier.length < 3) {
        showFieldError('identifier', 'Must be at least 3 characters');
        return false;
    }
    
    clearFieldError('identifier');
    return true;
}

function validateLoginPassword(password) {
    if (!password) {
        showFieldError('password', 'Password is required');
        return false;
    }
    
    clearFieldError('password');
    return true;
}

function validateUsername(username) {
    if (!username) {
        showFieldError('username', 'Username is required');
        return false;
    }
    
    if (username.length < 3) {
        showFieldError('username', 'Username must be at least 3 characters');
        return false;
    }
    
    if (username.length > 20) {
        showFieldError('username', 'Username cannot exceed 20 characters');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError('username', 'Username can only contain letters, numbers, and underscores');
        return false;
    }
    
    showFieldSuccess('username', 'Username is available');
    return true;
}

function validateEmail(email) {
    if (!email) {
        showFieldError('email', 'Email is required');
        return false;
    }
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        return false;
    }
    
    showFieldSuccess('email', 'Email format is valid');
    return true;
}

function validatePassword(password) {
    if (!password) {
        showFieldError('password', 'Password is required');
        return false;
    }
    
    const requirements = getPasswordRequirements(password);
    const unmetRequirements = Object.entries(requirements)
        .filter(([key, met]) => !met)
        .map(([key]) => key);
    
    if (unmetRequirements.length > 0) {
        const messages = {
            length: 'At least 8 characters',
            uppercase: 'One uppercase letter',
            lowercase: 'One lowercase letter',
            number: 'One number'
        };
        
        const unmetMessages = unmetRequirements.map(req => messages[req]).join(', ');
        showFieldError('password', `Missing: ${unmetMessages}`);
        return false;
    }
    
    clearFieldError('password');
    return true;
}

function validatePasswordMatch(password, confirmPassword) {
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        return false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        return false;
    }
    
    showFieldSuccess('confirmPassword', 'Passwords match');
    return true;
}

function validateRole(role) {
    if (!role) {
        showFieldError('role', 'Please select an account type');
        return false;
    }
    
    if (!['User', 'Admin'].includes(role)) {
        showFieldError('role', 'Invalid account type selected');
        return false;
    }
    
    clearFieldError('role');
    return true;
}

function validateTerms(agreed) {
    if (!agreed) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        return false;
    }
    
    clearFieldError('terms');
    return true;
}

// ===== PASSWORD STRENGTH =====
function updatePasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    const requirementsElement = document.getElementById('passwordRequirements');
    
    if (!strengthElement || !password) {
        if (strengthElement) clearPasswordStrength();
        return;
    }
    
    const requirements = getPasswordRequirements(password);
    const metCount = Object.values(requirements).filter(Boolean).length;
    const strengthLevel = getStrengthLevel(metCount);
    
    // Update strength bar
    const strengthBar = strengthElement.querySelector('.strength-fill');
    const strengthText = strengthElement.querySelector('.strength-text');
    
    strengthElement.className = `password-strength strength-${strengthLevel.name}`;
    strengthText.textContent = `Password strength: ${strengthLevel.label}`;
    
    // Update requirements
    if (requirementsElement) {
        updatePasswordRequirements(requirements);
    }
}

function getPasswordRequirements(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
}

function getStrengthLevel(metCount) {
    const levels = [
        { name: 'weak', label: 'Weak' },
        { name: 'weak', label: 'Weak' },
        { name: 'fair', label: 'Fair' },
        { name: 'good', label: 'Good' },
        { name: 'strong', label: 'Strong' }
    ];
    
    return levels[metCount] || levels[0];
}

function updatePasswordRequirements(requirements) {
    const requirementElements = {
        length: document.getElementById('lengthReq'),
        uppercase: document.getElementById('upperReq'),
        lowercase: document.getElementById('lowerReq'),
        number: document.getElementById('numberReq')
    };
    
    Object.entries(requirements).forEach(([key, met]) => {
        const element = requirementElements[key];
        if (element) {
            element.classList.toggle('met', met);
        }
    });
}

function clearPasswordStrength() {
    const strengthElement = document.getElementById('passwordStrength');
    if (strengthElement) {
        strengthElement.className = 'password-strength';
        const strengthText = strengthElement.querySelector('.strength-text');
        if (strengthText) {
            strengthText.textContent = 'Password strength';
        }
    }
    
    // Clear requirements
    const requirements = ['lengthReq', 'upperReq', 'lowerReq', 'numberReq'];
    requirements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('met');
        }
    });
}

// ===== PASSWORD TOGGLE =====
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            togglePassword(input.id);
        });
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// ===== FORM VALIDATION HELPERS =====
function initializeFormValidation() {
    // Add real-time validation classes
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() && this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else if (this.value.trim()) {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('valid', 'invalid');
        });
    });
}

// ===== ERROR HANDLING =====
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'flex';
    }
    
    const input = document.getElementById(fieldName) || document.querySelector('[name="' + fieldName + '"]');
    if (input) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
}

function showFieldSuccess(fieldName, message) {
    const successElement = document.getElementById(fieldName + 'Success');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'flex';
    }
    
    const input = document.getElementById(fieldName) || document.querySelector('[name="' + fieldName + '"]');
    if (input) {
        input.classList.add('valid');
        input.classList.remove('invalid');
    }
    
    // Clear error if exists
    clearFieldError(fieldName);
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('invalid', 'valid');
    });
}

// ===== UI HELPERS =====
function showLoadingState(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (btnText) btnText.style.display = 'none';
    if (spinner) spinner.style.display = 'block';
    
    button.disabled = true;
    button.style.opacity = '0.7';
}

function hideLoadingState(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (btnText) btnText.style.display = 'flex';
    if (spinner) spinner.style.display = 'none';
    
    button.disabled = false;
    button.style.opacity = '1';
}

function showAlert(message, type) {
    if (typeof type === 'undefined') type = 'info';
    
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-' + type;
    
    const icon = getAlertIcon(type);
    alertElement.innerHTML = '<i class="' + icon + '"></i><span>' + message + '</span>';
    
    alertContainer.appendChild(alertElement);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const args = arguments;
        const later = function() {
            clearTimeout(timeout);
            func.apply(null, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ADDITIONAL CSS FOR VALIDATION STATES =====
const validationCSS = `
    input.valid, select.valid {
        border-color: var(--success);
        background: rgba(16, 185, 129, 0.05);
    }
    
    input.invalid, select.invalid {
        border-color: var(--error);
        background: rgba(239, 68, 68, 0.05);
    }
    
    .error-message {
        display: none;
    }
    
    .success-message {
        display: none;
    }
`;

// Add validation CSS
const validationStyle = document.createElement('style');
validationStyle.textContent = validationCSS;
document.head.appendChild(validationStyle);