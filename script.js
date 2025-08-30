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

// Parallax Background Effect (throttled with rAF to reduce work)
function initParallax() {
  // disable on small screens to save CPU
  if (window.innerWidth <= 1024) return;

  const shapes = document.querySelectorAll('.shape');
  const pixelGrid = document.querySelector('.pixel-grid');
  let rafPending = false;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    // very light sampling
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        const centerX = mouseX - 0.5;
        const centerY = mouseY - 0.5;

        shapes.forEach((shape, index) => {
          // reduce amplitude and work
          const speed = 0.25 + index * 0.15;
          const x = centerX * speed * 18;
          const y = centerY * speed * 18;
          shape.style.transform = `translate(${x}px, ${y}px)`;
          // hint to browser
          shape.style.willChange = 'transform';
        });

        if (pixelGrid) {
          // subtle movement only
          pixelGrid.style.transform = `translate(${centerX * 4}px, ${centerY * 4}px)`;
          pixelGrid.style.willChange = 'transform';
        }

        rafPending = false;
      });
    }
  }, { passive: true });
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

// Header scroll effect (rAF-throttled)
function initHeaderScroll() {
  let lastScrollY = window.scrollY;
  let raf = null;

  const onScroll = () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.background = currentTheme === 'light'
        ? 'rgba(255, 255, 255, 0.95)'
        : 'rgba(15, 23, 42, 0.95)';
      header.style.backdropFilter = 'blur(12px)';
    } else {
      header.style.background = currentTheme === 'light'
        ? 'rgba(255, 255, 255, 0.95)'
        : 'rgba(15, 23, 42, 0.95)';
      header.style.backdropFilter = 'blur(8px)';
    }

    if (currentScrollY > lastScrollY && currentScrollY > 120) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
    raf = null;
  };

  window.addEventListener('scroll', () => {
    if (raf === null) {
      raf = requestAnimationFrame(onScroll);
    }
  }, { passive: true });
}

// Active navigation highlighting (single rAF-throttled listener)
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let raf = null;

  const highlight = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
    raf = null;
  };

  window.addEventListener('scroll', () => {
    if (raf === null) raf = requestAnimationFrame(highlight);
  }, { passive: true });
}

// Reduce loading screen time
function initLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.style.cssText = `
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  loadingScreen.innerHTML = '<div style="color:white;font-weight:700;padding:16px;">Loading…</div>';
  document.body.appendChild(loadingScreen);

  // Remove quicker
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      if (loadingScreen.parentNode) loadingScreen.parentNode.removeChild(loadingScreen);
    }, 120);
  }, 280);
}

// Debounce helper and improved resize handler
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

window.addEventListener('resize', debounce(() => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
  // remove any cursor trails left behind
  document.querySelectorAll('.cursor-trail').forEach(t => t.remove());
  if (window.innerWidth > 768) initCursorTrail();
}, 250));

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
  // Lightweight message only (no global hue-rotate animations)
  const message = document.createElement('div');
  message.innerHTML = '🎉 KONAMI ACTIVATED! 🌈';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
    padding: 10px 16px;
    border-radius: 10px;
    z-index: 10001;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(message);

  setTimeout(() => {
    if (message.parentNode) message.parentNode.removeChild(message);
  }, 3500);
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
