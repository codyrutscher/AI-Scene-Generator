# 3DAI: Revolutionary AI Scene Generator

**The world's first AI-powered 3D scene builder that converts real-world photos into 3D models and creates complex scenes through natural language commands.**

## 🎯 **Project Vision**

### **Phase 1: Asset Accumulation (Current)**
- **Accumulate as many 3D assets as possible** from various sources
- **Store in Cloudflare bucket** for fast global access
- **Support multiple model formats** (GLTF, GLB, OBJ, FBX)
- **Organize with metadata** for natural language queries

### **Phase 2: GameLogic Engine**
- **Build comprehensive game engine** scene rendering system
- **Natural language scene creation**: "Create a forest with 3 cottages at coordinates..."
- **Coordinate-based placement** system for precise positioning
- **Real-time scene manipulation** and editing

### **Phase 3: Advanced Features**
- **AI-powered scene generation** from complex descriptions
- **Physics simulation** and interaction systems
- **Export to major game engines** (Unity, Unreal, Godot)
- **Collaborative scene building** with real-time sync

## 🏗️ **Current Features (MVP)**

### **📐 Massive Grid System**
- **10,000 x 10,000 coordinate grid** for large-scale scenes
- **Precise coordinate placement** at exact grid intersections
- **Visual coordinate markers** every 1000 units
- **Directional compass** system (North/South/East/West)

### **📁 Local Asset Pipeline**
- **Automatic model scanning** from `models/` directory
- **Custom naming** via `name.txt` files in each model folder
- **GLTF/GLB support** with textures and materials
- **Unlimited model support** - just add folders

### **🎮 Advanced Camera System**
- **Free-roam camera** with unlimited movement
- **Mouse wheel zoom** from ground level to satellite view
- **WASD movement** with adjustable speed (+ and - keys)
- **Mouse look controls** for 360° rotation
- **Vertical movement** (Space/Shift for up/down)

### **🗣️ Natural Language Interface**
- **"put [model] at [x,y] facing [direction]"**
- **"place Cottage at 100,100 facing north"**
- **"add Hover car at 500,500 facing east"**
- **"scale house by 5x"** or **"make cottage larger"**
- **Input clears automatically** after placement for rapid scene building

### **📸 Revolutionary Image-to-3D Model Creation**
- **iPhone camera integration** for capturing real objects
- **AI-powered 3D reconstruction** from single photos
- **Custom model naming** and automatic integration
- **Turn any household item** into a placeable 3D model
- **Example:** Take photo of coffee mug → "put coffee mug at 50,50"

### **📏 Advanced Model Scaling**
- **Natural language scaling:** "scale house by 2x"
- **Contextual commands:** "make cottage larger" or "shrink car"
- **Preset scale buttons:** 50%, 100%, 200%, 500%
- **Smart model tracking** for post-placement modifications

## 🚀 **Quick Start**

1. **Clone and Install:**
   ```bash
   git clone https://github.com/codyrutscher/AI-Scene-Generator.git
   cd AI-Scene-Generator
   npm install
   ```

2. **Add Your Models:**
   ```
   models/
   ├── hovercar/
   │   ├── scene.gltf
   │   ├── scene.bin
   │   ├── textures/
   │   └── name.txt  ("Hover car")
   ├── cottage/
   │   ├── scene.gltf
   │   └── name.txt  ("Cottage")
   ```

3. **Start Building:**
   ```bash
   npm start
   ```

## 🎯 **Example Commands**

### **Single Model Placement:**
- `"put Cottage at 100,100 facing north"`
- `"place Hover car at 500,500 facing east"`
- `"add House in the woods at 1000,1000 facing west"`

### **Complex Scene Building:**
1. `"put Cottage at 100,100 facing north"` → Places cottage, clears input
2. `"place Hover car at 200,200 facing south"` → Adds hovercar
3. `"add House in the woods at 300,300 facing east"` → Complete scene

### **Navigation:**
- **WASD**: Move around the massive world
- **Mouse drag**: Look around
- **Mouse wheel**: Zoom in/out at any location
- **+/-**: Adjust movement speed

## 🛠️ **Technology Stack**

- **A-Frame**: WebVR/3D framework with native GLTF support
- **Electron**: Cross-platform desktop application
- **Puppeteer**: Web scraping for asset acquisition
- **Node.js**: Backend asset management
- **Sketchfab API**: 3D model database integration

## 📈 **Roadmap to GameLogic**

### **Next Steps:**
1. **Cloudflare bucket integration** for asset storage
2. **Asset metadata system** for improved search
3. **Physics engine integration** (Cannon.js/Ammo.js)
4. **Scene export formats** (Unity, Unreal, GLTF)
5. **Collaborative editing** with WebRTC
6. **AI scene generation** with advanced natural language processing

### **Long-term Vision:**
**GameLogic will become the definitive tool for AI-powered 3D scene creation, enabling anyone to build complex game worlds through natural language commands backed by massive asset libraries.**

## 🤝 **Contributing**

This project aims to democratize 3D scene creation. Contributions welcome for:
- **Asset pipeline improvements**
- **Natural language processing enhancements**
- **Performance optimizations for massive scenes**
- **New export formats and integrations**

---

*🤖 Built with Claude Code*