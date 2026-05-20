/*
========================================================================
   W-BIZ DRY FRUITS & NUTS STORE - GLOBAL INTERACTIVE JAVASCRIPT
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Preloader Screen Fade Out
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
    
    // Safety fallback if load event fired earlier
    if (document.readyState === 'complete') {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
  }

  // ==========================================
  // 2. Sticky Header Navigation on Scroll
  // ==========================================
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // ==========================================
  // 3. Mobile Hamburger Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.getElementById('menu-links');
  
  if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      menuLinks.classList.toggle('active');
    });

    // Close mobile menu on clicking any navigation link
    const navItems = menuLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menuLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 4. Scroll Entrance Reveal Animations (Observer API)
  // ==========================================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.12, // Trigger when 12% is visible
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });
  }

  // ==========================================
  // 5. Featured Products Horizontal Slider (Home Page)
  // ==========================================
  const sliderContainer = document.getElementById('featured-products-container');
  const slidePrev = document.getElementById('slide-prev');
  const slideNext = document.getElementById('slide-next');

  if (sliderContainer) {
    const getScrollVal = () => {
      const card = sliderContainer.querySelector('.product-card');
      if (card) {
        return card.clientWidth + 30; // Card width + gap
      }
      return 320;
    };

    if (slideNext) {
      slideNext.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: getScrollVal(), behavior: 'smooth' });
      });
    }

    if (slidePrev) {
      slidePrev.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: -getScrollVal(), behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 6. Testimonial Carousel Auto-Scroll & Dots
  // ==========================================
  const testimonialTrack = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('carousel-dots-container');

  if (testimonialTrack) {
    const slides = testimonialTrack.querySelectorAll('.testimonial-slide');
    let currentSlideIndex = 0;
    let autoPlayInterval;

    // Create dot indicators
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    const goToSlide = (index) => {
      currentSlideIndex = index;
      testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
      
      // Update dots status
      dots.forEach((dot, dotIdx) => {
        if (dotIdx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      let nextIdx = currentSlideIndex + 1;
      if (nextIdx >= slides.length) nextIdx = 0;
      goToSlide(nextIdx);
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000); // Shift every 6s
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    // Initialize Auto-play
    startAutoPlay();

    // Touch Swipe Support for Testimonial Carousel
    let startX = 0;
    let endX = 0;
    
    testimonialTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    testimonialTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const swipeDistance = endX - startX;
      
      if (Math.abs(swipeDistance) > 50) { // Threshold
        if (swipeDistance < 0) {
          // Swipe Left -> Next
          let nextIdx = currentSlideIndex + 1;
          if (nextIdx < slides.length) {
            goToSlide(nextIdx);
            resetAutoPlay();
          }
        } else {
          // Swipe Right -> Prev
          let prevIdx = currentSlideIndex - 1;
          if (prevIdx >= 0) {
            goToSlide(prevIdx);
            resetAutoPlay();
          }
        }
      }
    });
  }

  // ==========================================
  // 7. Dynamic Category Filtering (Products Page)
  // ==========================================
  const productFilterTabs = document.getElementById('category-filter-tabs');
  const catalogGrid = document.getElementById('products-catalog-grid');

  if (productFilterTabs && catalogGrid) {
    const filterBtns = productFilterTabs.querySelectorAll('.filter-btn');
    const productItems = catalogGrid.querySelectorAll('.product-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Button Class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        catalogGrid.style.opacity = '0';
        
        setTimeout(() => {
          productItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterVal === 'all' || category === filterVal) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
          catalogGrid.style.opacity = '1';
        }, 300);
      });
    });

    // Check URL parameters for custom landing category filters (e.g. index links)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      const matchingBtn = productFilterTabs.querySelector(`.filter-btn[data-filter="${catParam}"]`);
      if (matchingBtn) {
        setTimeout(() => matchingBtn.click(), 100);
      }
    }
  }

  // ==========================================
  // 8. Dynamic Weight & Price Recalculation + WhatsApp Link
  // ==========================================
  const weightSelectors = document.querySelectorAll('.weight-selector');
  
  if (weightSelectors.length > 0) {
    weightSelectors.forEach(selector => {
      selector.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const weightText = selectedOption.text.split(' - ')[0]; // E.g., '500g'
        const productName = e.target.getAttribute('data-product');

        // Locate target card parent element
        const card = e.target.closest('.product-card');
        if (card) {
          // 1. Update visual price tag
          const priceValueTag = card.querySelector('.price-val');
          if (priceValueTag) {
            priceValueTag.textContent = parseFloat(price).toLocaleString('en-IN');
          }

          // 2. Dynamically construct WhatsApp inquiry URL
          const whatsappBtn = card.querySelector('.whatsapp-inquiry-btn');
          if (whatsappBtn) {
            const rawText = `Hi W-Biz Dry Fruits, I am interested in inquiring about the ${productName} (${weightText}) priced at ₹${price}. Please provide shipping info.`;
            const encodedText = encodeURIComponent(rawText);
            whatsappBtn.href = `https://wa.me/919999999999?text=${encodedText}`;
          }
        }
      });
    });
  }

  // ==========================================
  // 9. Interactive Gallery Lightbox Modal
  // ==========================================
  const galleryFilterTabs = document.getElementById('gallery-filter-tabs');
  const imageGrid = document.getElementById('gallery-image-grid');
  const lightboxModal = document.getElementById('lightbox-modal');

  // Simple category filter for gallery first
  if (galleryFilterTabs && imageGrid) {
    const filterBtns = galleryFilterTabs.querySelectorAll('.filter-btn');
    const galleryItems = imageGrid.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');
        imageGrid.style.opacity = '0';

        setTimeout(() => {
          galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterVal === 'all' || category === filterVal) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
          imageGrid.style.opacity = '1';
        }, 300);
      });
    });
  }

  // Lightbox slider mechanics
  if (lightboxModal && imageGrid) {
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const activeImg = document.getElementById('lightbox-active-img');
    const activeCaption = document.getElementById('lightbox-active-caption');
    
    // Get only visible gallery items for index reference
    const getVisibleItems = () => {
      return Array.from(imageGrid.querySelectorAll('.gallery-item')).filter(item => item.style.display !== 'none');
    };

    let activeIndex = 0;

    const openLightbox = (index) => {
      const visibleItems = getVisibleItems();
      if (index < 0 || index >= visibleItems.length) return;
      
      activeIndex = index;
      const targetCard = visibleItems[index];
      const src = targetCard.getAttribute('data-src');
      const caption = targetCard.getAttribute('data-caption');

      activeImg.src = src;
      activeCaption.textContent = caption;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    const nextImage = () => {
      const visibleItems = getVisibleItems();
      let nextIndex = activeIndex + 1;
      if (nextIndex >= visibleItems.length) nextIndex = 0;
      openLightbox(nextIndex);
    };

    const prevImage = () => {
      const visibleItems = getVisibleItems();
      let prevIndex = activeIndex - 1;
      if (prevIndex < 0) prevIndex = visibleItems.length - 1;
      openLightbox(prevIndex);
    };

    // Click trigger on cards
    imageGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (card) {
        const visibleItems = getVisibleItems();
        const cardIndex = visibleItems.indexOf(card);
        if (cardIndex !== -1) {
          openLightbox(cardIndex);
        }
      }
    });

    // Control binds
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    // Close on clicking modal backdrop
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard navigation binding
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  // ==========================================
  // 10. FAQ Accordions (Home Page)
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      const answerBlock = item.querySelector('.faq-answer');

      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs for clean accordion effect
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = '0';
        });

        if (!isActive) {
          item.classList.add('active');
          // Read full scroll height for smooth dynamic opening
          answerBlock.style.maxHeight = answerBlock.scrollHeight + 'px';
        }
      });
    });
  }

  // ==========================================
  // 11. Form Submissions (Newsletters, Contact Form, Corporate Form)
  // ==========================================
  const showPremiumAlert = (title, message, isError = false) => {
    // Create an elegant glassmorphism alert notification popup
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '25px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%) translateY(-20px)';
    alertDiv.style.opacity = '0';
    alertDiv.style.backgroundColor = isError ? '#8b0000' : 'rgba(30, 18, 12, 0.95)';
    alertDiv.style.border = '1px solid var(--accent-gold)';
    alertDiv.style.color = '#fff';
    alertDiv.style.padding = '20px 40px';
    alertDiv.style.borderRadius = '6px';
    alertDiv.style.zIndex = '99999';
    alertDiv.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.2)';
    alertDiv.style.backdropFilter = 'blur(10px)';
    alertDiv.style.textAlign = 'center';
    alertDiv.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    alertDiv.style.minWidth = '320px';

    alertDiv.innerHTML = `
      <h4 style="font-family:'Playfair Display', serif; color: var(--accent-gold); font-size: 1.25rem; margin-bottom: 8px;">${title}</h4>
      <p style="font-size: 0.95rem; opacity: 0.9;">${message}</p>
    `;

    document.body.appendChild(alertDiv);

    // Animate In
    setTimeout(() => {
      alertDiv.style.transform = 'translateX(-50%) translateY(0)';
      alertDiv.style.opacity = '1';
    }, 100);

    // Animate Out and destroy
    setTimeout(() => {
      alertDiv.style.transform = 'translateX(-50%) translateY(-20px)';
      alertDiv.style.opacity = '0';
      setTimeout(() => {
        alertDiv.remove();
      }, 500);
    }, 4500);
  };

  // Newsletter Submit
  const newsletterForms = document.querySelectorAll('#footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (email) {
        showPremiumAlert('Subscription Successful', `Thank you! ${email} has been subscribed to W-Biz gourmet alerts.`);
        form.reset();
      }
    });
  });

  // Main Contact Form
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      
      showPremiumAlert('Message Sent', `Dear ${name}, thank you for writing to W-Biz Dry Fruits. Our Wakad, Pune concierge team will email you at ${email} shortly.`);
      contactForm.reset();
    });
  }

  // Products Inquiry Custom Form
  const productInqForm = document.getElementById('product-inquiry-form');
  if (productInqForm) {
    productInqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inq-name').value.trim();
      const phone = document.getElementById('inq-phone').value.trim();
      const type = document.getElementById('inq-type').options[document.getElementById('inq-type').selectedIndex].text;
      const quantity = document.getElementById('inq-quantity').value;

      showPremiumAlert('Inquiry Submitted', `Hello ${name}, your B2B request for ${quantity} units of [${type}] is recorded. We will call you at ${phone} within 2 hours.`);
      productInqForm.reset();
    });
  }

});
