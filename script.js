/* ============================================
   TRAVEL ITINERARY GENERATOR - MAIN SCRIPT
   ============================================
   
   This script handles:
   1. Form validation (client-side)
   2. Form submission to n8n webhook
   3. User feedback (loading, success, error states)
   4. Form reset after successful submission
   
   Design Philosophy:
   - Clear, readable code that's easy to explain
   - Modular functions for maintainability
   - Accessible error handling
   - Smooth user experience
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

// Replace this URL with your actual n8n webhook URL
const WEBHOOK_URL = "https://deepdwivedi.app.n8n.cloud/webhook/travel-itinerary";

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

const form = document.getElementById('itineraryForm');
const submitButton = document.getElementById('submitButton');
const buttonLoader = document.getElementById('buttonLoader');
const formMessage = document.getElementById('formMessage');

// Form input fields
const destinationInput = document.getElementById('destination');
const daysInput = document.getElementById('days');
const budgetInput = document.getElementById('budget');
const travelModeInput = document.getElementById('travelMode');
const travelersInput = document.getElementById('travelers');
const emailInput = document.getElementById('email');
const preferencesInput = document.getElementById('preferences');

// Error message elements
const destinationError = document.getElementById('destination-error');
const daysError = document.getElementById('days-error');
const budgetError = document.getElementById('budget-error');
const travelModeError = document.getElementById('travelMode-error');
const travelersError = document.getElementById('travelers-error');
const emailError = document.getElementById('email-error');

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates that a text field is not empty
 * @param {string} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid, false otherwise
 */
function validateRequired(value, fieldName) {
    const trimmed = value.trim();
    if (!trimmed) {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, message: '' };
}

/**
 * Validates email format using regex
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        return { valid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: '' };
}

/**
 * Validates that a number is positive and greater than zero
 * @param {string|number} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePositiveNumber(value, fieldName) {
    if (!value) {
        return { valid: false, message: `${fieldName} is required` };
    }
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
        return { valid: false, message: `${fieldName} must be a valid number` };
    }
    
    if (num <= 0) {
        return { valid: false, message: `${fieldName} must be greater than zero` };
    }
    
    // For days and travelers, ensure it's an integer
    if (fieldName === 'Number of days' || fieldName === 'Number of travelers') {
        if (!Number.isInteger(num)) {
            return { valid: false, message: `${fieldName} must be a whole number` };
        }
    }
    
    return { valid: true, message: '' };
}

/**
 * Validates that a select field has a selected value
 * @param {string} value - The selected value
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid, false otherwise
 */
function validateSelect(value, fieldName) {
    if (!value || value === '') {
        return { valid: false, message: `Please select a ${fieldName.toLowerCase()}` };
    }
    return { valid: true, message: '' };
}

// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

/**
 * Shows an error message for a specific field
 * @param {HTMLElement} errorElement - The error message element
 * @param {string} message - The error message to display
 */
function showError(errorElement, message) {
    if (errorElement && message) {
        // Remove existing show class first for re-animation
        errorElement.classList.remove('show');
        
        // Use double requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            });
        });
    }
}

/**
 * Hides the error message for a specific field
 * @param {HTMLElement} errorElement - The error message element
 */
function hideError(errorElement) {
    if (errorElement) {
        // Smooth fade-out before clearing
        errorElement.classList.remove('show');
        // Clear text after animation completes
        setTimeout(() => {
            if (!errorElement.classList.contains('show')) {
                errorElement.textContent = '';
            }
        }, 400); // Match transition duration
    }
}

/**
 * Clears all error messages
 */
function clearAllErrors() {
    hideError(destinationError);
    hideError(daysError);
    hideError(budgetError);
    hideError(travelModeError);
    hideError(travelersError);
    hideError(emailError);
}

// ============================================
// FIELD-SPECIFIC VALIDATION
// ============================================

/**
 * Validates the destination field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateDestination() {
    const result = validateRequired(destinationInput.value, 'Destination');
    if (result.valid) {
        hideError(destinationError);
        return true;
    } else {
        showError(destinationError, result.message);
        return false;
    }
}

/**
 * Validates the days field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateDays() {
    const result = validatePositiveNumber(daysInput.value, 'Number of days');
    if (result.valid) {
        hideError(daysError);
        return true;
    } else {
        showError(daysError, result.message);
        return false;
    }
}

/**
 * Validates the budget field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateBudget() {
    const result = validatePositiveNumber(budgetInput.value, 'Budget');
    if (result.valid) {
        hideError(budgetError);
        return true;
    } else {
        showError(budgetError, result.message);
        return false;
    }
}

/**
 * Validates the travel mode field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateTravelMode() {
    const result = validateSelect(travelModeInput.value, 'travel mode');
    if (result.valid) {
        hideError(travelModeError);
        return true;
    } else {
        showError(travelModeError, result.message);
        return false;
    }
}

/**
 * Validates the travelers field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateTravelers() {
    const result = validatePositiveNumber(travelersInput.value, 'Number of travelers');
    if (result.valid) {
        hideError(travelersError);
        return true;
    } else {
        showError(travelersError, result.message);
        return false;
    }
}

/**
 * Validates the email field
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmailField() {
    const result = validateEmail(emailInput.value);
    if (result.valid) {
        hideError(emailError);
        return true;
    } else {
        showError(emailError, result.message);
        return false;
    }
}

// ============================================
// FORM VALIDATION (ALL FIELDS)
// ============================================

/**
 * Validates all form fields
 * @returns {boolean} - True if all fields are valid, false otherwise
 */
function validateForm() {
    clearAllErrors();
    
    const isDestinationValid = validateDestination();
    const isDaysValid = validateDays();
    const isBudgetValid = validateBudget();
    const isTravelModeValid = validateTravelMode();
    const isTravelersValid = validateTravelers();
    const isEmailValid = validateEmailField();
    
    return isDestinationValid && 
           isDaysValid && 
           isBudgetValid && 
           isTravelModeValid && 
           isTravelersValid && 
           isEmailValid;
}

// ============================================
// FORM MESSAGE DISPLAY
// ============================================

/**
 * Shows a success or error message to the user
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showFormMessage(message, type) {
    // Reset and show with smooth animation
    formMessage.className = 'form-message';
    formMessage.textContent = message;
    
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            formMessage.className = `form-message ${type} show`;
        });
    });
    
    // Scroll to message for better UX
    setTimeout(() => {
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Hides the form message
 */
function hideFormMessage() {
    formMessage.classList.remove('show');
    formMessage.textContent = '';
}

// ============================================
// BUTTON STATE MANAGEMENT
// ============================================

/**
 * Sets the submit button to loading state
 * Shows spinner + "Generating your itinerary…" text
 */
function setButtonLoading() {
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.setAttribute('aria-busy', 'true');
    if (buttonLoader) {
        buttonLoader.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Resets the submit button to normal state
 */
function setButtonNormal() {
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    submitButton.removeAttribute('aria-busy');
    if (buttonLoader) {
        buttonLoader.setAttribute('aria-hidden', 'true');
    }
}

// ============================================
// FORM DATA PREPARATION
// ============================================

/**
 * Collects and formats form data for submission
 * @returns {Object} - Formatted form data
 */
function getFormData() {
    return {
        destination: destinationInput.value.trim(),
        days: parseInt(daysInput.value, 10),
        budget: parseFloat(budgetInput.value),
        travelMode: travelModeInput.value,
        travelers: parseInt(travelersInput.value, 10),
        email: emailInput.value.trim(),
        preferences: preferencesInput.value.trim() || null
    };
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Submits the form data to the n8n webhook
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Promise that resolves on success, rejects on error
 */
async function submitForm(formData) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        // Try to parse JSON response, but don't fail if it's not JSON
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = { success: true };
        }
        
        return responseData;
    } catch (error) {
        // Re-throw with a user-friendly message
        throw new Error('Failed to submit itinerary request. Please check your connection and try again.');
    }
}

/**
 * Resets the form to its initial state
 */
function resetForm() {
    form.reset();
    clearAllErrors();
    hideFormMessage();
    
    // Remove any validation classes that might have been added
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

/**
 * Handles the form submission process
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Hide any previous messages
    hideFormMessage();
    
    // Validate all fields
    if (!validateForm()) {
        // Focus on the first invalid field for better UX
        const firstError = form.querySelector('.error-message.show');
        if (firstError) {
            const fieldId = firstError.id.replace('-error', '');
            const field = document.getElementById(fieldId);
            if (field) {
                field.focus();
            }
        }
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Set loading state
    setButtonLoading();
    
    try {
        // Submit to webhook
        await submitForm(formData);
        
        // Success!
        showFormMessage(
            'Your itinerary request has been submitted successfully! We\'ll send your personalized travel plan to your email shortly.',
            'success'
        );
        
        // Reset form after a short delay for better UX
        setTimeout(() => {
            resetForm();
            setButtonNormal();
        }, 2000);
        
    } catch (error) {
        // Error occurred
        setButtonNormal();
        showFormMessage(
            error.message || 'Something went wrong. Please try again later.',
            'error'
        );
    }
}

// ============================================
// REAL-TIME VALIDATION (OPTIONAL ENHANCEMENT)
// ============================================

/**
 * Sets up real-time validation on blur (when user leaves a field)
 * This provides immediate feedback without being intrusive
 */
function setupRealTimeValidation() {
    destinationInput.addEventListener('blur', validateDestination);
    daysInput.addEventListener('blur', validateDays);
    budgetInput.addEventListener('blur', validateBudget);
    travelModeInput.addEventListener('blur', validateTravelMode);
    travelersInput.addEventListener('blur', validateTravelers);
    emailInput.addEventListener('blur', validateEmailField);
    
    // Clear errors when user starts typing (for better UX)
    destinationInput.addEventListener('input', () => hideError(destinationError));
    daysInput.addEventListener('input', () => hideError(daysError));
    budgetInput.addEventListener('input', () => hideError(budgetError));
    travelModeInput.addEventListener('change', () => hideError(travelModeError));
    travelersInput.addEventListener('input', () => hideError(travelersError));
    emailInput.addEventListener('input', () => hideError(emailError));
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initializes the application when DOM is loaded
 */
function init() {
    // Attach form submit handler
    form.addEventListener('submit', handleFormSubmit);
    
    // Set up real-time validation
    setupRealTimeValidation();
    
    // Ensure form message is initially hidden
    hideFormMessage();
}

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}
