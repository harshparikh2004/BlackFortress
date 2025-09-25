// ===== MAIN JAVASCRIPT FOR LANDING PAGE =====

document.addEventListener('DOMContentLoaded', function () {
    // Initialize landing page functionality
    initializeNavigation();
    initializeAnimations();
    initializeScrollEffects();
    checkSystemStatus();
    initializeInteractiveElements();

    // Secure session check and UI update
    updateLoginUI();
});

function updateLoginUI() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    let user = null;
    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'));
    } else if (sessionStorage.getItem('user')) {
        user = JSON.parse(sessionStorage.getItem('user'));
    }
    navLinks.innerHTML = '';
    navLinks.innerHTML += '<a href="#features">Features</a>';
    navLinks.innerHTML += '<a href="#security">Security</a>';
    if (user) {
        navLinks.innerHTML += `<a href="pages/dashboard.html">Dashboard</a>`;
        navLinks.innerHTML += `<span class="nav-user"><i class="fas fa-user"></i> ${user.username}</span>`;
        navLinks.innerHTML += '<a href="#" id="logoutBtn" class="btn-logout">Logout</a>';
        setTimeout(() => {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('authToken');
                    window.location.reload();
                });
            }
        }, 100);
    } else {
        navLinks.innerHTML += '<a href="pages/register.html" class="btn-register">Register</a>';
        navLinks.innerHTML += '<a href="pages/login.html" class="btn-login">Login</a>';
    }
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.error('Target element for scroll not found:', targetId);
            }
        });
    });

    // Mobile navigation toggle (if needed in future)
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const navbar = document.querySelector('.nav-header');
    let lastScrollTop = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class for navbar styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add staggered animation for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = (index * 0.2) + 's';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .security-card, .hero-text, .hero-visual');
    animatedElements.forEach(function (el) {
        observer.observe(el);
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Add CSS for scroll animations
    const animationCSS = `
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-header.scrolled {
            background: rgba(15, 15, 35, 0.98);
            backdrop-filter: blur(25px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav-header.nav-hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .feature-card, .security-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
    `;

    const style = document.createElement('style');
    style.textContent = animationCSS;
    document.head.appendChild(style);

    // Initialize floating shapes animation
    initializeFloatingShapes();

    // Initialize typing effect for hero text (optional)
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        // Store original text and clear it
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';

        // Start typing effect after a delay
        setTimeout(function () {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
}

// ===== FLOATING SHAPES ANIMATION =====
function initializeFloatingShapes() {
    // Create floating shapes if they don't exist
    let shapesContainer = document.querySelector('.floating-shapes');
    if (!shapesContainer) {
        shapesContainer = document.createElement('div');
        shapesContainer.className = 'floating-shapes';
        document.body.appendChild(shapesContainer);

        // Create shapes
        for (let i = 1; i <= 3; i++) {
            const shape = document.createElement('div');
            shape.className = `shape shape-${i}`;
            shapesContainer.appendChild(shape);
        }
    }

    // Add CSS for floating shapes
    const shapesCSS = `
        .floating-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .shape {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, 
                rgba(99, 102, 241, 0.1), 
                rgba(129, 140, 248, 0.05)
            );
            animation: float 20s infinite linear;
        }
        
        .shape-1 {
            width: 200px;
            height: 200px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .shape-2 {
            width: 150px;
            height: 150px;
            top: 60%;
            right: 20%;
            animation-delay: -7s;
        }
        
        .shape-3 {
            width: 100px;
            height: 100px;
            bottom: 20%;
            left: 60%;
            animation-delay: -14s;
        }
        
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            33% { transform: translateY(-30px) rotate(120deg); opacity: 0.4; }
            66% { transform: translateY(20px) rotate(240deg); opacity: 0.6; }
            100% { transform: translateY(0px) rotate(360deg); opacity: 0.7; }
        }
    `;

    const shapeStyle = document.createElement('style');
    shapeStyle.textContent = shapesCSS;
    document.head.appendChild(shapeStyle);
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function (button) {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click ripple effect
    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            createRipple(e, this);
        });
    });

    // Initialize feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== SYSTEM STATUS CHECK =====
async function checkSystemStatus() {
    const statusIndicators = {
        api: document.querySelector('.status-dot'),
        database: document.querySelectorAll('.status-dot')[1]
    };

    try {
        const response = await fetch('http://localhost:5000/api/health');

        if (response.ok) {
            const data = await response.json();
            updateStatusIndicators(true, data);
            console.log('✅ System Status:', data);
        } else {
            throw new Error('API responded with error');
        }
    } catch (error) {
        updateStatusIndicators(false);
        console.warn('⚠️ System Status Check Failed:', error.message);

        // Show offline status in a non-intrusive way
        showSystemStatusNotification(false);
    }
}

function updateStatusIndicators(isOnline, data) {
    const statusDots = document.querySelectorAll('.status-dot');
    const statusTexts = document.querySelectorAll('.status-item span:last-child');

    statusDots.forEach(function (dot) {
        if (isOnline) {
            dot.classList.add('active');
            dot.classList.remove('offline');
        } else {
            dot.classList.remove('active');
            dot.classList.add('offline');
        }
    });

    // Update status texts
    statusTexts.forEach(function (text) {
        if (text.textContent.includes('API Status')) {
            text.textContent = isOnline ? 'API Status: Operational' : 'API Status: Offline';
        }
        if (text.textContent.includes('Database')) {
            text.textContent = isOnline ? 'Database: Connected' : 'Database: Offline';
        }
    });

    // Update security metrics if data is available
    if (isOnline && data) {
        updateSecurityMetrics(data);
    }
}

function updateSecurityMetrics(data) {
    // Update uptime display
    const uptimeElement = document.querySelector('.metric-value');
    if (uptimeElement && data.uptime) {
        const hours = Math.floor(data.uptime / 3600);
        const minutes = Math.floor((data.uptime % 3600) / 60);
        uptimeElement.textContent = `${hours}h ${minutes}m`;
    }
}

function showSystemStatusNotification(isOnline) {
    const notification = document.createElement('div');
    notification.className = 'status-notification';
    notification.innerHTML = `
        <div class="status-notification-content">
            <i class="fas ${isOnline ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${isOnline ? 'System Online' : 'System Offline - Demo Mode'}</span>
        </div>
    `;

    const notificationCSS = `
        .status-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: ${isOnline ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
        }
        
        .status-notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;

    const style = document.createElement('style');
    style.textContent = notificationCSS;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(function () {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(function () {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function typeWriter(element, text, speed) {
    if (typeof speed === 'undefined') speed = 50;
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;

    const rippleCSS = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = rippleCSS;
        document.head.appendChild(style);
    }

    button.appendChild(ripple);

    setTimeout(function () {
        ripple.remove();
    }, 600);
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function () {
                inThrottle = false;
            }, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function (e) {
    console.error('Global error:', e.error);

    // Log error for debugging
    if (typeof e.error === 'object') {
        console.error('Error details:', {
            message: e.error.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error.stack
        });
    }
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function () {
    // Log page load performance
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Performance:', {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            totalTime: Math.round(perfData.loadEventEnd - perfData.navigationStart)
        });
    }
});

// ===== ADDITIONAL STATUS EFFECTS =====
const additionalCSS = `
    .status-dot.offline {
        background: var(--error);
        animation: pulse-error 2s infinite;
    }
    
    @keyframes pulse-error {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    .feature-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .security-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Add additional CSS
const additionalStyle = document.createElement('style');
additionalStyle.textContent = additionalCSS;
document.head.appendChild(additionalStyle);