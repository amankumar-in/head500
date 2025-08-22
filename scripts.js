// Enhanced smooth scrolling with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Enhanced animation on scroll with staggered effects
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for grid items
            if (entry.target.classList.contains('animate-on-scroll')) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            } else {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Enhanced form submission with better UX
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const submitBtn = this.querySelector('.submit-btn');
    const formStatus = document.getElementById('form-status');
    const originalText = submitBtn.textContent;
    
    // Simple validation with enhanced feedback
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            field.style.transform = 'scale(1.02)';
            isValid = false;
            
            // Add shake animation
            field.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                field.style.animation = '';
                field.style.transform = '';
            }, 500);
        } else {
            field.style.borderColor = 'var(--border)';
            field.style.transform = '';
        }
    });
    
    if (isValid) {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        
        // Submit to Google Form
        const form = document.getElementById('google-form');
        const formAction = form.getAttribute('action');
        
        // Use fetch API to submit the form
        fetch(formAction, {
            method: 'POST',
            mode: 'no-cors', // Important for cross-origin requests to Google
            body: new FormData(form)
        })
        .then(() => {
            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.textContent = '✓ Message Sent Successfully!';
            
            // Add confetti effect
            createConfetti();
            
            // Reset form after 4 seconds
            setTimeout(() => {
                form.reset();
                submitBtn.classList.remove('success');
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--gradient-accent)';
            }, 4000);
        })
        .catch(error => {
            // Show error state
            submitBtn.classList.remove('loading');
            formStatus.textContent = 'There was an error submitting the form. Please try again.';
            formStatus.style.color = '#ef4444';
            
            // Reset button after 4 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--gradient-accent)';
            }, 4000);
        });
    }
});

// Enhanced button interactions
document.querySelectorAll('.cta-button, .submit-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add click ripple effect
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Enhanced navigation highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active state styles for navigation
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--accent) !important;
    }
    .nav-links a.active::after {
        width: 100% !important;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Confetti effect function
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#ff6b6b', '#ee5a24', '#10b981'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Add floating elements to hero section
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    const floatingElements = ['🧠', '⚡', '🏥', '💊', '🔬'];
    
    floatingElements.forEach((emoji, index) => {
        const element = document.createElement('div');
        element.textContent = emoji;
        element.style.position = 'absolute';
        element.style.fontSize = '2rem';
        element.style.opacity = '0.1';
        element.style.pointerEvents = 'none';
        element.style.animation = `float ${3 + index}s ease-in-out infinite`;
        element.style.left = (20 + index * 15) + '%';
        element.style.top = (30 + index * 10) + '%';
        
        hero.appendChild(element);
    });
}

// Add floating animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(floatStyle);

// Initialize floating elements when page loads
window.addEventListener('load', createFloatingElements);

// Add scroll-triggered animations for cards
const cards = document.querySelectorAll('.feature-card, .spec-item, .application-card');
cards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Add smooth reveal animations for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(section);
});

// Enhanced mobile menu (if needed)
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Add mobile menu toggle if needed
    if (window.innerWidth <= 768) {
        // Mobile-specific enhancements can be added here
    }
}

// Initialize mobile menu
window.addEventListener('load', initMobileMenu);
window.addEventListener('resize', initMobileMenu);

// Drawer interactions
function bindDrawerEvents() {
    const toggle = document.querySelector('.menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-overlay');
    const closeBtn = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-links a');

    if (!toggle || !drawer || !overlay) return;

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        overlay.hidden = false;
        drawer.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => { overlay.hidden = true; }, 300);
    }

    toggle.addEventListener('click', () => {
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    drawerLinks.forEach(a => a.addEventListener('click', closeDrawer));

    // Close with ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
}

window.addEventListener('DOMContentLoaded', bindDrawerEvents);

// Add image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add smooth counter animation for numbers
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counter animations when elements come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
});

// Theme Switcher
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const root = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        root.classList.add('light-theme');
    }
    
    function toggleTheme() {
        // Disable transitions temporarily
        document.body.classList.add('disable-transitions');
        
        if (root.classList.contains('light-theme')) {
            root.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
        
        void document.body.offsetHeight;
        
        // Re-enable transitions
        requestAnimationFrame(() => {
            document.body.classList.remove('disable-transitions');
        });
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

document.addEventListener('DOMContentLoaded', initThemeSwitcher);


