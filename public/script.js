document.addEventListener("DOMContentLoaded", () => {
    // Initialize all functionalities
    initSafariBookingForm();
    initGenericBookingForm();
    initVideoSlider();
    initHeaderNavbarLogic();
    initBlogSlider();
    initReviewForm();
    initNewsletterForm();
    initPesapalPayment();
});

// Function to initialize safari booking form submission
function initSafariBookingForm() {
    const safariBookingForm = document.getElementById('safariBookingForm');
    if (safariBookingForm) {
        safariBookingForm.addEventListener('submit', (e) => {
            handleFormSubmission(e, safariBookingForm, '/book-safari', 'Safari Booking Submitted Successfully');
        });
    }
}

// Function to initialize generic booking form submission
function initGenericBookingForm() {
    const genericBookingForm = document.getElementById('genericBookingForm');
    if (genericBookingForm) {
        genericBookingForm.addEventListener('submit', (e) => {
            handleFormSubmission(e, genericBookingForm, '/book', 'Booking Submitted Successfully');
        });
    }
}

// Generic function to handle form submissions
function handleFormSubmission(event, formElement, url, successMessage) {
    event.preventDefault();
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(() => {
        alert(successMessage);
        formElement.reset(); // Clear the form
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
    });
}

// Pesapal Payment Integration
function initPesapalPayment() {
    const pesapalForm = document.getElementById('pesapalPaymentForm');
    if (pesapalForm) {
        pesapalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePesapalPayment(pesapalForm);
        });
    }
}

// Function to handle Pesapal payment submission
function handlePesapalPayment(formElement) {
    const formData = new FormData(formElement);
    const paymentData = {
        amount: formData.get('amount'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        description: 'Payment for Service' 
    };

    fetch('/create-pesapal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
            alert('Failed to create Pesapal order: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating Pesapal order. Please try again.');
    });
}

// Function to initialize header, navbar, and login form logic
function initHeaderNavbarLogic() {
    const searchBtn = document.querySelector('#search-btn');
    const searchBar = document.querySelector('.search-bar-container');
    const formBtn = document.querySelector('#login-btn');
    const loginForm = document.querySelector('.login-form-container');
    const formClose = document.querySelector('#form-close');
    const menu = document.querySelector('#menu-bar');
    const navbar = document.querySelector('.navbar');

    window.onscroll = () => closeMenus([searchBtn, searchBar, menu, navbar, loginForm]);

    if (menu) {
        menu.addEventListener('click', () => toggleActive(menu, navbar));
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => toggleActive(searchBtn, searchBar));
    }

    if (formBtn) {
        formBtn.addEventListener('click', () => loginForm.classList.add('active'));
    }

    if (formClose) {
        formClose.addEventListener('click', () => loginForm.classList.remove('active'));
    }
}

// Helper function to close all menus
function closeMenus(elements) {
    elements.forEach(element => element && element.classList.remove('active', 'fa-times'));
}

// Helper function to toggle active classes
function toggleActive(...elements) {
    elements.forEach(element => element && element.classList.toggle('active'));
}

// Function to initialize blog slider
function initBlogSlider() {
    const blogContents = document.querySelectorAll('.blog-content');
    let blogIndex = 0;

    setInterval(() => {
        blogContents[blogIndex].classList.remove('active');
        blogIndex = (blogIndex + 1) % blogContents.length;
        blogContents[blogIndex].classList.add('active');
    }, 5000);
}

// Function to populate dropdowns
function populateDropdown(selectId, optionsArray) {
    const selectElement = document.getElementById(selectId);
    optionsArray.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Populate all dropdowns
const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "France", "Germany", "India", "Italy", "Japan", "Kenya", "Mexico", "Nigeria", "South Africa", "United Kingdom", "United States"];
const categories = ["Fiction", "Non-Fiction", "Biography", "Children's Books", "Self-Help", "Romance", "Science Fiction", "Fantasy", "Poetry", "Thriller", "History", "Health & Wellness", "Business & Finance", "Education", "Religious & Spirituality"];
const languages = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Bengali", "Russian", "Swahili", "Turkish", "Dutch", "Polish", "Greek", "Hebrew", "Persian", "Thai", "Vietnamese", "Indonesian"];
const findUsOptions = ["Google", "Social Media", "Word of Mouth", "YouTube", "Advertisement", "Recommendation", "Email Campaign", "Other"];

populateDropdown("country", countries);
populateDropdown("category", categories);
populateDropdown("language", languages);
populateDropdown("how-find", findUsOptions);
