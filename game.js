// Pixel Bunny Portfolio Game
class PixelBunnyGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bunny = null;
        this.world = null;
        this.keys = {};
        this.playerPosition = { x: 0, y: 0 };
        this.currentSection = null;
        this.score = 0;
        this.particles = [];
        this.animationId = null;
        
        // Debug flag
        this.debug = false;
        
        // Game state
        this.isPaused = false;
        
        // Mouse drag state
        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
        this.cameraOffset = { x: 0, y: 0 };
        
        this.sections = {
            home: { x: -300, y: 200, title: "🪐 Home Planet", description: "Welcome to Gurleen's galaxy portfolio!" },
            projects: { x: 300, y: 200, title: "🚀 Projects", description: "Explore my coding adventures and technical projects!" },
            experience: { x: -300, y: -200, title: "⭐ Experience", description: "My journey through teaching, internships, and development" },
            hackathons: { x: 0, y: 0, title: "🏆 Hackathons", description: "Award-winning hackathon projects and achievements!" },
            contact: { x: 300, y: -200, title: "📡 Contact", description: "Connect with me across the galaxy!" }
        };
        
        this.showStartScreen();
    }
    
    init() {
        this.setupScene();
        this.createWorld();
        this.createBunny();
        this.setupControls();
        this.createParticles();
        this.hideLoading();
        this.animate();
    }
    
    showStartScreen() {
        // Show start screen and hide game
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
        
        // Add click listener to start button
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
    }
    
    startGame() {
        // Hide start screen and show game
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Initialize the game
        this.init();
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a); // Darker space background
        
        // Create camera (orthographic for 2D pixel feel)
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2, window.innerWidth / 2,
            window.innerHeight / 2, -window.innerHeight / 2,
            0.1, 1000
        );
        this.camera.position.z = 100;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('gameCanvas'),
            antialias: false 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Pixel art settings
        this.renderer.domElement.style.imageRendering = 'pixelated';
    }
    
    createWorld() {
        this.world = new THREE.Group();
        this.scene.add(this.world);
        
        // Create space background
        const spaceGeometry = new THREE.PlaneGeometry(2000, 2000);
        const spaceMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0a0a1a,
            transparent: true,
            opacity: 0.3
        });
        const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
        space.position.z = -50;
        this.world.add(space);
        
        // Create grid pattern
        this.createGrid();
        
        // Create section areas
        this.createSections();
        
        // Create decorative elements
        this.createDecorations();
    }
    
    createGrid() {
        // Create constellation-like patterns instead of regular grid
        const constellationMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.2
        });
        
        // Create some constellation lines
        const constellations = [
            // Big Dipper-like pattern
            [
                new THREE.Vector3(-400, 300, 0),
                new THREE.Vector3(-200, 400, 0),
                new THREE.Vector3(0, 350, 0),
                new THREE.Vector3(200, 300, 0)
            ],
            // Cross pattern
            [
                new THREE.Vector3(300, 200, 0),
                new THREE.Vector3(300, -200, 0),
                new THREE.Vector3(200, 0, 0),
                new THREE.Vector3(400, 0, 0)
            ],
            // Triangle pattern
            [
                new THREE.Vector3(-300, -200, 0),
                new THREE.Vector3(-100, -400, 0),
                new THREE.Vector3(100, -200, 0),
                new THREE.Vector3(-300, -200, 0)
            ]
        ];
        
        constellations.forEach(constellation => {
            const geometry = new THREE.BufferGeometry().setFromPoints(constellation);
            const line = new THREE.Line(geometry, constellationMaterial);
            this.world.add(line);
        });
    }
    
    createSections() {
        const planetStyles = [
            { 
                main: 0xff69b4, accent: 0xff1493, ring: 0xffb6c1, 
                shape: 'round', size: 80, hasFace: true, name: 'Pink Planet'
            }, // Pink planet like your image
            { 
                main: 0x8b4513, accent: 0x654321, ring: 0xcd853f, 
                shape: 'oval', size: 70, hasFace: false, name: 'Brown Planet'
            }, // Brown planet
            { 
                main: 0x32cd32, accent: 0x228b22, ring: 0x90ee90, 
                shape: 'round', size: 75, hasFace: true, name: 'Green Planet'
            }, // Green planet
            { 
                main: 0xffd700, accent: 0xffa500, ring: 0xfff8dc, 
                shape: 'round', size: 85, hasFace: true, name: 'Gold Planet'
            }, // Gold planet for hackathons
            { 
                main: 0x9370db, accent: 0x8a2be2, ring: 0xdda0dd, 
                shape: 'oval', size: 65, hasFace: false, name: 'Purple Planet'
            }  // Purple planet
        ];
        
        Object.keys(this.sections).forEach((sectionKey, index) => {
            const section = this.sections[sectionKey];
            const style = planetStyles[index % planetStyles.length];
            
            // Create pixel art planet
            this.createPixelPlanet(section.x, section.y, style, sectionKey, section.title);
        });
    }
    
    createPixelPlanet(x, y, style, sectionKey, title) {
        const planetGroup = new THREE.Group();
        
        // Create pixel art planet using individual squares
        this.createPixelPlanetBody(planetGroup, style);
        
        // Add pixel art rings
        this.createPixelRings(planetGroup, style);
        
        // Add planet face if specified
        if (style.hasFace) {
            this.createPixelFace(planetGroup, style);
        }
        
        // Add pixel surface details
        this.createPixelSurfaceDetails(planetGroup, style);
        
        // No floating icons - cleaner look
        
        // Position planet group
        planetGroup.position.set(x, y, 0);
        planetGroup.userData = { 
            type: 'section', 
            key: sectionKey,
            rotationSpeed: 0,
            floatSpeed: 0,
            originalY: y,
            floatAmplitude: 0
        };
        
        this.world.add(planetGroup);
    }
    
    createPixelPlanetBody(planetGroup, style) {
        const pixelSize = 4;
        const radius = style.size;
        
        // Create main planet body using pixel squares
        for (let i = -radius; i <= radius; i += pixelSize) {
            for (let j = -radius; j <= radius; j += pixelSize) {
                const distance = Math.sqrt(i * i + j * j);
                
                // Create planet shape
                let shouldCreatePixel = false;
                if (style.shape === 'round') {
                    shouldCreatePixel = distance <= radius;
                } else if (style.shape === 'oval') {
                    const ovalDistance = Math.sqrt((i * 0.8) * (i * 0.8) + j * j);
                    shouldCreatePixel = ovalDistance <= radius;
                }
                
                if (shouldCreatePixel) {
                    const pixelGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
                    const pixelMaterial = new THREE.MeshBasicMaterial({ 
                        color: style.main,
                        transparent: true,
                        opacity: 0.9
                    });
                    const pixel = new THREE.Mesh(pixelGeometry, pixelMaterial);
                    pixel.position.set(i, j, 15);
                    planetGroup.add(pixel);
                }
            }
        }
        
        // Add dark outline
        this.createPixelOutline(planetGroup, style, radius, pixelSize);
    }
    
    createPixelOutline(planetGroup, style, radius, pixelSize) {
        const outlineColor = 0x2d1b69; // Dark purple outline like your image
        
        for (let i = -radius - pixelSize; i <= radius + pixelSize; i += pixelSize) {
            for (let j = -radius - pixelSize; j <= radius + pixelSize; j += pixelSize) {
                const distance = Math.sqrt(i * i + j * j);
                const innerDistance = Math.sqrt((i - pixelSize) * (i - pixelSize) + (j - pixelSize) * (j - pixelSize));
                
                let shouldCreateOutline = false;
                if (style.shape === 'round') {
                    shouldCreateOutline = distance <= radius + pixelSize && distance > radius;
                } else if (style.shape === 'oval') {
                    const ovalDistance = Math.sqrt((i * 0.8) * (i * 0.8) + j * j);
                    shouldCreateOutline = ovalDistance <= radius + pixelSize && ovalDistance > radius;
                }
                
                if (shouldCreateOutline) {
                    const outlineGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
                    const outlineMaterial = new THREE.MeshBasicMaterial({ 
                        color: outlineColor,
                        transparent: true,
                        opacity: 1.0
                    });
                    const outlinePixel = new THREE.Mesh(outlineGeometry, outlineMaterial);
                    outlinePixel.position.set(i, j, 16);
                    planetGroup.add(outlinePixel);
                }
            }
        }
    }
    
    createPixelRings(planetGroup, style) {
        const pixelSize = 3;
        const ringRadius = style.size + 20;
        
        // Create pixel art rings
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            // Add some gaps in the ring for pixel art effect
            if (Math.random() > 0.3) {
                const ringGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: style.ring,
                    transparent: true,
                    opacity: 0.7
                });
                const ringPixel = new THREE.Mesh(ringGeometry, ringMaterial);
                ringPixel.position.set(x, y, 14);
                planetGroup.add(ringPixel);
            }
        }
    }
    
    createPixelFace(planetGroup, style) {
        const pixelSize = 3;
        
        // Create pixel art face
        // Eye
        const eyeGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4169e1, // Blue eye like your image
            transparent: true,
            opacity: 1.0
        });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(15, 10, 17);
        planetGroup.add(eye);
        
        // Mouth
        const mouthGeometry = new THREE.PlaneGeometry(pixelSize * 3, pixelSize);
        const mouthMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffb6c1, // Light pink mouth
            transparent: true,
            opacity: 1.0
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(10, 5, 17);
        planetGroup.add(mouth);
    }
    
    createPixelSurfaceDetails(planetGroup, style) {
        const pixelSize = 2;
        
        // Add random surface details (craters, spots)
        for (let i = 0; i < 8; i++) {
            const x = (Math.random() - 0.5) * style.size * 1.5;
            const y = (Math.random() - 0.5) * style.size * 1.5;
            const distance = Math.sqrt(x * x + y * y);
            
            if (distance < style.size) {
                const detailGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
                const detailMaterial = new THREE.MeshBasicMaterial({ 
                    color: style.accent,
                    transparent: true,
                    opacity: 0.6
                });
                const detail = new THREE.Mesh(detailGeometry, detailMaterial);
                detail.position.set(x, y, 18);
                planetGroup.add(detail);
            }
        }
    }
    
    createFloatingIcon(x, y, icon) {
        const iconGeometry = new THREE.PlaneGeometry(40, 40);
        const iconMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
        iconMesh.position.set(x, y, 20);
        
        // Add floating animation
        iconMesh.userData = { 
            originalY: y,
            floatSpeed: 0.02 + Math.random() * 0.01,
            floatAmplitude: 10 + Math.random() * 5
        };
        
        this.world.add(iconMesh);
    }
    
    createDecorations() {
        // Create stars and asteroids
        this.createStars();
        this.createAsteroids();
        this.createNebula();
    }
    
    createStars() {
        // Create twinkling stars
        for (let i = 0; i < 30; i++) {
            const starGeometry = new THREE.PlaneGeometry(2, 2);
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                5
            );
            
            star.userData = { 
                twinkleSpeed: 0.02 + Math.random() * 0.03,
                originalOpacity: 0.8
            };
            
            this.world.add(star);
        }
    }
    
    createAsteroids() {
        // Create floating asteroids
        const asteroidPositions = [
            { x: -600, y: 300, size: 15 },
            { x: 600, y: 300, size: 20 },
            { x: -600, y: -300, size: 12 },
            { x: 600, y: -300, size: 18 },
            { x: -200, y: 500, size: 10 },
            { x: 200, y: -500, size: 14 }
        ];
        
        asteroidPositions.forEach(ast => {
            const asteroidGeometry = new THREE.CircleGeometry(ast.size, 8);
            const asteroidMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x8b4513,
                transparent: true,
                opacity: 0.8
            });
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            asteroid.position.set(ast.x, ast.y, 8);
            
            // Add rotation and floating animation
            asteroid.userData = { 
                rotationSpeed: 0.01 + Math.random() * 0.02,
                floatSpeed: 0.015 + Math.random() * 0.01,
                originalY: ast.y,
                floatAmplitude: 20 + Math.random() * 15
            };
            
            this.world.add(asteroid);
        });
    }
    
    createNebula() {
        // Create colorful nebula clouds
        const nebulaColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x9b59b6];
        
        for (let i = 0; i < 8; i++) {
            const nebulaGeometry = new THREE.CircleGeometry(60 + Math.random() * 40, 16);
            const nebulaMaterial = new THREE.MeshBasicMaterial({ 
                color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
                transparent: true,
                opacity: 0.2
            });
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            nebula.position.set(
                (Math.random() - 0.5) * 1800,
                (Math.random() - 0.5) * 1800,
                3
            );
            
            nebula.userData = { 
                driftSpeed: 0.001 + Math.random() * 0.002,
                pulseSpeed: 0.02 + Math.random() * 0.01,
                originalScale: 1
            };
            
            this.world.add(nebula);
        }
    }
    
    createBunny() {
        this.bunny = new THREE.Group();
        
        // Bunny body
        const bodyGeometry = new THREE.PlaneGeometry(20, 30);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.bunny.add(body);
        
        // Bunny head
        const headGeometry = new THREE.PlaneGeometry(16, 16);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 8;
        this.bunny.add(head);
        
        // Bunny ears
        const earGeometry = new THREE.PlaneGeometry(6, 12);
        const earMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-4, 12, 0);
        this.bunny.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(4, 12, 0);
        this.bunny.add(rightEar);
        
        // Inner ears
        const innerEarMaterial = new THREE.MeshBasicMaterial({ color: 0xffb6c1 });
        const innerEarGeometry = new THREE.PlaneGeometry(3, 6);
        
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        leftInnerEar.position.set(-4, 12, 1);
        this.bunny.add(leftInnerEar);
        
        const rightInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        rightInnerEar.position.set(4, 12, 1);
        this.bunny.add(rightInnerEar);
        
        // Eyes
        const eyeGeometry = new THREE.PlaneGeometry(2, 2);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-3, 6, 1);
        this.bunny.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(3, 6, 1);
        this.bunny.add(rightEye);
        
        // Nose
        const noseGeometry = new THREE.PlaneGeometry(1, 1);
        const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xffb6c1 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 2, 1);
        this.bunny.add(nose);
        
        // Pink bow
        const bowGeometry = new THREE.PlaneGeometry(4, 3);
        const bowMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.position.set(6, 10, 1);
        this.bunny.add(bow);
        
        // Position bunny
        this.bunny.position.set(0, 0, 25);
        this.scene.add(this.bunny);
        
        // Debug: Make sure bunny is visible
        console.log('Bunny created at position:', this.bunny.position);
        
        // Add walking animation data
        this.bunny.userData = {
            walkCycle: 0,
            walkSpeed: 0.3,
            isWalking: false,
            direction: 1
        };
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            if (this.debug) console.log('Key down:', event.code);
            
            if (event.code === 'Space') {
                event.preventDefault();
                this.interact();
            }
            
            if (event.code === 'KeyR') {
                event.preventDefault();
                this.resetCamera();
            }
            
            if (event.code === 'Escape') {
                event.preventDefault();
                // Close discovery window if open, otherwise toggle pause
                const discoveryWindow = document.getElementById('discoveryWindow');
                if (discoveryWindow) {
                    discoveryWindow.remove();
                } else {
                    this.togglePause();
                }
            }
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            if (this.debug) console.log('Key up:', event.code);
        });
        
        // Mouse interactions
        this.renderer.domElement.addEventListener('click', (event) => {
            this.handleMouseClick(event);
        });
        
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        // Mouse drag events
        this.renderer.domElement.addEventListener('mousedown', (event) => {
            this.handleMouseDown(event);
        });
        
        this.renderer.domElement.addEventListener('mouseup', (event) => {
            this.handleMouseUp(event);
        });
        
        // Prevent context menu on right click
        this.renderer.domElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.left = -window.innerWidth / 2;
            this.camera.right = window.innerWidth / 2;
            this.camera.top = window.innerHeight / 2;
            this.camera.bottom = -window.innerHeight / 2;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: Math.random() * 100,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                vz: Math.random() * 0.5,
                life: Math.random() * 100,
                maxLife: 100 + Math.random() * 100
            };
            
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0.6
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(particle.x, particle.y, particle.z);
            
            particle.mesh = mesh;
            this.particles.push(particle);
            this.scene.add(mesh);
        }
    }
    
    updateParticles() {
        // Particle animations disabled - particles are now static
        // This function is kept for potential future use but does nothing
    }
    
    updateBunny() {
        // Don't update if paused
        if (this.isPaused) return;
        
        const speed = 3;
        let moved = false;
        
        
        // Debug: Check if keys are being pressed
        if (this.debug && Object.keys(this.keys).some(key => this.keys[key])) {
            console.log('Keys pressed:', Object.keys(this.keys).filter(key => this.keys[key]));
        }
        
        // Movement
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.bunny.position.y += speed;
            moved = true;
            if (this.debug) console.log('Moving up');
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.bunny.position.y -= speed;
            moved = true;
            if (this.debug) console.log('Moving down');
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.bunny.position.x -= speed;
            this.bunny.userData.direction = -1;
            moved = true;
            if (this.debug) console.log('Moving left');
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.bunny.position.x += speed;
            this.bunny.userData.direction = 1;
            moved = true;
            if (this.debug) console.log('Moving right');
        }
        
        // Update walking animation
        if (moved) {
            this.bunny.userData.isWalking = true;
            this.bunny.userData.walkCycle += this.bunny.userData.walkSpeed;
            
            // Bounce effect
            this.bunny.position.z = 25 + Math.sin(this.bunny.userData.walkCycle) * 2;
            
            // Flip bunny based on direction
            this.bunny.scale.x = this.bunny.userData.direction;
        } else {
            this.bunny.userData.isWalking = false;
            this.bunny.position.z = 25;
        }
        
        // Keep bunny in bounds
        this.bunny.position.x = Math.max(-800, Math.min(800, this.bunny.position.x));
        this.bunny.position.y = Math.max(-600, Math.min(600, this.bunny.position.y));
        
        // Update camera to follow bunny (with offset for dragging)
        this.camera.position.x = this.bunny.position.x + this.cameraOffset.x;
        this.camera.position.y = this.bunny.position.y + this.cameraOffset.y;
        
        // Update mini-map player position
        this.updateMiniMap();
        
        // Check for section interactions
        this.checkSectionProximity();
    }
    
    updateMiniMap() {
        const mapPlayer = document.getElementById('mapPlayer');
        const mapWidth = 200;
        const mapHeight = 150;
        
        const normalizedX = (this.bunny.position.x + 800) / 1600;
        const normalizedY = (this.bunny.position.y + 600) / 1200;
        
        mapPlayer.style.left = (normalizedX * (mapWidth - 8)) + 'px';
        mapPlayer.style.top = (normalizedY * (mapHeight - 8)) + 'px';
    }
    
    checkSectionProximity() {
        const bunnyPos = this.bunny.position;
        let closestSection = null;
        let closestDistance = Infinity;
        
        Object.keys(this.sections).forEach(sectionKey => {
            const section = this.sections[sectionKey];
            const distance = Math.sqrt(
                Math.pow(bunnyPos.x - section.x, 2) + 
                Math.pow(bunnyPos.y - section.y, 2)
            );
            
            if (distance < 100 && distance < closestDistance) {
                closestDistance = distance;
                closestSection = sectionKey;
            }
        });
        
        if (closestSection && closestSection !== this.currentSection) {
            this.currentSection = closestSection;
            this.showSectionInfo(
                this.sections[closestSection].title,
                this.sections[closestSection].description
            );
        } else if (!closestSection && this.currentSection) {
            this.currentSection = null;
            this.hideSectionInfo();
        }
    }
    
    interact() {
        if (this.currentSection) {
            const section = this.sections[this.currentSection];
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            
            // Create interaction particles
            this.createInteractionParticles();
            
            this.showSectionInfo(
                section.title + ' - INTERACTED!',
                'You gained 10 points! ' + section.description
            );
        }
    }
    
    createInteractionParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: this.bunny.position.x + (Math.random() - 0.5) * 50,
                y: this.bunny.position.y + (Math.random() - 0.5) * 50,
                z: this.bunny.position.z + 10,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                vz: Math.random() * 5,
                life: 0,
                maxLife: 30
            };
            
            const geometry = new THREE.PlaneGeometry(3, 3);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                transparent: true,
                opacity: 1
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(particle.x, particle.y, particle.z);
            
            particle.mesh = mesh;
            this.particles.push(particle);
            this.scene.add(mesh);
        }
    }
    
    showSectionInfo(title, description) {
        document.getElementById('sectionTitle').textContent = title;
        document.getElementById('sectionDescription').textContent = description;
        document.getElementById('sectionInfo').style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideSectionInfo();
        }, 3000);
    }
    
    hideSectionInfo() {
        document.getElementById('sectionInfo').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showSectionInfo('⏸️ Game Paused', 'Press ESC to resume or use mouse to interact');
        } else {
            this.hideSectionInfo();
        }
    }
    
    resetCamera() {
        this.cameraOffset.x = 0;
        this.cameraOffset.y = 0;
        this.showSectionInfo('📷 Camera Reset', 'View centered on bunny');
        setTimeout(() => this.hideSectionInfo(), 2000);
    }
    
    handleMouseClick(event) {
        if (this.isPaused || this.isDragging) return;
        
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.world.children, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            let planetGroup = clickedObject;
            
            // Find the planet group if we clicked on a child
            while (planetGroup.parent && planetGroup.userData.type !== 'section') {
                planetGroup = planetGroup.parent;
            }
            
            if (planetGroup.userData.type === 'section') {
                this.openDiscoveryWindow(planetGroup.userData.key);
            }
        }
    }
    
    handleMouseMove(event) {
        // Handle camera dragging
        if (this.isDragging) {
            const deltaX = event.clientX - this.lastMousePosition.x;
            const deltaY = event.clientY - this.lastMousePosition.y;
            
            // Convert screen movement to world movement
            this.cameraOffset.x -= deltaX * 2;
            this.cameraOffset.y += deltaY * 2;
            
            // Update camera position
            this.camera.position.x = this.bunny.position.x + this.cameraOffset.x;
            this.camera.position.y = this.bunny.position.y + this.cameraOffset.y;
            
            this.lastMousePosition.x = event.clientX;
            this.lastMousePosition.y = event.clientY;
            return;
        }
        
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.world.children, true);
        
        // Reset all planet highlights
        this.world.children.forEach(child => {
            if (child.userData.type === 'section') {
                child.children.forEach(planetChild => {
                    if (planetChild.material) {
                        planetChild.material.emissive.setHex(0x000000);
                    }
                });
            }
        });
        
        // Highlight hovered planet
        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;
            let planetGroup = hoveredObject;
            
            while (planetGroup.parent && planetGroup.userData.type !== 'section') {
                planetGroup = planetGroup.parent;
            }
            
            if (planetGroup.userData.type === 'section') {
                planetGroup.children.forEach(planetChild => {
                    if (planetChild.material) {
                        planetChild.material.emissive.setHex(0x222222);
                    }
                });
            }
        }
    }
    
    handleMouseDown(event) {
        if (event.button === 0) { // Left mouse button
            this.isDragging = true;
            this.lastMousePosition.x = event.clientX;
            this.lastMousePosition.y = event.clientY;
            this.renderer.domElement.style.cursor = 'grabbing';
        }
    }
    
    handleMouseUp(event) {
        if (event.button === 0) { // Left mouse button
            this.isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        }
    }
    
    openDiscoveryWindow(sectionKey) {
        const section = this.sections[sectionKey];
        this.showDiscoveryWindow(section.title, section.description, sectionKey);
    }
    
    showDiscoveryWindow(title, description, sectionKey) {
        // Create discovery window HTML
        const windowHTML = `
            <div id="discoveryWindow" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                height: 400px;
                background: #000000;
                border: 3px solid #ffb6c1;
                border-radius: 12px;
                box-shadow: 
                    0 0 0 2px #ffffff,
                    0 0 0 5px #ffb6c1,
                    inset 0 0 0 2px #ffffff,
                    0 0 20px rgba(255, 182, 193, 0.4);
                z-index: 1000;
                font-family: 'Courier New', monospace;
                color: #ffb6c1;
                padding: 20px;
                overflow-y: auto;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            ">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000; font-size: 24px; letter-spacing: 1px;">${title}</h2>
                    <div style="color: #ffc0cb; font-size: 14px; text-shadow: 1px 1px 0px #000000;">Ancient Discovery Found!</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="color: #ffb6c1; line-height: 1.6; text-shadow: 1px 1px 0px #000000;">${description}</p>
                </div>
                
                <div id="discoveryContent" style="max-height: 200px; overflow-y: auto;">
                    ${this.getDiscoveryContent(sectionKey)}
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="document.getElementById('discoveryWindow').remove()" style="
                        background: #ffb6c1;
                        color: #000000;
                        border: 2px solid #ffc0cb;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                        font-size: 14px;
                        text-shadow: 1px 1px 0px #ffffff;
                        box-shadow: 
                            0 0 0 1px #ff69b4,
                            inset 0 0 0 1px #ffffff;
                        image-rendering: pixelated;
                        image-rendering: -moz-crisp-edges;
                        image-rendering: crisp-edges;
                    " onmouseover="this.style.background='#ffc0cb'; this.style.color='#000000';" onmouseout="this.style.background='#ffb6c1'; this.style.color='#000000';">Close Discovery</button>
                </div>
            </div>
        `;
        
        // Remove existing window if any
        const existingWindow = document.getElementById('discoveryWindow');
        if (existingWindow) {
            existingWindow.remove();
        }
        
        // Add new window
        document.body.insertAdjacentHTML('beforeend', windowHTML);
    }
    
    getDiscoveryContent(sectionKey) {
        const content = {
            home: `
                <h3 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">🪐 GURLEEN KAUR</h3>
                <p style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;"><strong>📍 Auckland, NZ | 💻 admgurleen@gmail.com | 🌐 github.com/gkau306</strong></p>
                <p style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Bachelor of Science (BSc) – Computer Science & Biology<br>University of Auckland</p>
                <ul style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">
                    <li>Teaching Assistant – COMPSCI 101</li>
                    <li>PwC Intern – Insurance Data Analysis</li>
                    <li>Volunteer Developer – Non-Profit</li>
                </ul>
            `,
            projects: `
                <h3 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">🚀 TECHNICAL PROJECTS</h3>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Digital Sticky Notes Extension</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Chrome extension using JavaScript and DOM APIs to create persistent sticky notes tied to unique page hashes via chrome.storage and localStorage.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">My Notes Agent</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">AI-powered note parser using OpenAI API to extract tasks, deadlines, and events from natural language, with syncing to Google Calendar.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Non-Profit Web Scraper</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Python-based web scraper using Selenium and BeautifulSoup to monitor Auckland Council websites for liquor license applications with Gmail API integration.</p>
                </div>
            `,
            experience: `
                <h3 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">⭐ PROFESSIONAL EXPERIENCE</h3>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Teaching Assistant – COMPSCI 101</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">University of Auckland | July 2025 – Present<br>Supported 100+ first-year students in Python programming concepts.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Intern – Insurance Data Analysis</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">PwC | Jan 2024 - Feb 2024<br>Analyzed large insurance datasets using Python, Excel, and internal tools for risk modeling.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">Volunteer Developer</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Non-Profit Organization<br>Developing Python-based web scraper with Gmail API integration for community engagement.</p>
                </div>
            `,
            hackathons: `
                <h3 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">🏆 HACKATHON ACHIEVEMENTS</h3>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffd700; text-shadow: 1px 1px 0px #000000;">🏆 WINNER – PARTLY HACKATHON (2025)</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Built proprietary AI models for car damage detection and part identification. Developed full-stack web application with Next.js/React/TypeScript frontend.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #c0c0c0; text-shadow: 1px 1px 0px #000000;">🥈 2ND PLACE – FONTERRA AI AGENTS CHALLENGE (2025)</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Created Microsoft Fabric AI agent that converts natural language queries into SQL for business insights.</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #cd7f32; text-shadow: 1px 1px 0px #000000;">🎤 BEST PRESENTER – TRADE ME THINKATHON (2025)</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Recognized for delivering clear and compelling presentations.</p>
                </div>
            `,
            contact: `
                <h3 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">📡 CONTACT INFORMATION</h3>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">📧 EMAIL</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">admgurleen@gmail.com</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">🌐 GITHUB</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">github.com/gkau306</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">📍 LOCATION</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Auckland, New Zealand</p>
                </div>
                <div style="margin: 10px 0;">
                    <h4 style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">🎓 EDUCATION</h4>
                    <p style="color: #ffc0cb; text-shadow: 1px 1px 0px #000000;">Bachelor of Science (BSc) – Computer Science & Biology<br>University of Auckland</p>
                </div>
            `
        };
        
        return content[sectionKey] || '<p style="color: #ffb6c1; text-shadow: 1px 1px 0px #000000;">No additional information available.</p>';
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.updateBunny();
        this.updateParticles();
        this.updateDecorations();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateDecorations() {
        // All animations disabled - only bunny can move
        // This function is kept for potential future use but does nothing
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new PixelBunnyGame();
});
