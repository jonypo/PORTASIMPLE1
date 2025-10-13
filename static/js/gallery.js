// Gallery Navigation
let currentImageIndex = 0;
let totalImages = 0;
// Store rich objects: { src, title }
let imageSources = [];
let mode = 'home'; // 'home' or 'category'
let categoryDomImages = [];

// Check image aspect ratio and apply appropriate styling
function checkImageAspect(img) {
    const apply = function() {
        const aspect = this.naturalWidth / this.naturalHeight;
        // Keep viewport-sized dimensions from CSS; just switch fit mode
        if (aspect >= 1) {
            // Horizontal or square -> cubrir toda la pantalla
            this.style.objectFit = 'cover';
            this.style.objectPosition = 'center';
            // Reset background color for horizontal images
            document.body.style.backgroundColor = '#0f719b';
        } else {
            // Vertical -> contener para que se vea fondo a los lados
            this.style.objectFit = 'contain';
            this.style.objectPosition = 'center';
            // Apply custom background color for vertical images
            const imageData = getCurrentImageData();
            if (imageData && imageData.background_color) {
                document.body.style.backgroundColor = imageData.background_color;
            }
        }
    };
    if (img.complete && img.naturalWidth > 0) {
        apply.call(img);
    } else {
        img.onload = apply;
    }
}

// Check all images on page load
function checkAllImages() {
    const imgEl = document.querySelector('.gallery-container img');
    if (imgEl) {
        checkImageAspect(imgEl);
    }
    const categoryImgs = document.querySelectorAll('.clone-gallery-img');
    categoryImgs.forEach(img => checkImageAspect(img));
}

// Initialize image sources from the existing HTML structure
function parseImageDataFromJSON() {
    const dataEl = document.getElementById('image-data');
    if (!dataEl) return [];
    try {
        const parsed = JSON.parse(dataEl.textContent || '[]');
        if (Array.isArray(parsed)) {
            return parsed
                .filter(item => item && item.src)
                .map(item => ({ 
                    src: String(item.src), 
                    title: item.title ? String(item.title) : '',
                    background_color: item.background_color ? String(item.background_color) : '#0f719b'
                }));
        }
        return [];
    } catch (e) {
        console.warn('Failed to parse image-data JSON:', e);
        return [];
    }
}

// Get current image data based on mode
function getCurrentImageData() {
    if (mode === 'category') {
        const currentImg = categoryDomImages[currentImageIndex];
        if (currentImg) {
            const dataIndex = parseInt(currentImg.getAttribute('data-index'));
            return imageSources[dataIndex];
        }
    } else {
        return imageSources[currentImageIndex];
    }
    return null;
}

function initializeImageSources() {
    // Detect category mode by presence of cloned gallery container
    const categoryContainer = document.querySelector('.clone-gallery-img-container');
    if (categoryContainer) {
        mode = 'category';
        categoryDomImages = Array.from(categoryContainer.querySelectorAll('.clone-gallery-img'));
        totalImages = categoryDomImages.length;
        const current = categoryDomImages.findIndex(img => img.classList.contains('active'));
        currentImageIndex = current >= 0 ? current : 0;
        categoryDomImages.forEach((img, idx) => {
            img.style.display = idx === currentImageIndex ? 'block' : 'none';
            checkImageAspect(img);
        });
        console.log('[gallery] mode=category totalImages=', totalImages, 'current=', currentImageIndex);
        return;
    }

    // Home mode: Prefer server-provided JSON data
    mode = 'home';
    const jsonImages = parseImageDataFromJSON();
    if (jsonImages.length > 0) {
        imageSources = jsonImages;
        totalImages = imageSources.length;
        // Initialize first image on home page if present
        const imgEl = document.querySelector('.gallery-container img');
        if (imgEl) {
            imgEl.src = imageSources[0].src;
            if (imageSources[0].title) imgEl.alt = imageSources[0].title;
            checkImageAspect(imgEl);
        }
        console.log('[gallery] mode=home (json) totalImages=', totalImages);
        return;
    }

    // Fallback: use the current image (no hardcoded externals)
    const imgEl = document.querySelector('.gallery-container img');
    if (imgEl && imgEl.src) {
        imageSources = [{ src: imgEl.src, title: imgEl.alt || '' }];
        totalImages = imageSources.length;
        checkImageAspect(imgEl);
        console.log('[gallery] mode=home (fallback) totalImages=', totalImages);
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeImageSources();
    updateCounter();
    checkAllImages();
    
    // Handle preview mode if enabled
    handlePreviewMode();
    
    // Start auto-advance if there are multiple images
    if (totalImages >= 2) {
        startAutoAdvance(5000);
    } else {
        console.log('[gallery] auto-advance disabled, totalImages < 2');
    }
    
    // Add click handlers for navigation buttons
    const prevBtn = document.querySelector('.arrow-left') || document.querySelector('.clone-arrow.left');
    const nextBtn = document.querySelector('.arrow-right') || document.querySelector('.clone-arrow.right');
    
    console.log('[gallery] Navigation buttons found:', { prevBtn: !!prevBtn, nextBtn: !!nextBtn });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('[gallery] Previous button clicked');
            previousImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('[gallery] Next button clicked');
            nextImage();
        });
    }
    
    // Add hover effects for navigation buttons
    const navButtons = document.querySelectorAll('.slider-arrow, .clone-arrow');
    navButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1)';
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                previousImage();
            }
        }
    }
    
    // Add smooth transitions between images
    addTransitionEffects();
});

// Show specific image
function showImage(index) {
    if (mode === 'category') {
        if (!categoryDomImages.length) return;
        const newIndex = ((index % totalImages) + totalImages) % totalImages;
        categoryDomImages.forEach((img, idx) => {
            if (idx === newIndex) {
                img.classList.add('active');
                img.style.display = 'block';
                checkImageAspect(img);
            } else {
                img.classList.remove('active');
                img.style.display = 'none';
            }
        });
        currentImageIndex = newIndex;
        updateCounter();
        return;
    }

    const imgEl = document.querySelector('.gallery-container img');
    if (imgEl && imageSources[index]) {
        imgEl.src = imageSources[index].src;
        imgEl.alt = imageSources[index].title || imgEl.alt || '';
        currentImageIndex = index;
        updateCounter();
        checkImageAspect(imgEl);
    }
}

// Next image
function nextImage() {
    console.log('[gallery] nextImage called, totalImages:', totalImages, 'currentIndex:', currentImageIndex);
    if (totalImages > 0) {
        const nextIndex = (currentImageIndex + 1) % totalImages;
        console.log('[gallery] Moving to next image index:', nextIndex);
        showImage(nextIndex);
    }
}

// Previous image
function previousImage() {
    console.log('[gallery] previousImage called, totalImages:', totalImages, 'currentIndex:', currentImageIndex);
    if (totalImages > 0) {
        const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        console.log('[gallery] Moving to previous image index:', prevIndex);
        showImage(prevIndex);
    }
}

// Update counter display
function updateCounter() {
    const currentElement = document.getElementById('current-image');
    const totalElement = document.getElementById('total-images');
    
    if (currentElement && totalElement) {
        currentElement.textContent = currentImageIndex + 1;
        totalElement.textContent = totalImages;
    }
}

// Auto-advance gallery (optional)
function startAutoAdvance(interval = 5000) {
    if (window.autoAdvanceInterval) {
        clearInterval(window.autoAdvanceInterval);
    }
    window.autoAdvanceInterval = setInterval(() => {
        nextImage();
    }, interval);
}

// Stop auto-advance
function stopAutoAdvance() {
    // Clear any existing intervals
    clearInterval(window.autoAdvanceInterval);
}

// Add smooth transitions between images
function addTransitionEffects() {
    const images = document.querySelectorAll('.gallery-item');
    images.forEach(img => {
        img.style.transition = 'opacity 0.5s ease-in-out';
    });
}

// Handle preview mode
function handlePreviewMode() {
    const previewDataEl = document.getElementById('preview-data');
    if (previewDataEl) {
        try {
            const previewData = JSON.parse(previewDataEl.textContent);
            if (previewData.is_preview && previewData.preview_image) {
                // Find the preview image in the current image sources
                const previewImage = previewData.preview_image;
                const previewIndex = imageSources.findIndex(img => img.src === previewImage.src);
                
                if (previewIndex !== -1) {
                    // Set the current image to the preview image
                    currentImageIndex = previewIndex;
                    updateGalleryDisplay();
                    
                    // Add a visual indicator that we're in preview mode
                    const galleryContainer = document.querySelector('.gallery-container');
                    if (galleryContainer) {
                        galleryContainer.style.border = '3px solid #0f719b';
                        galleryContainer.style.borderRadius = '8px';
                        galleryContainer.style.boxShadow = '0 0 20px rgba(15, 113, 155, 0.5)';
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing preview data:', e);
        }
    }
} 