document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // wait, the prompt said to keep it glassmorphism. Let's add a tighter shadow on scroll.
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    
    // Initial assignment
    if(window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Hamburger menu toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('nav-open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('nav-open');
            });
        });
    }

    // Scroll reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in-section classes selectively
    const fadeElements = document.querySelectorAll('.feature-card, .section-header, .interactive-container, .video-container, .arch-content');
    fadeElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3D Hardware Explorer Logic
    const linkData = {
        0: { title: 'Link 0 (Base)', mat: 'PETG HF', weight: '55.81 g', time: '3h54m', fasteners: '12', dim: 'N/A' },
        1: { title: 'Link 1 (Shoulder Base)', mat: 'PETG HF', weight: '95.91 g', time: '6h15m', fasteners: '16', dim: 'N/A' },
        2: { title: 'Link 2 (Upper Arm)', mat: 'PETG HF', weight: '302.83 g', time: '20h9m', fasteners: '25', dim: '300.0 x 50.0 mm' },
        3: { title: 'Link 3 (Forearm)', mat: 'PETG HF', weight: '285.16 g', time: '21h16m', fasteners: '24', dim: '300.0 x 50.0 mm' },
        4: { title: 'Link 4 (Wrist Pitch)', mat: 'PETG HF', weight: '95.35 g', time: '6h46m', fasteners: '12', dim: 'N/A' },
        5: { title: 'Link 5 (Wrist Roll)', mat: 'PETG HF', weight: '95.35 g', time: '6h46m', fasteners: '12', dim: 'N/A' },
        'assembled': { title: 'Assembled Open-APEX', mat: 'PETG HF (Combined)', weight: '930+ g', time: '44+ hrs', fasteners: '101', dim: 'N/A' }
    };

    const tabBtns = document.querySelectorAll('.tab-btn');
    const mainViewer = document.getElementById('main-viewer');
    
    // Elements to update
    const uiTitle = document.getElementById('info-title');
    const uiMat = document.getElementById('info-mat');
    const uiWeight = document.getElementById('info-weight');
    const uiTime = document.getElementById('info-time');
    const uiFasteners = document.getElementById('info-fasteners');
    const uiDim = document.getElementById('info-dim');
    const dimRow = document.getElementById('dim-row');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const linkIndex = btn.getAttribute('data-link');
            const data = linkData[linkIndex];

            // Update parameters
            if(data) {
                uiTitle.textContent = data.title + ' Parameters';
                uiMat.textContent = data.mat;
                uiWeight.textContent = data.weight;
                uiTime.textContent = data.time;
                uiFasteners.textContent = data.fasteners;
                
                if (data.dim === 'N/A') {
                    dimRow.style.display = 'none';
                } else {
                    dimRow.style.display = 'flex';
                    uiDim.textContent = data.dim;
                }
            }

            // Swap viewers
            const imageContainer = document.getElementById('assembled-image-container');
            if (linkIndex === 'assembled') {
                mainViewer.style.display = 'none';
                imageContainer.style.display = 'flex';
            } else {
                mainViewer.style.display = 'block';
                imageContainer.style.display = 'none';
                mainViewer.src = `assets/model/link${linkIndex}.glb`;
            }

        });
    });

    // Make Link 0 grey when loaded in standalone viewer
    mainViewer.addEventListener('load', () => {
        if (mainViewer.src.includes('link0')) {
            const materials = mainViewer.model.materials;
            if (materials) {
                materials.forEach(mat => {
                    mat.pbrMetallicRoughness.setBaseColorFactor([0.3, 0.3, 0.3, 1]);
                });
            }
        }
    });

    // -----------------------------------------------------
    // Timeline Expandable Video Cards
    // -----------------------------------------------------
    document.querySelectorAll('.timeline-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.closest('.timeline-content');
            const video = content.querySelector('video');
            const videoSrc = content.getAttribute('data-video');
            const isExpanded = content.classList.contains('expanded');

            if (isExpanded) {
                // Collapse: pause video
                content.classList.remove('expanded');
                video.pause();
                btn.textContent = 'Watch Demo';
            } else {
                // Expand: load video if not loaded, then play
                if (!video.src || !video.src.includes(videoSrc)) {
                    video.src = videoSrc;
                }
                content.classList.add('expanded');
                video.play();
                btn.textContent = 'Hide Demo';
            }
        });
    });

    // -----------------------------------------------------
    // Expandable Capability Cards
    // -----------------------------------------------------
    const capCards = document.querySelectorAll('.cap-card');
    const capGrid = document.getElementById('capabilities-grid');

    if (capCards.length > 0 && capGrid) {
        capCards.forEach(card => {
            // Inject a close button into each card (hidden until expanded)
            const closeBtn = document.createElement('button');
            closeBtn.className = 'cap-card-close';
            closeBtn.textContent = 'Collapse';
            closeBtn.setAttribute('aria-label', 'Collapse card');
            card.appendChild(closeBtn);

            // Click card → expand only (never collapse)
            card.addEventListener('click', (e) => {
                // If already expanded, do nothing (user must use close button)
                if (card.classList.contains('card-expanded')) return;
                // Don't expand if user clicked the close button of another card
                if (e.target.classList.contains('cap-card-close')) return;

                // Collapse any currently expanded card
                capCards.forEach(c => c.classList.remove('card-expanded'));

                // Expand this card & move to top of grid
                card.classList.add('card-expanded');
                capGrid.prepend(card);
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                // Re-typeset MathJax for newly revealed formulas
                if (window.MathJax && MathJax.typesetPromise) {
                    MathJax.typesetPromise([card]).catch(() => {});
                }
            });

            // Close button → collapse this card
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('card-expanded');
            });
        });
    }

    // -----------------------------------------------------
    // VLA Interactive Pipeline
    // -----------------------------------------------------
    const vlaVideo = document.getElementById('vla-video');
    const vlaStages = document.querySelectorAll('.vla-stage');
    const vlaInfoNum = document.getElementById('vla-info-num');
    const vlaInfoTitle = document.getElementById('vla-info-title');
    const vlaInfoDesc = document.getElementById('vla-info-desc');

    function updateVlaInfoPanel(activeStage) {
        if (!activeStage) {
            vlaInfoNum.textContent = '';
            vlaInfoTitle.textContent = 'Click a stage or play the video to begin.';
            vlaInfoDesc.textContent = '';
            return;
        }
        const num = activeStage.querySelector('.vla-stage-num').textContent;
        const title = activeStage.querySelector('.vla-stage-title').textContent;
        const desc = activeStage.querySelector('.vla-stage-desc').textContent;
        vlaInfoNum.textContent = num;
        vlaInfoTitle.textContent = title;
        vlaInfoDesc.textContent = desc;
    }

    if (vlaVideo && vlaStages.length > 0) {
        // Click a stage → seek video to that second + update panel
        vlaStages.forEach(stage => {
            stage.addEventListener('click', () => {
                const seekTime = parseFloat(stage.dataset.start);
                // Immediately highlight clicked stage
                vlaStages.forEach(s => s.classList.remove('vla-active', 'vla-past'));
                stage.classList.add('vla-active');
                updateVlaInfoPanel(stage);

                // Pause first, then seek, then play after seek completes
                vlaVideo.pause();
                vlaVideo.currentTime = seekTime;
                vlaVideo.addEventListener('seeked', function onSeeked() {
                    vlaVideo.removeEventListener('seeked', onSeeked);
                    vlaVideo.play();
                });
            });
        });

        // On timeupdate → highlight current stage + update panel
        let lastActiveIndex = -1;
        vlaVideo.addEventListener('timeupdate', () => {
            const t = vlaVideo.currentTime;
            let currentActiveIndex = -1;

            vlaStages.forEach((stage, i) => {
                const start = parseFloat(stage.dataset.start);
                const end = parseFloat(stage.dataset.end);
                stage.classList.remove('vla-active', 'vla-past');

                if (t >= start && t < end) {
                    stage.classList.add('vla-active');
                    currentActiveIndex = i;
                } else if (t >= end) {
                    stage.classList.add('vla-past');
                }
            });

            // Only update panel when the active stage changes
            if (currentActiveIndex !== lastActiveIndex) {
                lastActiveIndex = currentActiveIndex;
                updateVlaInfoPanel(currentActiveIndex >= 0 ? vlaStages[currentActiveIndex] : null);
            }
        });
    }

    // -----------------------------------------------------
    // Interactive Trilemma Venn Diagram Logic
    // -----------------------------------------------------
    const vennData = {
        'A': {
            title: 'Affordable Only',
            subtitle: 'Low entry cost, but limited research value.',
            products: 'Low-cost toys, basic servo-driven DIY kits.',
            text: 'These systems are inherently cheap but often lack precision, deterministic rigidity, or standardized documentation. They are extremely difficult to deploy for serious university-level manipulation research.'
        },
        'B': {
            title: 'Reproducible Only',
            subtitle: 'Scientifically repeatable, but not necessarily accessible.',
            products: 'Benchmark platforms (e.g., REPLAB).',
            text: 'They boast excellent standard documentation and are meticulously designed for comparing algorithmic baselines across labs. However, they are not inherently low-cost and the hardware may rigidly focus on a very narrow set of tasks.'
        },
        'C': {
            title: 'Extensible Only',
            subtitle: 'Powerful as a platform, but too heavy for widespread replication.',
            products: 'Commercial collaborative arms (e.g., DOBOT CR series).',
            text: 'Offering rich APIs and strong ecosystems, these operate perfectly in industrial settings. However, their high cost, proprietary closure, and physical footprint make them impossible to deploy in a 1-to-1 student ratio.'
        },
        'D': {
            title: 'Affordable ∩ Reproducible',
            subtitle: 'Great for deployment at scale, but may stop at teaching demos.',
            products: 'Standardized entry-level classroom kits.',
            text: 'They are cheap and easy to mass-deploy reliably in introductory courses. However, they often contain fixed, closed architectures lacking the modularity required to integrate computer vision or novel task APIs.'
        },
        'E': {
            title: 'Affordable ∩ Extensible',
            subtitle: 'Customizable, but difficult to reproduce reliably across users.',
            products: 'DIY 3D printed arms, maker prototype projects.',
            text: 'While highly versatile and cheap, effectiveness heavily relies on the individual maker\'s skill. Open-source does not equal reproducible: non-standard BOMs and printing inconsistencies plague large-scale scientific adoption.'
        },
        'F': {
            title: 'Reproducible ∩ Extensible',
            subtitle: 'Well-engineered platforms, but still too expensive for broad accessibility.',
            products: 'Mid-to-high end educational arms (e.g., Niryo Ned2, Magician E6).',
            text: 'These provide full documentation, strong payload capabilities, and excellent software ecosystems. They are fantastic platforms, but multi-thousand-dollar price tags prevent their use in resource-constrained environments.'
        },
        'G': {
            title: 'Open-APEX',
            subtitle: 'Optimizing for all three dimensions simultaneously.',
            products: 'The Ultimate Educational & Research Intersection',
            text: `We engineered a solution demonstrating that affordability does not have to sacrifice reproducibility or extensibility:
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Affordable:</strong> Sub-$20 actuator units leveraging campus-scale PETG FDM printing.</li>
                <li style="margin-bottom: 8px;"><strong>Reproducible:</strong> Open CAD, standardized fasteners, and robust RS-485 daisy-chain interfaces.</li>
                <li><strong>Extensible:</strong> Modular eXchangeable tools with a decoupled Python/Flask software stack.</li>
            </ul>`
        }
    };

    const vennSvg = document.getElementById('venn-svg');
    const cardContent = document.getElementById('card-content');
    const dynamicCard = document.getElementById('dynamic-card');

    if (vennSvg && dynamicCard) {
        // Circles geometry (based on SVG viewBox 400x400 and transform)
        // radius = 110. Centroids: Aff(160, 160), Rep(240, 160), Ext(200, 230).
        const cAff = { x: 160, y: 160, r: 110 };
        const cRep = { x: 240, y: 160, r: 110 };
        const cExt = { x: 200, y: 230, r: 110 };

        vennSvg.addEventListener('click', (e) => {
            const pt = vennSvg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            
            // Transform screen point to SVG coordinate space
            const svgP = pt.matrixTransform(vennSvg.getScreenCTM().inverse());
            
            // Check intersection (distances from point to each circle center <= radius)
            const dAff = Math.hypot(svgP.x - cAff.x, svgP.y - cAff.y) <= cAff.r;
            const dRep = Math.hypot(svgP.x - cRep.x, svgP.y - cRep.y) <= cRep.r;
            const dExt = Math.hypot(svgP.x - cExt.x, svgP.y - cExt.y) <= cExt.r;

            // Determine Region
            let region = null;
            if (dAff && dRep && dExt) region = 'G';
            else if (dAff && dRep && !dExt) region = 'D';
            else if (dAff && dExt && !dRep) region = 'E';
            else if (dRep && dExt && !dAff) region = 'F';
            else if (dAff && !dRep && !dExt) region = 'A';
            else if (dRep && !dAff && !dExt) region = 'B';
            else if (dExt && !dAff && !dRep) region = 'C';

            if (!region) return; // Clicked outside all circles

            const data = vennData[region];
            vennSvg.className.baseVal = `focus-${region}`; // Apply hover-focus effect based on region clicked

            // Animate out
            cardContent.style.opacity = 0;
            
            setTimeout(() => {
                let borderColor = '#ccc';
                let tagColor = 'var(--nus-blue)';
                if(region === 'A') { borderColor = '#EF7C00'; tagColor = '#EF7C00'; }
                else if(region === 'B') { borderColor = '#003D7C'; tagColor = '#003D7C'; }
                else if(region === 'C') { borderColor = '#2eb872'; tagColor = '#2eb872'; }
                else if(region === 'G') { borderColor = '#111'; tagColor = '#111'; }
                dynamicCard.style.borderLeftColor = borderColor;

                cardContent.innerHTML = `
                    <h3 style="font-size: 2.2rem; margin: 0 0 12px 0; color: var(--nus-blue);">${data.title}</h3>
                    <div style="font-weight: 600; font-size: 1.15rem; color: ${tagColor}; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #eaeaea;">
                        "${data.subtitle}"
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #333; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">Typical Market Examples:</strong><br>
                        <span style="color: var(--text-secondary); font-size: 0.95rem; display: inline-block; margin-top: 5px;">${data.products}</span>
                    </div>
                    <div style="line-height: 1.7; color: var(--text-secondary); font-size: 1.05rem;">
                        ${data.text}
                    </div>
                `;
                cardContent.style.opacity = 1;
            }, 200);
        });

        // Hover effect helper to highlight SVG areas
        vennSvg.addEventListener('mousemove', (e) => {
            const pt = vennSvg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const svgP = pt.matrixTransform(vennSvg.getScreenCTM().inverse());
            
            const dAff = Math.hypot(svgP.x - cAff.x, svgP.y - cAff.y) <= cAff.r;
            const dRep = Math.hypot(svgP.x - cRep.x, svgP.y - cRep.y) <= cRep.r;
            const dExt = Math.hypot(svgP.x - cExt.x, svgP.y - cExt.y) <= cExt.r;

            // Optional hover region detection logic:
            let hoverRegion = null;
            if (dAff && dRep && dExt) hoverRegion = 'G';
            else if (dAff && dRep && !dExt) hoverRegion = 'D';
            else if (dAff && dExt && !dRep) hoverRegion = 'E';
            else if (dRep && dExt && !dAff) hoverRegion = 'F';
            else if (dAff && !dRep && !dExt) hoverRegion = 'A';
            else if (dRep && !dAff && !dExt) hoverRegion = 'B';
            else if (dExt && !dAff && !dRep) hoverRegion = 'C';

            if (hoverRegion) {
                vennSvg.className.baseVal = `focus-${hoverRegion}`;
            } else {
                vennSvg.className.baseVal = '';
            }
        });

        vennSvg.addEventListener('mouseleave', () => {
             vennSvg.className.baseVal = '';
        });
    }

});
