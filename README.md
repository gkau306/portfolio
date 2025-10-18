# 🐰 Pixel Bunny Portfolio - Retro Game Style

A retro pixel art portfolio where you control a cute bunny character to explore different sections of your work! Built with Three.js for smooth 2D gameplay with dynamic animations.

## 🎮 Game Features

- **Controllable Bunny Avatar**: Use WASD or Arrow Keys to move around
- **Retro Pixel Art Style**: Classic 2D game aesthetic with pixelated graphics
- **Interactive Sections**: Walk to different areas to explore your portfolio
- **Dynamic Animations**: Floating particles, bouncing bunny, rotating decorations
- **Mini-Map**: Track your position and available sections
- **Score System**: Gain points by interacting with sections
- **Smooth Camera**: Follows your bunny character around the world

## 🎯 How to Play

### Controls
- **WASD** or **Arrow Keys**: Move your bunny around
- **SPACE**: Interact with sections when nearby
- **ESC**: Show menu/pause

### Gameplay
1. **Move Around**: Use WASD to walk your bunny through the pixel world
2. **Explore Sections**: Walk near the colored platforms to discover different areas:
   - 🏠 **Home Base**: Welcome area
   - 💻 **Projects**: Your coding projects
   - 🎨 **Experience**: Your skills and experience
   - 📞 **Contact**: Ways to get in touch
3. **Interact**: Press SPACE when near a section to interact and gain points
4. **Collect Points**: Each interaction gives you 10 points

## 🎨 Visual Style

- **Retro Aesthetic**: Dark background with neon green accents
- **Pixel Art**: Crisp, pixelated graphics for authentic retro feel
- **Neon Colors**: Bright green, yellow, and pink highlights
- **Grid World**: Classic game grid pattern
- **Floating Elements**: Animated decorations and particles

## 🛠️ Technical Features

### Three.js Implementation
- **Orthographic Camera**: Perfect for 2D pixel art
- **Plane Geometries**: All elements are 2D planes for pixel art look
- **Smooth Animations**: 60fps animations with requestAnimationFrame
- **Particle System**: Dynamic floating particles
- **Collision Detection**: Proximity-based section detection

### Dynamic Animations
- **Walking Animation**: Bunny bounces while moving
- **Floating Icons**: Section icons float up and down
- **Rotating Decorations**: Background elements rotate
- **Particle Effects**: Interaction particles burst on section interaction
- **Camera Following**: Smooth camera that follows the player

## 🎮 Game Sections

### 🏠 Home Base
- Welcome message and introduction
- Starting point for your journey

### 💻 Projects
- Showcase your coding projects
- Interactive project cards
- Technical achievements

### 🎨 Experience
- Your skills and expertise
- Creative journey
- Professional background

### 📞 Contact
- Ways to connect
- Social links
- Contact information

## 🚀 Getting Started

1. **Open** `index.html` in your web browser
2. **Wait** for the game to load (you'll see "Loading Pixel World...")
3. **Use WASD** to start moving your bunny around
4. **Explore** the different sections
5. **Press SPACE** to interact with sections and gain points

## 🎨 Customization

### Adding New Sections
```javascript
// In game.js, add to the sections object:
this.sections.newSection = { 
    x: 0, 
    y: 0, 
    title: "🌟 New Section", 
    description: "Your description here" 
};
```

### Changing Colors
```css
/* In index.html, modify the color variables */
:root {
    --primary-color: #00ff00;  /* Neon green */
    --accent-color: #ffff00;  /* Neon yellow */
    --background: #1a1a2e;     /* Dark blue */
}
```

### Modifying Bunny Appearance
```javascript
// In the createBunny() method, change colors:
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
```

## 🎯 Game Mechanics

### Movement System
- Smooth WASD/Arrow key movement
- Bouncing animation while walking
- Direction-based sprite flipping
- Boundary constraints to keep bunny in world

### Interaction System
- Proximity detection for sections
- Space bar interaction
- Score accumulation
- Visual feedback with particles

### Animation System
- Continuous particle floating
- Rotating background decorations
- Floating section icons
- Smooth camera following

## 🎮 Advanced Features

### Mini-Map
- Real-time player position tracking
- Section location indicators
- Visual world overview

### Particle Effects
- Ambient floating particles
- Interaction burst effects
- Dynamic opacity and movement

### Responsive Design
- Adapts to different screen sizes
- Maintains pixel art aesthetic
- Smooth scaling

## 🛠️ Browser Requirements

- Modern web browser with WebGL support
- JavaScript enabled
- Three.js library (loaded via CDN)

## 🎨 Design Philosophy

This portfolio combines the nostalgia of retro pixel games with modern web development. The bunny character serves as a friendly guide through your professional journey, making the portfolio experience interactive and engaging.

The pixel art aesthetic creates a unique, memorable experience that stands out from traditional portfolios while maintaining professionalism and functionality.

---

**Ready to explore your pixel portfolio world?** 🐰🎮✨
