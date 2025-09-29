// ===== VALIDATION UTILITIES =====

// Email validation regex
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Username validation regex
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

// Password strength requirements
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false // Optional for basic implementation
};

// ===== VALIDATION FUNCTIONS =====

/**
 * Validate email format
 * @param {string} email 
 * @returns {object} {isValid: boolean, message: string}
 */
function validateEmailFormat(email) {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    if (!EMAIL_REGEX.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    return { isValid: true, message: 'Valid email format' };
}

/**
 * Validate username format and requirements
 * @param {string} username 
 * @returns {object} {isValid: boolean, message: string}
 */
function validateUsernameFormat(username) {
    if (!username) {
        return { isValid: false, message: 'Username is required' };
    }

    if (username.length < 3) {
        return { isValid: false, message: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
        return { isValid: false, message: 'Username cannot exceed 20 characters' };
    }

    if (!USERNAME_REGEX.test(username)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }

    return { isValid: true, message: 'Valid username format' };
}

/**
 * Validate password strength
 * @param {string} password 
 * @returns {object} {isValid: boolean, message: string, strength: number}
 */
function validatePasswordStrength(password) {
    if (!password) {
        return { isValid: false, message: 'Password is required', strength: 0 };
    }

    const requirements = {
        length: password.length >= PASSWORD_REQUIREMENTS.minLength,
        uppercase: PASSWORD_REQUIREMENTS.requireUppercase ? /[A-Z]/.test(password) : true,
        lowercase: PASSWORD_REQUIREMENTS.requireLowercase ? /[a-z]/.test(password) : true,
        numbers: PASSWORD_REQUIREMENTS.requireNumbers ? /\d/.test(password) : true
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const totalRequirements = Object.keys(requirements).length;
    const strength = Math.round((metRequirements / totalRequirements) * 100);

    if (metRequirements === totalRequirements) {
        return { isValid: true, message: 'Strong password', strength };
    }

    const unmet = [];
    if (!requirements.length) unmet.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    if (!requirements.uppercase) unmet.push('One uppercase letter');
    if (!requirements.lowercase) unmet.push('One lowercase letter');
    if (!requirements.numbers) unmet.push('One number');

    return {
        isValid: false,
        message: `Missing: ${unmet.join(', ')}`,
        strength
    };
}

/**
 * Validate password confirmation
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {object} {isValid: boolean, message: string}
 */
function validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword) {
        return { isValid: false, message: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }

    return { isValid: true, message: 'Passwords match' };
}

/**
 * Validate required field
 * @param {string} value 
 * @param {string} fieldName 
 * @returns {object} {isValid: boolean, message: string}
 */
function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true, message: `${fieldName} provided` };
}

/**
 * Validate role selection
 * @param {string} role 
 * @returns {object} {isValid: boolean, message: string}
 */
function validateRole(role) {
    const validRoles = ['User', 'Admin'];

    if (!role) {
        return { isValid: false, message: 'Please select an account type' };
    }

    if (!validRoles.includes(role)) {
        return { isValid: false, message: 'Invalid account type selected' };
    }

    return { isValid: true, message: 'Valid role selected' };
}

/**
 * Validate terms agreement
 * @param {boolean} agreed 
 * @returns {object} {isValid: boolean, message: string}
 */
function validateTermsAgreement(agreed) {
    if (!agreed) {
        return { isValid: false, message: 'You must agree to the terms and conditions' };
    }

    return { isValid: true, message: 'Terms accepted' };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get password strength level
 * @param {number} strength - Strength percentage (0-100)
 * @returns {object} {level: string, color: string, text: string}
 */
function getPasswordStrengthLevel(strength) {
    if (strength >= 80) {
        return { level: 'strong', color: '#10b981', text: 'Strong' };
    } else if (strength >= 60) {
        return { level: 'good', color: '#3b82f6', text: 'Good' };
    } else if (strength >= 40) {
        return { level: 'fair', color: '#f59e0b', text: 'Fair' };
    } else {
        return { level: 'weak', color: '#ef4444', text: 'Weak' };
    }
}

/**
 * Sanitize input string
 * @param {string} input 
 * @returns {string} sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 500); // Limit length
}

/**
 * Format validation errors for display
 * @param {Array} errors - Array of error objects
 * @returns {string} formatted error message
 */
function formatValidationErrors(errors) {
    if (!Array.isArray(errors) || errors.length === 0) {
        return '';
    }

    if (errors.length === 1) {
        return errors[0].message;
    }

    return errors.map(error => error.message).join('; ');
}

// ===== REAL-TIME VALIDATION HELPERS =====

/**
 * Set up real-time validation for a form
 * @param {string} formId - Form element ID
 * @param {object} validationRules - Validation rules for each field
 */
function setupRealTimeValidation(formId, validationRules) {
    const form = document.getElementById(formId);
    if (!form) return;

    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (!field) return;

        const rule = validationRules[fieldName];

        field.addEventListener('blur', function () {
            const result = rule(this.value);
            updateFieldValidationUI(fieldName, result);
        });

        field.addEventListener('input', function () {
            clearFieldValidationUI(fieldName);

            // Real-time validation for password strength
            if (fieldName === 'password') {
                const result = validatePasswordStrength(this.value);
                updatePasswordStrengthUI(result);
            }
        });
    });
}

/**
 * Update field validation UI
 * @param {string} fieldName 
 * @param {object} validationResult 
 */
function updateFieldValidationUI(fieldName, validationResult) {
    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    const errorElement = document.getElementById(`${fieldName}Error`);
    const successElement = document.getElementById(`${fieldName}Success`);

    if (validationResult.isValid) {
        if (field) {
            field.classList.add('valid');
            field.classList.remove('invalid');
        }
        if (successElement) {
            successElement.textContent = validationResult.message;
            successElement.style.display = 'flex';
        }
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    } else {
        if (field) {
            field.classList.add('invalid');
            field.classList.remove('valid');
        }
        if (errorElement) {
            errorElement.textContent = validationResult.message;
            errorElement.style.display = 'flex';
        }
        if (successElement) {
            successElement.style.display = 'none';
        }
    }
}

/**
 * Clear field validation UI
 * @param {string} fieldName 
 */
function clearFieldValidationUI(fieldName) {
    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    const errorElement = document.getElementById(`${fieldName}Error`);
    const successElement = document.getElementById(`${fieldName}Success`);

    if (field) {
        field.classList.remove('valid', 'invalid');
    }
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    if (successElement) {
        successElement.style.display = 'none';
    }
}

/**
 * Update password strength UI
 * @param {object} validationResult 
 */
function updatePasswordStrengthUI(validationResult) {
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;

    const strengthLevel = getPasswordStrengthLevel(validationResult.strength || 0);
    const strengthBar = strengthElement.querySelector('.strength-fill');
    const strengthText = strengthElement.querySelector('.strength-text');

    if (strengthBar) {
        strengthBar.style.width = `${validationResult.strength || 0}%`;
        strengthBar.style.backgroundColor = strengthLevel.color;
    }

    if (strengthText) {
        strengthText.textContent = `Password strength: ${strengthLevel.text}`;
        strengthText.style.color = strengthLevel.color;
    }

    strengthElement.className = `password-strength strength-${strengthLevel.level}`;
}

// ===== FORM VALIDATION ORCHESTRATOR =====

/**
 * Validate entire form
 * @param {string} formId 
 * @param {object} validationRules 
 * @returns {object} {isValid: boolean, errors: Array}
 */
function validateForm(formId, validationRules) {
    const form = document.getElementById(formId);
    if (!form) {
        return { isValid: false, errors: [{ field: 'form', message: 'Form not found' }] };
    }

    const errors = [];
    const formData = new FormData(form);

    Object.keys(validationRules).forEach(fieldName => {
        const fieldValue = formData.get(fieldName);
        const rule = validationRules[fieldName];
        const result = rule(fieldValue);

        if (!result.isValid) {
            errors.push({
                field: fieldName,
                message: result.message
            });
        }

        updateFieldValidationUI(fieldName, result);
    });

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ===== PREDEFINED VALIDATION RULES =====

const LOGIN_VALIDATION_RULES = {
    identifier: function (value) {
        if (!value || value.trim().length < 3) {
            return { isValid: false, message: 'Email or username must be at least 3 characters' };
        }
        return { isValid: true, message: 'Valid identifier' };
    },
    password: function (value) {
        if (!value) {
            return { isValid: false, message: 'Password is required' };
        }
        return { isValid: true, message: 'Password provided' };
    }
};

const REGISTER_VALIDATION_RULES = {
    username: validateUsernameFormat,
    email: validateEmailFormat,
    password: validatePasswordStrength,
    confirmPassword: function (value) {
        const passwordField = document.getElementById('password');
        const password = passwordField ? passwordField.value : '';
        return validatePasswordConfirmation(password, value);
    },
    role: validateRole,
    agreeTerms: function (value) {
        return validateTermsAgreement(value === 'on' || value === true);
    }
};

// ===== INITIALIZATION =====

/**
 * Initialize validation for login form
 */
function initializeLoginValidation() {
    setupRealTimeValidation('loginForm', LOGIN_VALIDATION_RULES);
}

/**
 * Initialize validation for register form
 */
function initializeRegisterValidation() {
    setupRealTimeValidation('registerForm', REGISTER_VALIDATION_RULES);

    // Special handling for password confirmation
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordField = document.getElementById('password');

    if (confirmPasswordField && passwordField) {
        confirmPasswordField.addEventListener('input', function () {
            const result = validatePasswordConfirmation(passwordField.value, this.value);
            updateFieldValidationUI('confirmPassword', result);
        });

        passwordField.addEventListener('input', function () {
            if (confirmPasswordField.value) {
                const result = validatePasswordConfirmation(this.value, confirmPasswordField.value);
                updateFieldValidationUI('confirmPassword', result);
            }
        });
    }
}

// ===== AUTO-INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes('login.html')) {
        initializeLoginValidation();
    } else if (currentPage.includes('register.html')) {
        initializeRegisterValidation();
    }
});

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====

// Make functions available globally
window.ValidationUtils = {
    validateEmailFormat,
    validateUsernameFormat,
    validatePasswordStrength,
    validatePasswordConfirmation,
    validateRequired,
    validateRole,
    validateTermsAgreement,
    getPasswordStrengthLevel,
    sanitizeInput,
    formatValidationErrors,
    validateForm,
    LOGIN_VALIDATION_RULES,
    REGISTER_VALIDATION_RULES
};