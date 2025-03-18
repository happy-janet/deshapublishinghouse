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

// Function to initialize header, navbar, and login form logic
function initHeaderNavbarLogic() {
    const searchBtn = document.querySelector('#search-btn');
    const searchBar = document.querySelector('.search-bar-container');
    const formBtn = document.querySelector('#login-btn');
    const loginForm = document.querySelector('.login-form-container');
    const formClose = document.querySelector('#form-close');
    const menu = document.getElementById('menu-bar');
    const navbar = document.querySelector('.navbar');

    window.onscroll = () => closeMenus([searchBtn, searchBar, menu, navbar, loginForm]);

    if (menu) {
        // Ensure the menu toggles the navbar visibility and changes the icon
        menu.addEventListener('click', () => {
            navbar.classList.toggle('active');  // Toggle navbar visibility
            menu.classList.toggle('fa-times');  // Change the icon to a close icon
        });
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
const countries = ["Australia", "Burundi", "Canada", "Congo", "Denmark", "Egypt", "France", "Germany", "Ghana", "Italy", "Japan", "Kenya", "Mexico", "Nigeria", "Rwanda", "South Africa", "Tanzania", "Uganda", "United Kingdom", "United States", "Other"];
const categories = ["Fiction", "Non-Fiction", "Biography", "Children's Books", "Self-Help", "Romance", "Science Fiction", "Fantasy", "Poetry", "Thriller", "History", "Health & Wellness", "Business & Finance", "Education", "Religious & Spirituality"];
const languages = ["English", "French", "Swahili",  "Spanish", "German", "Luganda", "Other"];
const findUsOptions = ["Google", "Social Media", "Word of Mouth", "YouTube", "Advertisement", "Recommendation", "Email Campaign", "Other"];

populateDropdown("country", countries);
populateDropdown("category", categories);
populateDropdown("language", languages);
populateDropdown("how-find", findUsOptions);

document.addEventListener('DOMContentLoaded', function() {
    const publishingForm = document.getElementById('publishingBookingForm');
    
    if (publishingForm) {
      publishingForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent page reload
        
        const formData = new FormData(this);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });
        
        try {
          const response = await fetch('/book-publishing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
          });
          
          if (response.ok) {
            const responseText = await response.text();
            alert(responseText); // Show success message
            publishingForm.reset(); // Clear form
          } else {
            alert('Form submission failed. Please try again.');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again later.');
        }
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Create navbar overlay if it doesn't exist
    if (!document.querySelector('.navbar-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'navbar-overlay';
      document.querySelector('header').parentNode.insertBefore(overlay, document.querySelector('header').nextSibling);
    }
  
    const menuBar = document.getElementById('menu-bar');
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.navbar-overlay');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    menuBar.addEventListener('click', function() {
      navbar.classList.toggle('active');
      menuBar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
      navbar.classList.remove('active');
      menuBar.classList.remove('active');
      overlay.classList.remove('active');
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbar.classList.remove('active');
        menuBar.classList.remove('active');
        overlay.classList.remove('active');
        
        // Add active class to current link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Scroll effect for header
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Set active menu item based on current section
    function setActiveNavItem() {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
      
      // Home link special case
      if (scrollPosition < 100) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#') {
            link.classList.add('active');
          }
        });
      }
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    
    // Set active on page load
    setActiveNavItem();
  });