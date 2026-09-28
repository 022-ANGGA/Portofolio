/**
 * Theme Toggle Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const sunIcon = `
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  `;
  
  const moonIcon = `
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  `;

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.innerHTML = moonIcon;
  } else {
    themeIcon.innerHTML = sunIcon;
  }

  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      themeIcon.innerHTML = sunIcon;
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeIcon.innerHTML = moonIcon;
    }
  });
});

/**
 * Slideshow & Lightbox Logic
 */
document.addEventListener("DOMContentLoaded", () => {
  const projectVisuals = document.querySelectorAll('.project-visual');
  
  projectVisuals.forEach(visual => {
    const images = visual.querySelectorAll('img');
    if (images.length > 1) {
      visual.style.display = 'grid';
      images.forEach((img, index) => {
        img.style.gridArea = '1 / 1';
        img.style.opacity = index === 0 ? '1' : '0';
        img.style.transition = 'opacity 0.8s ease-in-out';
        img.style.zIndex = index === 0 ? '1' : '0';
      });

      let currentIndex = 0;
      setInterval(() => {
        images[currentIndex].style.opacity = '0';
        images[currentIndex].style.zIndex = '0';
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.opacity = '1';
        images[currentIndex].style.zIndex = '1';
      }, 3000);
    }
  });

  // --- Logika Lightbox (Popup Gambar & Slider) ---
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  
  const lightboxClose = document.createElement('button');
  lightboxClose.className = 'lightbox-close';
  lightboxClose.innerHTML = '&times;';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-prev';
  prevBtn.innerHTML = '&#10094;';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-next';
  nextBtn.innerHTML = '&#10095;';
  
  const lightboxImg = document.createElement('img');
  
  lightbox.appendChild(lightboxClose);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);
  
  let currentGroup = [];
  let currentIndex = 0;

  function showImage(index) {
    if (currentGroup.length === 0) return;
    currentIndex = index;
    if (currentIndex < 0) currentIndex = currentGroup.length - 1;
    if (currentIndex >= currentGroup.length) currentIndex = 0;
    
    lightboxImg.src = currentGroup[currentIndex].src;
    
    if (currentGroup.length > 1) {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  projectVisuals.forEach(visual => {
    const images = Array.from(visual.querySelectorAll('img'));
    images.forEach((img, idx) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        currentGroup = images;
        showImage(idx);
        lightbox.classList.add('active');
      });
    });
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
  
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
      lightbox.classList.remove('active');
    }
  });
});

/**
 * Scroll & Intersection Observer Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

/**
 * PDF Download Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-pdf-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const originalText = this.innerText;
      this.innerText = 'Mengunduh...';
      this.style.pointerEvents = 'none';
      const element = document.body;
      const opt = {
        margin: 0,
        filename: 'Portofolio_Susanto_Angga.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: [297, 210], orientation: 'landscape' }
      };
      html2pdf().set(opt).from(element).save().then(() => {
        this.innerText = originalText;
        this.style.pointerEvents = 'auto';
      }).catch(err => {
        alert('Gagal mengunduh PDF. Pastikan Anda memiliki koneksi internet, atau coba jalankan melalui Local Server.');
        console.error(err);
        this.innerText = originalText;
        this.style.pointerEvents = 'auto';
      });
    });
  }
});
