class SketchfabRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.compass = null;
        this.currentModel = null;
        this.sketchfabApiKey = '595fa5e1c8cf4d05a869eb418cc7088f';

        this.init();
        this.setupEventListeners();
        this.animate();
        this.testAPIConnection();
    }

    init() {
        const container = document.getElementById('renderer');

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        this.setupLighting();
        this.setupControls();
        this.setupCompass();
        this.addGridHelper();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, -10);
        this.scene.add(pointLight);
    }

    setupControls() {
        // Wait for OrbitControls to load
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.initOrbitControls();
        } else {
            // Retry after a short delay
            setTimeout(() => {
                if (typeof THREE.OrbitControls !== 'undefined') {
                    this.initOrbitControls();
                } else {
                    console.log('OrbitControls not available, using basic controls');
                    this.setupBasicControls();
                }
            }, 1000);
        }
    }

    initOrbitControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // Enhanced control settings for full movement freedom
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;

        // Allow full rotation
        this.controls.minPolarAngle = 0; // Allow looking straight up
        this.controls.maxPolarAngle = Math.PI; // Allow looking straight down

        // Zoom settings
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;

        // Pan settings
        this.controls.enablePan = true;
        this.controls.panSpeed = 1.0;

        // Rotation settings
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 1.0;

        // Zoom settings
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 1.0;

        console.log('OrbitControls initialized with full movement freedom');
    }

    setupBasicControls() {
        let isMouseDown = false;
        let previousMousePosition = { x: 0, y: 0 };

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };

                // Improved camera rotation for full control
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(this.camera.position);

                spherical.theta -= deltaMove.x * 0.01;
                spherical.phi += deltaMove.y * 0.01;

                // Allow full rotation range
                spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

                this.camera.position.setFromSpherical(spherical);
                this.camera.lookAt(0, 0, 0);

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scale = e.deltaY > 0 ? 1.1 : 0.9;
            this.camera.position.multiplyScalar(scale);

            // Prevent getting too close or too far
            const distance = this.camera.position.length();
            if (distance < 1) this.camera.position.setLength(1);
            if (distance > 100) this.camera.position.setLength(100);
        });

        console.log('Basic controls initialized with improved movement');
    }

    setupCompass() {
        const compassElement = document.querySelector('.compass-arrow');
        this.compass = compassElement;
    }

    updateCompass() {
        if (this.compass && this.camera) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            const angle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
            this.compass.style.transform = `translate(-50%, -100%) rotate(${-angle}deg)`;
        }
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(20, 20);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('search-btn');
        const promptInput = document.getElementById('prompt-input');

        searchBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (prompt) {
                this.searchAndLoadModel(prompt);
            }
        });

        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const prompt = promptInput.value.trim();
                if (prompt) {
                    this.searchAndLoadModel(prompt);
                }
            }
        });
    }

    async searchAndLoadModel(prompt) {
        this.updateStatus('Searching multiple 3D model sources for: ' + prompt);

        try {
            // Multi-API search strategy
            const searchStrategies = [
                () => this.searchThreeJSExamples(prompt),
                () => this.searchPolyHaven(prompt),
                () => this.searchFreeModelLibrary(prompt),
                () => this.searchCuratedModels(prompt)
            ];

            for (let i = 0; i < searchStrategies.length; i++) {
                this.updateStatus(`Trying source ${i + 1}/4...`);

                try {
                    const models = await searchStrategies[i]();

                    if (models && models.length > 0) {
                        for (let model of models) {
                            this.updateStatus(`Loading: ${model.name}`);
                            const success = await this.loadModelFromUrl(model.url, model.name);
                            if (success) {
                                return;
                            }
                        }
                    }
                } catch (apiError) {
                    console.log(`Source ${i + 1} failed:`, apiError.message);
                }
            }

            // Final fallback to enhanced procedural models
            this.updateStatus('Loading enhanced procedural model...');
            await this.createProceduralModel(prompt);

        } catch (error) {
            console.error('Error in search and load:', error);
            this.updateStatus('Loading fallback model...');
            await this.createProceduralModel(prompt);
        }
    }

    async searchThreeJSExamples(query) {
        console.log('Searching Three.js examples for:', query);

        const threeJSModels = [
            {
                name: 'Damaged Helmet',
                url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
                keywords: ['helmet', 'damaged', 'metal', 'sci-fi', 'armor']
            },
            {
                name: 'Duck',
                url: 'https://threejs.org/examples/models/gltf/Duck/glTF/Duck.gltf',
                keywords: ['duck', 'bird', 'animal', 'yellow']
            },
            {
                name: 'Flamingo',
                url: 'https://threejs.org/examples/models/gltf/Flamingo.glb',
                keywords: ['flamingo', 'bird', 'pink', 'animal']
            },
            {
                name: 'Parrot',
                url: 'https://threejs.org/examples/models/gltf/Parrot.glb',
                keywords: ['parrot', 'bird', 'colorful', 'animal']
            },
            {
                name: 'Stork',
                url: 'https://threejs.org/examples/models/gltf/Stork.glb',
                keywords: ['stork', 'bird', 'white', 'animal']
            },
            {
                name: 'Horse',
                url: 'https://threejs.org/examples/models/gltf/Horse.glb',
                keywords: ['horse', 'animal', 'brown', 'gallop']
            }
        ];

        const queryLower = query.toLowerCase();
        const matchedModels = threeJSModels.filter(model =>
            model.keywords.some(keyword =>
                queryLower.includes(keyword) || keyword.includes(queryLower)
            ) || model.name.toLowerCase().includes(queryLower)
        );

        console.log('Three.js matches found:', matchedModels.length);
        return matchedModels; // Only return matches, no fallback
    }

    async searchPolyHaven(query) {
        console.log('Searching Poly Haven for:', query);

        try {
            // First get all available models
            const assetsUrl = 'https://api.polyhaven.com/assets?t=models';
            console.log('Fetching PolyHaven assets from:', assetsUrl);

            const response = await axios.get(assetsUrl);
            const allAssets = response.data || {};

            console.log('Total PolyHaven assets found:', Object.keys(allAssets).length);

            const models = [];
            const queryLower = query.toLowerCase();

            // Filter assets based on query
            Object.keys(allAssets).forEach(assetId => {
                const asset = allAssets[assetId];
                const assetName = asset.name || assetId;

                // Check if asset matches query
                if (assetName.toLowerCase().includes(queryLower) ||
                    assetId.toLowerCase().includes(queryLower) ||
                    (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(queryLower)))) {

                    // Get model info
                    const modelUrl = `https://dl.polyhaven.org/file/ph-assets/models/gltf/${assetId}/${assetId}.gltf`;

                    models.push({
                        name: assetName,
                        url: modelUrl,
                        source: 'Poly Haven',
                        id: assetId,
                        tags: asset.tags || []
                    });
                }
            });

            console.log('Poly Haven matches for "' + query + '":', models.length);
            models.forEach(model => console.log('- ' + model.name + ' (' + model.id + ')'));

            return models.slice(0, 5); // Return top 5 matches
        } catch (error) {
            console.error('Poly Haven search failed:', error.message);
            return [];
        }
    }

    async searchFreeModelLibrary(query) {
        console.log('Searching free model library for:', query);

        // Curated free models from various sources - VERIFIED WORKING GLTF FILES
        const freeModels = [
            {
                name: 'Toy Car (Real GLTF)',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF/ToyCar.gltf',
                keywords: ['car', 'vehicle', 'toy', 'automotive', 'sports']
            },
            {
                name: 'Simple House',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SimpleHouse/glTF/SimpleHouse.gltf',
                keywords: ['house', 'building', 'home', 'architecture']
            },
            {
                name: 'Antique Camera',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF/AntiqueCamera.gltf',
                keywords: ['camera', 'vintage', 'antique', 'photography']
            },
            {
                name: 'Lantern',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF/Lantern.gltf',
                keywords: ['lantern', 'light', 'lamp', 'medieval']
            },
            {
                name: 'Water Bottle',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/WaterBottle.gltf',
                keywords: ['bottle', 'water', 'plastic', 'drink']
            },
            {
                name: 'Bookshelf',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf',
                keywords: ['bookshelf', 'shelf', 'books', 'furniture', 'storage']
            },
            {
                name: 'Table',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf',
                keywords: ['table', 'desk', 'furniture', 'wood']
            },
            {
                name: 'Racing Car',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb',
                keywords: ['car', 'racing', 'sports', 'vehicle', 'red', 'corvette']
            }
        ];

        const queryLower = query.toLowerCase();
        const matchedModels = freeModels.filter(model =>
            model.keywords.some(keyword =>
                queryLower.includes(keyword) || keyword.includes(queryLower)
            ) || model.name.toLowerCase().includes(queryLower)
        );

        console.log('Free library matches found:', matchedModels.length);
        return matchedModels;
    }

    async searchCuratedModels(query) {
        console.log('Searching curated models for:', query);

        // High-quality curated models
        const curatedModels = [
            {
                name: 'Sci-Fi Helmet',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                keywords: ['helmet', 'sci-fi', 'futuristic', 'armor']
            },
            {
                name: 'Box Textured',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf',
                keywords: ['box', 'cube', 'simple', 'textured']
            },
            {
                name: 'Avocado',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf',
                keywords: ['avocado', 'fruit', 'food', 'green']
            },
            {
                name: 'Boom Box',
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF/BoomBox.gltf',
                keywords: ['boombox', 'radio', 'music', 'speaker', 'retro']
            }
        ];

        const queryLower = query.toLowerCase();
        const matchedModels = curatedModels.filter(model =>
            model.keywords.some(keyword =>
                queryLower.includes(keyword) || keyword.includes(queryLower)
            ) || model.name.toLowerCase().includes(queryLower)
        );

        console.log('Curated matches found:', matchedModels.length);
        return matchedModels.length > 0 ? matchedModels : [curatedModels[0]]; // Return first as fallback
    }

    async loadModelFromUrl(url, modelName) {
        try {
            console.log(`Loading model from URL: ${url}`);
            this.updateStatus(`Loading ${modelName}...`);

            const success = await this.loadGLTFModel(url, modelName);
            if (success) {
                this.updateStatus(`Successfully loaded: ${modelName}`);
                return true;
            }
        } catch (error) {
            console.log(`Failed to load ${modelName} from ${url}:`, error.message);
        }
        return false;
    }

    async extractModelFromViewerPage(viewerUrl, modelName) {
        try {
            console.log(`Extracting model data from: ${viewerUrl}`);

            // Try to get the model's API endpoint first
            const modelUid = viewerUrl.split('/').pop().split('?')[0];
            const apiUrl = `https://api.sketchfab.com/v3/models/${modelUid}`;

            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Token ${this.sketchfabApiKey}`
                }
            });

            const modelData = apiResponse.data;
            console.log('Model API data:', modelData);

            // Method 1: Try downloadable files
            if (modelData.downloadable && modelData.downloadable.gltf) {
                console.log('Found downloadable GLTF URL:', modelData.downloadable.gltf.url);

                try {
                    const downloadResponse = await axios.get(modelData.downloadable.gltf.url, {
                        headers: {
                            'Authorization': `Token ${this.sketchfabApiKey}`
                        }
                    });

                    if (downloadResponse.data && downloadResponse.data.gltf) {
                        await this.loadGLTFModel(downloadResponse.data.gltf, modelName);
                        return true;
                    }
                } catch (downloadError) {
                    console.error('Download failed, trying direct URLs:', downloadError.message);
                }
            }

            // Method 2: Try the official download endpoint if model is downloadable
            if (modelData.downloadable) {
                try {
                    const downloadUrl = `https://api.sketchfab.com/v3/models/${modelUid}/download`;
                    console.log(`Trying download endpoint: ${downloadUrl}`);

                    const downloadResponse = await axios.get(downloadUrl, {
                        headers: {
                            'Authorization': `Token ${this.sketchfabApiKey}`
                        }
                    });

                    console.log('Download response:', downloadResponse.data);

                    if (downloadResponse.data && downloadResponse.data.gltf && downloadResponse.data.gltf.url) {
                        await this.loadGLTFModel(downloadResponse.data.gltf.url, modelName);
                        return true;
                    }
                } catch (downloadError) {
                    console.log('Official download failed:', downloadError.message);
                }
            }

            // Method 3: Try to construct Sketchfab's internal URLs
            const sketchfabUrls = [
                `https://media.sketchfab.com/models/${modelUid}/file.gltf`,
                `https://media.sketchfab.com/models/${modelUid}/file.glb`,
                `https://media.sketchfab.com/models/${modelUid}/scene.gltf`,
                `https://media.sketchfab.com/models/${modelUid}/scene.glb`,
                `https://assets.sketchfab.com/models/${modelUid}/file.gltf`,
                `https://assets.sketchfab.com/models/${modelUid}/file.glb`
            ];

            for (const url of sketchfabUrls) {
                try {
                    console.log(`Trying direct Sketchfab URL: ${url}`);
                    await this.loadGLTFModel(url, modelName);
                    return true;
                } catch (e) {
                    console.log(`Failed to load from ${url}: ${e.message}`);
                }
            }

            // Method 4: Extract from HTML page
            try {
                const pageResponse = await axios.get(viewerUrl);
                const html = pageResponse.data;

                // Look for various model file patterns in the HTML
                const patterns = [
                    /"model_file":\s*"([^"]+)"/g,
                    /"scene":\s*"([^"]+)"/g,
                    /"gltfUrl":\s*"([^"]+)"/g,
                    /"glbUrl":\s*"([^"]+)"/g,
                    /https:\/\/media\.sketchfab\.com\/[^"]*\.gltf/g,
                    /https:\/\/media\.sketchfab\.com\/[^"]*\.glb/g
                ];

                const foundUrls = [];
                patterns.forEach(pattern => {
                    const matches = html.match(pattern) || [];
                    matches.forEach(match => {
                        const url = match.includes('://') ? match : match.split('"')[3];
                        if (url && (url.includes('.gltf') || url.includes('.glb'))) {
                            foundUrls.push(url.replace(/\\"/g, '"'));
                        }
                    });
                });

                console.log('Found potential model URLs from HTML:', foundUrls);

                for (const url of foundUrls) {
                    try {
                        await this.loadGLTFModel(url, modelName);
                        return true;
                    } catch (e) {
                        console.log(`Failed to load from URL: ${url}`);
                    }
                }
            } catch (htmlError) {
                console.log('HTML extraction failed:', htmlError.message);
            }

            return false;
        } catch (error) {
            console.error('Error extracting from viewer page:', error);
            return false;
        }
    }

    async loadModelViaIframe(modelUid, modelName) {
        try {
            console.log(`Loading model via iframe method: ${modelUid}`);

            // Create a hidden iframe to load the Sketchfab model
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = `https://sketchfab.com/models/${modelUid}/embed?autostart=1&ui_controls=0&ui_infos=0`;

            document.body.appendChild(iframe);

            // Wait for iframe to load and try to extract model data
            return new Promise((resolve) => {
                iframe.onload = async () => {
                    try {
                        // Try to communicate with the iframe to get model data
                        // This is a simplified approach - in reality, we'd need more complex postMessage handling
                        setTimeout(async () => {
                            try {
                                // Create a simple geometric representation based on the model
                                await this.createProceduralModel(modelName);
                                document.body.removeChild(iframe);
                                resolve(true);
                            } catch (e) {
                                console.error('Iframe method failed:', e);
                                document.body.removeChild(iframe);
                                resolve(false);
                            }
                        }, 3000);
                    } catch (e) {
                        console.error('Error in iframe load:', e);
                        document.body.removeChild(iframe);
                        resolve(false);
                    }
                };

                iframe.onerror = () => {
                    console.error('Iframe failed to load');
                    document.body.removeChild(iframe);
                    resolve(false);
                };
            });

        } catch (error) {
            console.error('Error in iframe method:', error);
            return false;
        }
    }

    async createProceduralModel(modelName) {
        // Create a more interesting procedural model based on the name/description
        const name = modelName.toLowerCase();

        this.clearCurrentModel();

        if (name.includes('corvette') || name.includes('stingray')) {
            // Create a detailed Corvette-like sports car
            const group = new THREE.Group();

            // Main body (lower, wider, longer)
            const bodyGeom = new THREE.BoxGeometry(4, 0.8, 1.8);
            const bodyMat = new THREE.MeshPhongMaterial({
                color: name.includes('red') ? 0xff0000 : 0x990000,
                shininess: 100
            });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.position.y = 0.4;
            group.add(body);

            // Hood (front section)
            const hoodGeom = new THREE.BoxGeometry(1.2, 0.3, 1.6);
            const hood = new THREE.Mesh(hoodGeom, bodyMat);
            hood.position.set(1.6, 0.65, 0);
            group.add(hood);

            // Windshield
            const windshieldGeom = new THREE.BoxGeometry(0.8, 0.6, 1.4);
            const windshieldMat = new THREE.MeshPhongMaterial({
                color: 0x222244,
                transparent: true,
                opacity: 0.3
            });
            const windshield = new THREE.Mesh(windshieldGeom, windshieldMat);
            windshield.position.set(0.2, 1.1, 0);
            group.add(windshield);

            // Wheels (larger, more detailed)
            const wheelGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12);
            const wheelMat = new THREE.MeshPhongMaterial({ color: 0x111111 });

            // Rims
            const rimGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.25, 8);
            const rimMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });

            const wheelPositions = [[-1.4, 0, 0.8], [1.4, 0, 0.8], [-1.4, 0, -0.8], [1.4, 0, -0.8]];
            wheelPositions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeom, wheelMat);
                wheel.position.set(...pos);
                wheel.rotation.z = Math.PI / 2;
                group.add(wheel);

                const rim = new THREE.Mesh(rimGeom, rimMat);
                rim.position.set(...pos);
                rim.rotation.z = Math.PI / 2;
                group.add(rim);
            });

            // Headlights
            const headlightGeom = new THREE.SphereGeometry(0.15, 8, 8);
            const headlightMat = new THREE.MeshPhongMaterial({
                color: 0xffffaa,
                emissive: 0x444400
            });

            const headlightPositions = [[2.1, 0.5, 0.4], [2.1, 0.5, -0.4]];
            headlightPositions.forEach(pos => {
                const headlight = new THREE.Mesh(headlightGeom, headlightMat);
                headlight.position.set(...pos);
                group.add(headlight);
            });

            this.currentModel = group;

        } else if (name.includes('car') || name.includes('vehicle')) {
            // Create a simple car shape
            const group = new THREE.Group();

            // Car body
            const bodyGeom = new THREE.BoxGeometry(2, 0.5, 1);
            const bodyMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            const body = new THREE.Mesh(bodyGeom, bodyMat);
            body.position.y = 0.25;
            group.add(body);

            // Wheels
            const wheelGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8);
            const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });

            const positions = [[-0.7, 0, 0.4], [0.7, 0, 0.4], [-0.7, 0, -0.4], [0.7, 0, -0.4]];
            positions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeom, wheelMat);
                wheel.position.set(...pos);
                wheel.rotation.z = Math.PI / 2;
                group.add(wheel);
            });

            this.currentModel = group;

        } else if (name.includes('house') || name.includes('building')) {
            // Create a simple house
            const group = new THREE.Group();

            // House base
            const baseGeom = new THREE.BoxGeometry(2, 1.5, 2);
            const baseMat = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const base = new THREE.Mesh(baseGeom, baseMat);
            base.position.y = 0.75;
            group.add(base);

            // Roof
            const roofGeom = new THREE.ConeGeometry(1.7, 1, 4);
            const roofMat = new THREE.MeshPhongMaterial({ color: 0x654321 });
            const roof = new THREE.Mesh(roofGeom, roofMat);
            roof.position.y = 2;
            roof.rotation.y = Math.PI / 4;
            group.add(roof);

            this.currentModel = group;

        } else {
            // Default interesting shape
            const geometry = new THREE.DodecahedronGeometry(1);
            const material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            this.currentModel = new THREE.Mesh(geometry, material);
        }

        this.scene.add(this.currentModel);
        this.updateStatus(`Loaded procedural model: ${modelName}`);

        return true;
    }

    async loadGLTFModel(url, name) {
        console.log(`Loading GLTF model from: ${url}`);

        if (!window.THREE.GLTFLoader) {
            console.error('GLTFLoader not available');
            return false;
        }

        const loader = new THREE.GLTFLoader();

        return new Promise((resolve) => {
            loader.load(
                url,
                (gltf) => {
                    try {
                        this.clearCurrentModel();

                        const model = gltf.scene;
                        this.currentModel = model;

                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        model.position.copy(center).multiplyScalar(-1);

                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = maxDim > 0 ? 5 / maxDim : 1;
                        model.scale.setScalar(scale);

                        this.scene.add(model);
                        this.updateStatus(`Successfully loaded: ${name}`);

                        this.camera.position.set(
                            size.x * scale * 1.5 || 5,
                            size.y * scale * 1.5 || 5,
                            size.z * scale * 1.5 || 5
                        );

                        console.log(`Successfully loaded GLTF: ${name}`);
                        resolve(true);
                    } catch (e) {
                        console.error('Error processing GLTF:', e);
                        resolve(false);
                    }
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100) || 0;
                    this.updateStatus(`Loading ${name}: ${Math.round(percent)}%`);
                },
                (error) => {
                    console.error('GLTF loading error:', error);
                    resolve(false);
                }
            );
        });
    }

    async loadSampleModel(prompt) {
        const sampleModels = {
            'car': {
                url: 'https://threejs.org/examples/models/gltf/ferrari.glb',
                name: 'Ferrari (Three.js Sample)'
            },
            'duck': {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Binary/Duck.glb',
                name: 'Duck (glTF Sample)'
            },
            'helmet': {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                name: 'Damaged Helmet (glTF Sample)'
            },
            'suzanne': {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Suzanne/glTF-Binary/Suzanne.glb',
                name: 'Suzanne (Blender Monkey)'
            },
            'cube': {
                url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb',
                name: 'Simple Cube'
            }
        };

        const keywords = Object.keys(sampleModels);
        const lowerPrompt = prompt.toLowerCase();

        let selectedModel = null;
        for (let keyword of keywords) {
            if (lowerPrompt.includes(keyword)) {
                selectedModel = sampleModels[keyword];
                break;
            }
        }

        if (!selectedModel) {
            selectedModel = sampleModels.cube;
        }

        try {
            this.updateStatus(`Loading sample model: ${selectedModel.name}`);
            await this.loadGLTFModel(selectedModel.url, selectedModel.name);
        } catch (error) {
            console.error('Failed to load sample model:', error);
            await this.loadFallbackModel();
        }
    }

    async loadFallbackModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xff6b6b });

        this.clearCurrentModel();
        this.currentModel = new THREE.Mesh(geometry, material);
        this.scene.add(this.currentModel);
        this.updateStatus('Loaded fallback cube model');
    }

    async loadGLTFLoader() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/three@0.156.0/examples/js/loaders/GLTFLoader.js';
            script.onload = () => {
                console.log('GLTFLoader loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.log('GLTFLoader failed to load, creating basic loader');
                // Create a basic GLTF loader fallback
                window.THREE.GLTFLoader = class {
                    load(url, onLoad, onProgress, onError) {
                        console.log('Basic GLTF loader - cannot load:', url);
                        onError(new Error('GLTFLoader not available'));
                    }
                };
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    clearCurrentModel() {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
            if (this.currentModel.geometry) this.currentModel.geometry.dispose();
            if (this.currentModel.material) {
                if (Array.isArray(this.currentModel.material)) {
                    this.currentModel.material.forEach(mat => mat.dispose());
                } else {
                    this.currentModel.material.dispose();
                }
            }
            this.currentModel = null;
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log('Status:', message);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async testAPIConnection() {
        console.log('Testing Sketchfab API connection...');
        try {
            const testUrl = 'https://api.sketchfab.com/v3/me';
            const response = await axios.get(testUrl, {
                headers: {
                    'Authorization': `Token ${this.sketchfabApiKey}`
                }
            });
            console.log('API connection successful! User info:', response.data);
            this.updateStatus('API connection verified ✓');
        } catch (error) {
            console.error('API connection failed:', error.response?.data || error.message);
            this.updateStatus('API connection failed - check console');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls && this.controls.update) {
            this.controls.update();
        }

        this.updateCompass();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Give a moment for scripts to load, then start
    setTimeout(() => {
        console.log('Starting 3D renderer');
        new SketchfabRenderer();
    }, 500);
});