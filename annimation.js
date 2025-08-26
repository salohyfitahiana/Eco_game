   
        // Navigation functionality
        class Navigation {
            constructor() {
                this.navbar = document.getElementById('navbar');
                this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
                this.navMenu = document.getElementById('navMenu');
                this.navLinks = document.querySelectorAll('.nav-link');
                this.sections = document.querySelectorAll('.section');
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.handleScroll();
            }

            bindEvents() {
                // Mobile menu toggle
                this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
                
                // Navigation links
                this.navLinks.forEach(link => {
                    link.addEventListener('click', (e) => this.handleNavClick(e));
                });
                
                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.navbar.contains(e.target)) {
                        this.closeMobileMenu();
                    }
                });
                
                // Scroll event for navbar styling
                window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
                
                // Keyboard navigation
                this.navLinks.forEach(link => {
                    link.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            link.click();
                        }
                    });
                });
            }

            toggleMobileMenu() {
                this.mobileMenuBtn.classList.toggle('active');
                this.navMenu.classList.toggle('active');
                
                // Update ARIA attributes for accessibility
                const isExpanded = this.navMenu.classList.contains('active');
                this.mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            }

            closeMobileMenu() {
                this.mobileMenuBtn.classList.remove('active');
                this.navMenu.classList.remove('active');
                this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }

            handleNavClick(e) {
                e.preventDefault();
                
                const targetSection = e.target.getAttribute('data-section');
                
                // Update active states
                this.navLinks.forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show target section
                this.sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Close mobile menu
                this.closeMobileMenu();
                
                // Update URL hash without scrolling
                history.pushState(null, null, `#${targetSection}`);
            }

            handleScroll() {
                if (window.scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }
        }

        // Intersection Observer for animations
        class AnimationController {
            constructor() {
                this.observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };
                
                this.init();
            }

            init() {
                if ('IntersectionObserver' in window) {
                    this.observer = new IntersectionObserver(
                        (entries) => this.handleIntersection(entries),
                        this.observerOptions
                    );
                    
                    this.observeElements();
                }
            }

            observeElements() {
                const elementsToAnimate = document.querySelectorAll(
                    '.objective-item, .section-card, .contact-card'
                );
                
                elementsToAnimate.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.observer.observe(el);
                });
            }

            handleIntersection(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        this.observer.unobserve(entry.target);
                    }
                });
            }
        }

        // Performance optimization
        class PerformanceOptimizer {
            constructor() {
                this.init();
            }

            init() {
                this.lazyLoadImages();
                this.preloadCriticalResources();
            }

            lazyLoadImages() {
                const images = document.querySelectorAll('img[data-src]');
                
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        });
                    });
                    
                    images.forEach(img => imageObserver.observe(img));
                } else {
                    // Fallback for older browsers
                    images.forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                }
            }

            preloadCriticalResources() {
                // Preload font
                const fontLink = document.createElement('link');
                fontLink.rel = 'preload';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
                fontLink.as = 'style';
                document.head.appendChild(fontLink);
            }
        }

        // Accessibility enhancements
        class AccessibilityController {
            constructor() {
                this.init();
            }

            init() {
                this.handleKeyboardNavigation();
                this.announcePageChanges();
                this.setupFocusManagement();
            }

            handleKeyboardNavigation() {
                document.addEventListener('keydown', (e) => {
                    // Skip to main content with Tab
                    if (e.key === 'Tab' && e.target === document.body) {
                        const firstFocusable = document.querySelector('.nav-link');
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }
                    
                    // Navigate sections with arrow keys when focused on nav
                    if (e.target.classList.contains('nav-link')) {
                        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
                        const currentIndex = navLinks.indexOf(e.target);
                        
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextIndex = (currentIndex + 1) % navLinks.length;
                            navLinks[nextIndex].focus();
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                            navLinks[prevIndex].focus();
                        }
                    }
                });
            }

            announcePageChanges() {
                // Create live region for screen readers
                const liveRegion = document.createElement('div');
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;';
                document.body.appendChild(liveRegion);

                // Announce section changes
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class' && mutation.target.classList.contains('section')) {
                            if (mutation.target.classList.contains('active')) {
                                const sectionTitle = mutation.target.querySelector('h1, h2')?.textContent || 'Section';
                                liveRegion.textContent = `Navigation vers ${sectionTitle}`;
                            }
                        }
                    });
                });

                document.querySelectorAll('.section').forEach(section => {
                    observer.observe(section, { attributes: true });
                });
            }

            setupFocusManagement() {
                // Trap focus in mobile menu when open
                const mobileMenu = document.getElementById('navMenu');
                const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
                
                mobileMenu.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' && mobileMenu.classList.contains('active')) {
                        const focusableContent = mobileMenu.querySelectorAll(focusableElements);
                        const firstFocusable = focusableContent[0];
                        const lastFocusable = focusableContent[focusableContent.length - 1];
                        
                        if (e.shiftKey) {
                            if (document.activeElement === firstFocusable) {
                                lastFocusable.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastFocusable) {
                                firstFocusable.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            }
        }

        // Error handling and fallbacks
        class ErrorHandler {
            constructor() {
                this.init();
            }

            init() {
                this.handleImageErrors();
                this.handleScriptErrors();
            }

            handleImageErrors() {
                document.addEventListener('error', (e) => {
                    if (e.target.tagName === 'IMG') {
                        e.target.style.display = 'none';
                        console.warn('Image failed to load:', e.target.src);
                    }
                }, true);
            }

            handleScriptErrors() {
                window.addEventListener('error', (e) => {
                    console.error('Script error:', e.error);
                    // Provide fallback functionality if needed
                });
            }
        }

        // Initialize application
        class ECOGameWebsite {
            constructor() {
                this.init();
            }

            init() {
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
                } else {
                    this.initializeComponents();
                }
            }

            initializeComponents() {
                try {
                    // Initialize all components
                    this.navigation = new Navigation();
                    this.animationController = new AnimationController();
                    this.performanceOptimizer = new PerformanceOptimizer();
                    this.accessibilityController = new AccessibilityController();
                    this.errorHandler = new ErrorHandler();
                    
                    // Handle initial hash in URL
                    this.handleInitialHash();
                    
                    console.log('ECO Game website initialized successfully');
                } catch (error) {
                    console.error('Error initializing website:', error);
                    // Provide basic functionality as fallback
                    this.initBasicFunctionality();
                }
            }

            handleInitialHash() {
                const hash = window.location.hash.slice(1);
                if (hash && document.getElementById(hash)) {
                    const targetLink = document.querySelector(`[data-section="${hash}"]`);
                    if (targetLink) {
                        targetLink.click();
                    }
                }
            }

            initBasicFunctionality() {
                // Basic navigation fallback
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetSection = e.target.getAttribute('data-section');
                        
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        e.target.classList.add('active');
                        
                        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                        document.getElementById(targetSection).classList.add('active');
                    });
                });
            }
        }

        // Start the application
        new ECOGameWebsite();