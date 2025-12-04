document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor elements
    const cursor = document.getElementById('cursor');
    const body = document.body;
    
    // Cursor trail array
    let trails = [];
    const maxTrails = 8;
    let sparkleCounter = 0;
    
    // Create cursor trails
    for (let i = 0; i < maxTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (1 - i / maxTrails) * 0.5;
        trail.style.transform = `scale(${1 - i / maxTrails})`;
        body.appendChild(trail);
        trails.push({ element: trail, x: 0, y: 0 });
    }
    
    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Create sparkles occasionally
        sparkleCounter++;
        if (sparkleCounter % 3 === 0) {
            createSparkle(mouseX, mouseY);
        }
    });
    
    // Animate trails
    function animateTrails() {
        let x = mouseX;
        let y = mouseY;
        
        trails.forEach((trail, index) => {
            const nextX = x;
            const nextY = y;
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
            
            trail.x += (nextX - trail.x) * (0.3 - index * 0.02);
            trail.y += (nextY - trail.y) * (0.3 - index * 0.02);
        });
        
        requestAnimationFrame(animateTrails);
    }
    animateTrails();
    
    // Create sparkle effect
    function createSparkle(x, y) {
        const sparkles = ['✨', '⭐', '💫', '🌟', '💖'];
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
        body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Cursor click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });
    
    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('.wax-seal, .blow-btn, .checkbox-label');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
    
    // Main elements
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const letterContainer = document.getElementById('letterContainer');
    const pages = document.querySelectorAll('.letter-page');
    const blowBtn = document.getElementById('blowBtn');
    const flame = document.getElementById('flame');
    const confettiContainer = document.getElementById('confettiContainer');
    const yesLabel = document.getElementById('yesLabel');
    const noLabel = document.getElementById('noLabel');
    
    let currentPage = 0;
    const totalPages = pages.length;
    let isEnvelopeOpen = false;
    let candleBlown = false;
    
    // Create page indicator dots
    function createPageIndicators() {
        for (let p = 1; p <= totalPages; p++) {
            const indicator = document.getElementById('pageIndicator' + p);
            if (indicator) {
                indicator.innerHTML = '';
                for (let i = 0; i < totalPages; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'page-dot' + (i === currentPage ? ' active' : '');
                    indicator.appendChild(dot);
                }
            }
        }
    }
    createPageIndicators();
    
    // Open envelope on click
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        openEnvelope();
    });
    
    envelope.addEventListener('click', openEnvelope);
    
    function openEnvelope() {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;
        
        // Animate envelope opening - all flaps
        envelope.classList.add('open');
        
        // Hide envelope and show letter
        setTimeout(() => {
            envelope.classList.add('hidden');
            letterContainer.classList.add('visible');
            createConfetti();
        }, 1000);
    }
    
    // Click to navigate pages
    letterContainer.addEventListener('click', (e) => {
        // Don't navigate if clicking on interactive elements
        if (e.target.closest('.blow-btn') || 
            e.target.closest('.checkbox-label') ||
            e.target.closest('#yesCheck') ||
            e.target.closest('#noCheck')) {
            return;
        }
        
        goToNextPage();
    });
    
    function goToNextPage() {
        if (currentPage >= totalPages - 1) {
            // On last page, restart or do nothing
            currentPage = 0;
            updatePages();
            return;
        }
        
        // Animate current page out
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add('exit');
        
        // Move to next page
        currentPage++;
        
        // After animation, update pages
        setTimeout(() => {
            updatePages();
        }, 100);
    }
    
    function updatePages() {
        pages.forEach((page, index) => {
            page.classList.remove('active', 'exit');
            if (index === currentPage) {
                page.classList.add('active');
            }
        });
        
        // Update all page indicators
        createPageIndicators();
    }
    
    // Blow candle functionality
    blowBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        blowCandle();
    });
    
    function blowCandle() {
        if (candleBlown) return;
        candleBlown = true;
        
        flame.classList.add('blown');
        blowBtn.classList.add('hidden');
        
        // Create celebration confetti
        setTimeout(() => {
            createConfetti();
            showWishGranted();
        }, 500);
    }
    
    function showWishGranted() {
        const wishText = document.createElement('p');
        wishText.textContent = '🎉 Your wish will come true! 🎉';
        wishText.style.cssText = `
            text-align: center;
            color: #e91e63;
            font-size: 24px;
            margin-top: 20px;
            animation: fadeIn 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        const candleSection = document.querySelector('.candle-section');
        candleSection.appendChild(wishText);
    }
    
    // Confetti creation
    function createConfetti() {
        const colors = ['#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b6b', '#c44dff', '#fff'];
        const shapes = ['■', '●', '▲', '♦', '★', '♥', '✦'];
        
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.fontSize = (Math.random() * 20 + 10) + 'px';
                confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                
                confettiContainer.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 4500);
            }, i * 20);
        }
    }
    
    // Yes checkbox interaction
    const yesCheck = document.getElementById('yesCheck');
    
    yesCheck.addEventListener('change', function(e) {
        e.stopPropagation();
        if (this.checked) {
            createConfetti();
            
            // Add heart burst animation
            const hearts = document.createElement('div');
            hearts.innerHTML = '💕💕💕';
            hearts.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 60px;
                animation: heartBurst 1s ease forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            document.body.appendChild(hearts);
            
            // Add keyframes for heart animation
            if (!document.querySelector('#heartBurstStyle')) {
                const style = document.createElement('style');
                style.id = 'heartBurstStyle';
                style.textContent = `
                    @keyframes heartBurst {
                        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
                        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => hearts.remove(), 1000);
        }
    });
    
    // Prevent checkbox clicks from triggering page navigation
    yesLabel.addEventListener('click', (e) => e.stopPropagation());
    noLabel.addEventListener('click', (e) => e.stopPropagation());
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    letterContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    letterContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - e.changedTouches[0].screenY);
        
        // If it's more of a tap than a swipe
        if (Math.abs(diffX) < 30 && diffY < 30) {
            // Check if not tapping on interactive elements
            if (!e.target.closest('.blow-btn') && 
                !e.target.closest('.checkbox-label')) {
                goToNextPage();
            }
        } else if (diffX > 50) {
            // Swipe left - next page
            goToNextPage();
        }
    }, false);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isEnvelopeOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                openEnvelope();
            }
            return;
        }
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            goToNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Go to previous page
            if (currentPage > 0) {
                currentPage--;
                updatePages();
            }
        }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trails.forEach(trail => trail.element.style.opacity = '0');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        trails.forEach((trail, i) => trail.element.style.opacity = (1 - i / maxTrails) * 0.5);
    });
});
