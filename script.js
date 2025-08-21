// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// DOM Elements
const birthDateInput = document.getElementById('birthDate');
const calculateBtn = document.getElementById('calculateBtn');
const resultsCard = document.getElementById('resultsCard');
const ageNumber = document.getElementById('ageNumber');
const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');
const hoursSpan = document.getElementById('hours');
const heartbeatsSpan = document.getElementById('heartbeats');
const breathsSpan = document.getElementById('breaths');
const stepsSpan = document.getElementById('steps');

// Set max date to today
const today = new Date();
const maxDate = today.toISOString().split('T')[0];
birthDateInput.setAttribute('max', maxDate);

// Age calculation function
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    // Ensure we're working with dates at the same time of day for accurate calculation
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthDateObj = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
    
    // Calculate years
    let years = todayDate.getFullYear() - birthDateObj.getFullYear();
    
    // Calculate months
    let months = todayDate.getMonth() - birthDateObj.getMonth();
    
    // Calculate days
    let days = todayDate.getDate() - birthDateObj.getDate();
    
    // Adjust for negative months or days
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }
    
    // Fix days calculation when days are negative
    if (days < 0) {
        // Get the last day of the previous month
        const lastMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        days = lastMonth.getDate() - birthDateObj.getDate() + todayDate.getDate();
        months--;
        
        // Adjust months if it becomes negative
        if (months < 0) {
            months += 12;
            years--;
        }
    }
    
    // Calculate hours (using original dates for precise calculation)
    const hours = Math.floor((today - birth) / (1000 * 60 * 60));
    
    return {
        years,
        months,
        days,
        hours,
        totalDays: Math.floor((today - birth) / (1000 * 60 * 60 * 24))
    };
}

// Animate number counting
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Format large numbers with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Calculate fun facts
function calculateFunFacts(totalDays) {
    const heartbeatsPerMinute = 80;
    const breathsPerMinute = 16;
    const stepsPerDay = 8000;
    
    const totalMinutes = totalDays * 24 * 60;
    const totalHeartbeats = totalMinutes * heartbeatsPerMinute;
    const totalBreaths = totalMinutes * breathsPerMinute;
    const totalSteps = totalDays * stepsPerDay;
    
    return {
        heartbeats: totalHeartbeats,
        breaths: totalBreaths,
        steps: totalSteps
    };
}

// Show results with animations
function showResults(ageData) {
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth' });
    
    // Animate age number
    animateNumber(ageNumber, ageData.years);
    
    // Animate detailed results
    setTimeout(() => animateNumber(yearsSpan, ageData.years), 200);
    setTimeout(() => animateNumber(monthsSpan, ageData.months), 400);
    setTimeout(() => animateNumber(daysSpan, ageData.days), 600);
    setTimeout(() => animateNumber(hoursSpan, ageData.hours), 800);
    
    // Calculate and animate fun facts
    const funFacts = calculateFunFacts(ageData.totalDays);
    setTimeout(() => animateNumber(heartbeatsSpan, funFacts.heartbeats), 1000);
    setTimeout(() => animateNumber(breathsSpan, funFacts.breaths), 1200);
    setTimeout(() => animateNumber(stepsSpan, funFacts.steps), 1400);
}

// Validate date input
function validateDate(dateString) {
    if (!dateString) {
        showError('Please select your birth date');
        return false;
    }
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    if (selectedDate > today) {
        showError('Birth date cannot be in the future');
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Calculate button click handler
calculateBtn.addEventListener('click', () => {
    const birthDate = birthDateInput.value;
    
    if (!validateDate(birthDate)) {
        return;
    }
    
    // Show loading state
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<span class="loading"></span> Calculating...';
    calculateBtn.disabled = true;
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
        const ageData = calculateAge(birthDate);
        showResults(ageData);
        
        // Reset button
        calculateBtn.innerHTML = originalText;
        calculateBtn.disabled = false;
    }, 800);
});

// Real-time calculation on date change
birthDateInput.addEventListener('change', () => {
    const birthDate = birthDateInput.value;
    
    if (validateDate(birthDate)) {
        const ageData = calculateAge(birthDate);
        
        // Update results if they're already shown
        if (resultsCard.style.display !== 'none') {
            ageNumber.textContent = ageData.years;
            yearsSpan.textContent = ageData.years;
            monthsSpan.textContent = ageData.months;
            daysSpan.textContent = ageData.days;
            hoursSpan.textContent = formatNumber(ageData.hours);
            
            const funFacts = calculateFunFacts(ageData.totalDays);
            heartbeatsSpan.textContent = formatNumber(funFacts.heartbeats);
            breathsSpan.textContent = formatNumber(funFacts.breaths);
            stepsSpan.textContent = formatNumber(funFacts.steps);
        }
    }
});

// Enter key handler
birthDateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateBtn.click();
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to calculate button
    calculateBtn.addEventListener('mousedown', () => {
        calculateBtn.style.transform = 'scale(0.95)';
    });
    
    calculateBtn.addEventListener('mouseup', () => {
        calculateBtn.style.transform = 'scale(1)';
    });
    
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// Add smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.error-notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(() => {
    // Any scroll-based animations can go here
}, 16));

// Add loading animation for better UX
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loaded state
const loadedStyle = document.createElement('style');
loadedStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .touch-device .feature-card:hover {
        transform: none;
    }
`;
document.head.appendChild(loadedStyle); 