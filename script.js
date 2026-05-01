document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Reveal on Scroll Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Optional: keep animating or just once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-card h3');
    const statsSection = document.querySelector('.about-stats');

    let started = false;

    const startCounter = () => {
        stats.forEach(stat => {
            const originalText = stat.innerText;
            const numberMatch = originalText.match(/(\d+)/);
            const hasK = originalText.includes('k');
            const hasPlus = originalText.includes('+');
            
            const target = numberMatch ? parseInt(numberMatch[1]) : 0;
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    const displayNum = Math.ceil(count);
                    const suffix = hasK ? 'k' : '';
                    stat.innerText = displayNum + suffix + (hasPlus ? '+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + (hasK ? 'k' : '') + (hasPlus ? '+' : '');
                }
            };
            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            startCounter();
            started = true;
        }
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Back to Top Visibility
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Testimonial Slider
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    
    if (track) {
        const cards = Array.from(track.children);
        const totalSlides = cards.length;
        let currentIndex = 0;
        
        // Create dots
        const createDots = () => {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
            resetAutoSlide();
        };

        const nextSlide = () => {
            currentIndex = currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = currentIndex <= 0 ? totalSlides - 1 : currentIndex - 1;
            updateSlider();
        };

        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        
        let autoSlideInterval = setInterval(nextSlide, 3000);
        
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 3000);
        };
        
        createDots();
        updateSlider();
        
        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        track.addEventListener('mouseleave', resetAutoSlide);
    }
});
