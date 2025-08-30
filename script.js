// Portfolio JavaScript - RAH (Revand Al Hafiz)
// Author: Revand Al Hafiz
// Description: Interactive functionality for retro-futuristic portfolio

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');
const contactForm = document.getElementById('contactForm');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on page load
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
}

// Toggle theme function
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  
  // Add smooth transition effect
  document.body.style.transition = 'all 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

// Mobile Navigation
function toggleMobileMenu() {
  mobileMenuBtn.classList.toggle('active');
  nav.classList.toggle('active');
}

// Close mobile menu when clicking nav links
function closeMobileMenu() {
  mobileMenuBtn.classList.remove('active');
  nav.classList.remove('active');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = 70;
    const sectionTop = section.offsetTop - headerHeight;
    
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }
  closeMobileMenu();
}

// Parallax Background Effect
function initParallax() {
  const shapes = document.querySelectorAll('.shape');
  const pixelGrid = document.querySelector('.pixel-grid');
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseX - 0.5) * speed * 50;
      const y = (mouseY - 0.5) * speed * 50;
      
      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    // Pixel grid parallax
    const gridX = (mouseX - 0.5) * 10;
    const gridY = (mouseY - 0.5) * 10;
    pixelGrid.style.transform = `translate(${gridX}px, ${gridY}px)`;
  });
}

// Scroll Reveal Animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Special handling for skill bars
        if (entry.target.classList.contains('skill-item')) {
          const skillProgress = entry.target.querySelector('.skill-progress');
          const width = skillProgress.getAttribute('data-width');
          setTimeout(() => {
            skillProgress.style.width = width;
          }, 300);
        }
        
        // Special handling for project cards with stagger effect
        if (entry.target.classList.contains('project-card')) {
          const index = Array.from(document.querySelectorAll('.project-card')).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const elementsToAnimate = [
    '.section-title',
    '.about-avatar .avatar-frame',
    '.about-text',
    '.skill-item',
    '.project-card',
    '.contact-form',
    '.social-links'
  ];
  
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  });
}

// Project Filter Functionality
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects with animation
      projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.display = 'none';
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

// Form Validation
function validateForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  
  let isValid = true;
  
  // Reset errors
  nameError.classList.remove('show');
  emailError.classList.remove('show');
  messageError.classList.remove('show');
  
  // Validate name
  if (!name.value.trim()) {
    nameError.textContent = 'Name is required';
    nameError.classList.add('show');
    name.style.borderColor = '#ef4444';
    isValid = false;
  } else {
    name.style.borderColor = 'var(--border-color)';
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailError.textContent = 'Email is required';
    emailError.classList.add('show');
    email.style.borderColor = '#ef4444';
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.textContent = 'Please enter a valid email';
    emailError.classList.add('show');
    email.style.borderColor = '#ef4444';
    isValid = false;
  } else {
    email.style.borderColor = 'var(--border-color)';
  }
  
  // Validate message
  if (!message.value.trim()) {
    messageError.textContent = 'Message is required';
    messageError.classList.add('show');
    message.style.borderColor = '#ef4444';
    isValid = false;
  } else {
    message.style.borderColor = 'var(--border-color)';
  }
  
  return isValid;
}

// Real-time form validation
function initFormValidation() {
  const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
  
  inputs.forEach(input => {
    // Focus effect
    input.addEventListener('focus', () => {
      input.style.transform = 'translateY(-2px)';
      input.style.boxShadow = '0 0 0 3px var(--glow)';
    });
    
    // Blur effect
    input.addEventListener('blur', () => {
      input.style.transform = 'translateY(0)';
      if (!input.value) {
        input.style.boxShadow = 'none';
      }
    });
    
    // Real-time validation
    input.addEventListener('input', () => {
      const errorElement = document.getElementById(input.name + 'Error');
      if (errorElement.classList.contains('show')) {
        if (input.value.trim()) {
          errorElement.classList.remove('show');
          input.style.borderColor = 'var(--border-color)';
        }
      }
    });
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (validateForm()) {
    // Simulate form submission
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span>Sending...</span><div class="btn-glow"></div>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.innerHTML = '<span>Message Sent! ✅</span><div class="btn-glow"></div>';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        
        // Show success animation
        showSuccessMessage();
      }, 2000);
    }, 1500);
  }
}

// Success message animation
function showSuccessMessage() {
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = '🎉 Thank you! Your message has been sent successfully!';
  successMessage.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 10px 30px var(--shadow);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(successMessage);
  
  setTimeout(() => {
    successMessage.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    successMessage.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 300);
  }, 4000);
}

// Header scroll effect
function initHeaderScroll() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.style.background = currentTheme === 'light' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(15, 23, 42, 0.95)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = currentTheme === 'light' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(15, 23, 42, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });
}

// Active navigation highlighting
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// Typewriter effect for hero title
function initTypewriterEffect() {
  const heroTitle = document.querySelector('.hero-title');
  const text = "Hello, I'm Revand Al Hafiz";
  const gradientText = "Revand Al Hafiz";
  let index = 0;
  
  // Clear existing content
  heroTitle.innerHTML = '';
  
  function typeWriter() {
    if (index < text.length) {
      const currentChar = text.charAt(index);
      
      if (index >= text.indexOf(gradientText)) {
        // Start gradient text
        if (index === text.indexOf(gradientText)) {
          heroTitle.innerHTML = text.substring(0, text.indexOf(gradientText)) + '<span class="gradient-text">';
        }
        heroTitle.querySelector('.gradient-text').textContent += currentChar;
        
        if (index === text.length - 1) {
          heroTitle.querySelector('.gradient-text').innerHTML += '</span>';
        }
      } else {
        heroTitle.textContent += currentChar;
      }
      
      index++;
      setTimeout(typeWriter, 100);
    }
  }
  
  // Start typewriter after page load
  setTimeout(() => {
    typeWriter();
  }, 1000);
}

// Cursor trail effect
function initCursorTrail() {
  const trail = [];
  const trailLength = 8;
  
  // Create trail elements
  for (let i = 0; i < trailLength; i++) {
    const trailElement = document.createElement('div');
    trailElement.className = 'cursor-trail';
    trailElement.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: var(--primary-blue);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: ${1 - (i / trailLength)};
      transition: all 0.1s ease;
    `;
    document.body.appendChild(trailElement);
    trail.push(trailElement);
  }
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function updateTrail() {
    let currentX = mouseX;
    let currentY = mouseY;
    
    trail.forEach((element, index) => {
      element.style.left = currentX - 3 + 'px';
      element.style.top = currentY - 3 + 'px';
      
      if (index === 0) {
        currentX = mouseX;
        currentY = mouseY;
      } else {
        const prevElement = trail[index - 1];
        const prevX = parseFloat(prevElement.style.left);
        const prevY = parseFloat(prevElement.style.top);
        
        currentX += (prevX - currentX) * 0.3;
        currentY += (prevY - currentY) * 0.3;
      }
    });
    
    requestAnimationFrame(updateTrail);
  }
  
  updateTrail();
}

// Project card tilt effect
function initCardTiltEffect() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Loading screen animation
function initLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-content">
      <div class="loading-logo">
        <h1> Wait ꩜ ᯅ ꩜</h1>
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
      </div>
    </div>
  `;
  loadingScreen.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: opacity 0.5s ease;
  `;
  
  const loadingContent = loadingScreen.querySelector('.loading-content');
  loadingContent.style.cssText = `
    text-align: center;
    color: white;
  `;
  
  const loadingLogo = loadingScreen.querySelector('.loading-logo h1');
  loadingLogo.style.cssText = `
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 30px;
    animation: pulse 1.5s ease-in-out infinite;
  `;
  
  const loadingBar = loadingScreen.querySelector('.loading-bar');
  loadingBar.style.cssText = `
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
  `;
  
  const loadingProgress = loadingScreen.querySelector('.loading-progress');
  loadingProgress.style.cssText = `
    width: 0%;
    height: 100%;
    background: white;
    border-radius: 2px;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(loadingScreen);
  
  // Animate loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(loadingScreen);
        }, 500);
      }, 800);
    }
    loadingProgress.style.width = progress + '%';
  }, 100);
}

// Easter egg - Konami code
function initKonamiCode() {
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        triggerEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function triggerEasterEgg() {
  // Create rainbow effect
  const rainbowCSS = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    body * {
      animation: rainbow 2s linear infinite !important;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = rainbowCSS;
  document.head.appendChild(style);
  
  // Show easter egg message
  const message = document.createElement('div');
  message.innerHTML = '🎉 KONAMI CODE ACTIVATED! 🌈 Welcome to the rainbow dimension!';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
    background-size: 400% 400%;
    color: white;
    padding: 20px 40px;
    border-radius: 15px;
    font-size: 1.2rem;
    font-weight: 600;
    z-index: 10001;
    animation: gradient 2s ease infinite, bounce 0.5s ease infinite alternate;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(message);
  
  // Remove effects after 5 seconds
  setTimeout(() => {
    document.head.removeChild(style);
    document.body.removeChild(message);
  }, 5000);
}

// Smooth scroll behavior for all internal links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = 70;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        closeMobileMenu();
      }
    });
  });
}

// Performance optimization - Lazy loading for animations
function initLazyAnimations() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '50px'
  };
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Add specific animations based on element class
        if (element.classList.contains('computer-mascot')) {
          element.style.animation = 'mascotFloat 4s ease-in-out infinite';
        }
        
        if (element.classList.contains('sparkle')) {
          element.style.animation = 'sparkle 2s ease-in-out infinite';
        }
        
        animationObserver.unobserve(element);
      }
    });
  }, observerOptions);
  
  // Observe heavy animation elements
  document.querySelectorAll('.computer-mascot, .sparkle').forEach(el => {
    animationObserver.observe(el);
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Show loading screen first
  initLoadingScreen();
  
  // Initialize theme
  initTheme();
  
  // Wait for loading to complete, then initialize everything else
  setTimeout(() => {
    initParallax();
    initScrollReveal();
    initProjectFilter();
    initFormValidation();
    initHeaderScroll();
    initActiveNavigation();
    initCardTiltEffect();
    initSmoothScrolling();
    initLazyAnimations();
    initKonamiCode();
    
    // Only add cursor trail on desktop
    if (window.innerWidth > 768) {
      initCursorTrail();
    }
  }, 2000);
});

// Event Listeners
themeToggle?.addEventListener('click', toggleTheme);
mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
contactForm?.addEventListener('submit', handleFormSubmit);

// Navigation link clicks
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      scrollToSection(sectionId);
    }
  });
});

// Window resize handler
window.addEventListener('resize', () => {
  // Close mobile menu on resize
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
  
  // Reinitialize cursor trail for desktop
  const existingTrails = document.querySelectorAll('.cursor-trail');
  existingTrails.forEach(trail => trail.remove());
  
  if (window.innerWidth > 768) {
    initCursorTrail();
  }
});

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => {
  if (window.innerWidth <= 768) {
    e.preventDefault();
  }
});

// Add CSS animations keyframes dynamically
const additionalCSS = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes bounce {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.nav-link.active {
  color: var(--primary-blue) !important;
}

.nav-link.active::after {
  width: 100% !important;
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Export functions for testing (optional)
window.portfolioFunctions = {
  toggleTheme,
  scrollToSection,
  validateForm,
  showSuccessMessage
};