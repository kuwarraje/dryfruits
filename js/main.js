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
  // 5. Dynamic Products Rendering & Google Sheets CMS Integration
  // ==========================================
  async function initDynamicProducts() {
    const products = await loadProductsData();
    
    // 5a. If on Products Catalog Page
    const catalogGrid = document.getElementById('products-catalog-grid');
    if (catalogGrid) {
      catalogGrid.innerHTML = ''; // Clear static loading cards
      
      products.forEach(product => {
        const cardHTML = generateCatalogCardHTML(product);
        catalogGrid.insertAdjacentHTML('beforeend', cardHTML);
      });
      
      // Re-initialize Category Filtering & Weight Selector listeners
      setupCategoryFiltering();
      setupWeightSelectors();
    }
    
    // 5b. If on Home Page Featured Slider
    const sliderContainer = document.getElementById('featured-products-container');
    if (sliderContainer) {
      sliderContainer.innerHTML = ''; // Clear static loading cards
      
      const featuredProducts = products.filter(p => p.is_featured === true || p.is_featured === "TRUE");
      
      featuredProducts.forEach(product => {
        const cardHTML = generateSliderCardHTML(product);
        sliderContainer.insertAdjacentHTML('beforeend', cardHTML);
      });
      
      // Re-initialize slider buttons
      setupFeaturedSlider();
    }
  }

  // Generate Catalog Card HTML
  function generateCatalogCardHTML(product) {
    const isOutOfStock = product.out_of_stock === true || product.out_of_stock === "TRUE";
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
    const soldOutBadgeHTML = isOutOfStock 
      ? `<span class="product-badge out-of-stock-badge" style="background-color: #8b0000; color: #fff;">Sold Out</span>` 
      : badgeHTML;
    
    let optionsHTML = '';
    let initialPrice = 0;
    let initialWeightText = '';
    
    if (product.price_250g) {
      optionsHTML += `<option value="250g" data-price="${product.price_250g}" selected>250g - ₹${product.price_250g}</option>`;
      if (initialPrice === 0) {
        initialPrice = product.price_250g;
        initialWeightText = '250g';
      }
    }
    if (product.price_500g) {
      optionsHTML += `<option value="500g" data-price="${product.price_500g}">500g - ₹${product.price_500g}</option>`;
      if (initialPrice === 0) {
        initialPrice = product.price_500g;
        initialWeightText = '500g';
      }
    }
    if (product.price_1kg) {
      optionsHTML += `<option value="1kg" data-price="${product.price_1kg}">1kg - ₹${product.price_1kg.toLocaleString('en-IN')}</option>`;
      if (initialPrice === 0) {
        initialPrice = product.price_1kg;
        initialWeightText = '1kg';
      }
    }
    
    const selectHTML = isOutOfStock 
      ? `<select class="weight-selector" disabled style="opacity: 0.6; pointer-events: none;"><option>Out of Stock</option></select>` 
      : `<select class="weight-selector" id="weight-select-${product.id}" data-product="${product.name}">
          ${optionsHTML}
         </select>`;

    const initialWhatsAppText = encodeURIComponent(`Hi W-Biz Dry Fruits, I am interested in inquiring about ${product.name} (${initialWeightText}) priced at ₹${initialPrice}. Please provide shipping info.`);
    
    const actionHTML = isOutOfStock
      ? `<button class="btn btn-whatsapp text-center" disabled style="background: #555; border-color: #555; cursor: not-allowed; pointer-events: none; opacity: 0.7;">
          <i class="fa-solid fa-ban"></i> Temporarily Out of Stock
         </button>`
      : `<a href="https://wa.me/919999999999?text=${initialWhatsAppText}" target="_blank" class="btn btn-whatsapp text-center whatsapp-inquiry-btn">
          <i class="fa-brands fa-whatsapp"></i> Inquiry on WhatsApp
         </a>`;

    return `
      <div class="product-card product-item" data-category="${product.category}" style="${isOutOfStock ? 'opacity: 0.85;' : ''}">
        <div class="product-img-wrap">
          ${soldOutBadgeHTML}
          <img src="${product.image}" alt="${product.name} W-Biz Wakad Pune">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          
          <label for="weight-select-${product.id}" style="display:none">Select Weight</label>
          ${selectHTML}
          
          <div class="product-price-row">
            <span class="product-price">₹<span class="price-val">${initialPrice.toLocaleString('en-IN')}</span></span>
          </div>
          
          <div class="product-actions">
            ${actionHTML}
          </div>
        </div>
      </div>
    `;
  }

  // Generate Slider Card HTML
  function generateSliderCardHTML(product) {
    const isOutOfStock = product.out_of_stock === true || product.out_of_stock === "TRUE";
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
    const soldOutBadgeHTML = isOutOfStock 
      ? `<span class="product-badge out-of-stock-badge" style="background-color: #8b0000; color: #fff;">Sold Out</span>` 
      : badgeHTML;
    
    let priceRange = "";
    let weightRange = "";
    
    const prices = [];
    const weights = [];
    if (product.price_250g) {
      prices.push(product.price_250g);
      weights.push("250g");
    }
    if (product.price_500g) {
      prices.push(product.price_500g);
      weights.push("500g");
    }
    if (product.price_1kg) {
      prices.push(product.price_1kg);
      weights.push("1kg");
    }
    
    if (prices.length === 1) {
      priceRange = `₹${prices[0].toLocaleString('en-IN')}`;
      weightRange = weights[0];
    } else if (prices.length > 1) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      priceRange = `₹${minPrice} - ₹${maxPrice.toLocaleString('en-IN')}`;
      weightRange = `${weights[0]} - ${weights[weights.length - 1]}`;
    } else {
      priceRange = "Call for Price";
      weightRange = "Custom";
    }

    return `
      <div class="product-card" style="${isOutOfStock ? 'opacity: 0.85;' : ''}">
        <div class="product-img-wrap">
          ${soldOutBadgeHTML}
          <img src="${product.image}" alt="${product.name} at W-Biz Dry Fruits in Pune">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-price-row">
            <span class="product-price">${priceRange}</span>
            <span class="product-weight">${weightRange}</span>
          </div>
          <div class="product-actions">
            <a href="products.html?category=${product.category}" class="btn btn-dark text-center">
              ${isOutOfStock ? 'Sold Out - View Info' : 'View Options'}
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // 5c. Setup Horizontal Featured Slider listeners
  function setupFeaturedSlider() {
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
        // Remove old event listener by replacing the button clone
        const nextClone = slideNext.cloneNode(true);
        slideNext.parentNode.replaceChild(nextClone, slideNext);
        nextClone.addEventListener('click', () => {
          sliderContainer.scrollBy({ left: getScrollVal(), behavior: 'smooth' });
        });
      }

      if (slidePrev) {
        const prevClone = slidePrev.cloneNode(true);
        slidePrev.parentNode.replaceChild(prevClone, slidePrev);
        prevClone.addEventListener('click', () => {
          sliderContainer.scrollBy({ left: -getScrollVal(), behavior: 'smooth' });
        });
      }
    }
  }

  // 5d. Setup Category Filtering (Products Page)
  function setupCategoryFiltering() {
    const productFilterTabs = document.getElementById('category-filter-tabs');
    const catalogGrid = document.getElementById('products-catalog-grid');

    if (productFilterTabs && catalogGrid) {
      const filterBtns = productFilterTabs.querySelectorAll('.filter-btn');
      const productItems = catalogGrid.querySelectorAll('.product-item');

      filterBtns.forEach(btn => {
        // Clean old listeners
        const btnClone = btn.cloneNode(true);
        btn.parentNode.replaceChild(btnClone, btn);
        
        btnClone.addEventListener('click', () => {
          // Toggle Active Button Class
          const currentFilterBtns = productFilterTabs.querySelectorAll('.filter-btn');
          currentFilterBtns.forEach(b => b.classList.remove('active'));
          btnClone.classList.add('active');

          const filterVal = btnClone.getAttribute('data-filter');

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
  }

  // 5e. Setup Weight & Price Recalculation + WhatsApp Link
  function setupWeightSelectors() {
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
  }

  // Kickstart dynamic loading system!
  initDynamicProducts();

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
