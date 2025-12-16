// Smooth Navigation with Active States
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navContainer = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.nav-toggle');

    const closeMobileNav = () => {
        if (!navContainer || !navToggle) {
            return;
        }

        navContainer.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };

    if (navToggle && navContainer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navContainer.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
        });

        document.addEventListener('click', (event) => {
            if (!navContainer.classList.contains('open')) {
                return;
            }

            if (!navContainer.contains(event.target) && !navToggle.contains(event.target)) {
                closeMobileNav();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileNav();
            }
        });
    }
    
    // Navigation Click Handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Immediately update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const yOffset = -80;
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }

            if (navToggle && window.innerWidth <= 1024) {
                closeMobileNav();
            }
        });
    });
    
    // Intersection Observer for Active Navigation
    const observerOptions = {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: '-20% 0px -35% 0px'
    };

    const sectionVisibility = new Map();

    const observer = new IntersectionObserver((entries) => {
        // Track current visibility so the active state survives rapid scroll swings
        entries.forEach(entry => {
            sectionVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const mostVisible = Array.from(sectionVisibility.entries()).reduce(
            (max, [id, ratio]) => (ratio > max.ratio ? { id, ratio } : max),
            { id: null, ratio: 0 }
        );

        if (mostVisible.id) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${mostVisible.id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Mouse Movement Gradient Effect (Subtle)
    const mainContent = document.querySelector('.main-content');
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        mainContent.style.background = `
            radial-gradient(
                600px at ${mouseX}px ${mouseY}px,
                rgba(94, 234, 212, 0.05),
                transparent 80%
            ),
            #0f172a
        `;
    });
    
    // Enhanced Hover Effects for Items
    const interactiveItems = document.querySelectorAll('.project-item, .org-item');
    
    interactiveItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Smooth Reveal on Scroll
    const revealElements = document.querySelectorAll('.tool-item, .project-item, .org-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        revealObserver.observe(element);
    });
    
    // External Link Handling
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Link will be added later');
            }
        });
    });
});
