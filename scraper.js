const puppeteer = require('puppeteer');
const { ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');

class ModelScraper {
    constructor() {
        this.browser = null;
        this.setupIPC();
    }

    setupIPC() {
        // Listen for scraper requests from renderer
        ipcMain.handle('scrape-cgtrader', async (event, query) => {
            return await this.scrapeCGTrader(query);
        });

        ipcMain.handle('scrape-sketchfab', async (event, modelId) => {
            return await this.scrapeSketchfab(modelId);
        });

        // Listen for local models scanning
        ipcMain.handle('scan-local-models', async (event) => {
            return await this.scanLocalModels();
        });
    }

    async scanLocalModels() {
        console.log('📁 Scanning local models directory...');

        try {
            const modelsDir = path.join(__dirname, 'models');
            console.log('🔍 Models directory:', modelsDir);

            const folders = await fs.readdir(modelsDir);
            console.log('📂 Found folders:', folders);

            const models = [];

            for (let folder of folders) {
                if (folder.startsWith('.')) continue; // Skip hidden files

                const folderPath = path.join(modelsDir, folder);
                const stats = await fs.stat(folderPath);

                if (stats.isDirectory()) {
                    console.log(`📁 Processing folder: ${folder}`);

                    // Look for GLTF files in the folder
                    const files = await fs.readdir(folderPath);
                    const gltfFiles = files.filter(file =>
                        file.endsWith('.gltf') || file.endsWith('.glb')
                    );

                    console.log(`  Found GLTF files: ${gltfFiles}`);

                    if (gltfFiles.length > 0) {
                        // Use the first GLTF file found
                        const gltfFile = gltfFiles[0];
                        const modelUrl = `models/${folder}/${gltfFile}`;

                        // Try to read name.txt file for custom model name
                        let modelName = folder.charAt(0).toUpperCase() + folder.slice(1); // Default to folder name

                        try {
                            const nameFilePath = path.join(folderPath, 'name.txt');
                            const nameFileContent = await fs.readFile(nameFilePath, 'utf-8');
                            modelName = nameFileContent.trim();
                            console.log(`  📝 Using name from name.txt: ${modelName}`);
                        } catch (nameError) {
                            console.log(`  📁 No name.txt found, using folder name: ${modelName}`);
                        }

                        models.push({
                            name: modelName,
                            folder: folder,
                            url: modelUrl,
                            source: 'Local Models',
                            fullPath: path.join(folderPath, gltfFile)
                        });

                        console.log(`  ✅ Added model: "${modelName}" (${folder}) → ${modelUrl}`);
                    } else {
                        console.log(`  ❌ No GLTF files found in ${folder}`);
                    }
                }
            }

            console.log(`📊 Total local models available: ${models.length}`);
            return models;

        } catch (error) {
            console.error('❌ Error scanning local models:', error.message);
            return [];
        }
    }

    async getBrowser() {
        if (!this.browser) {
            console.log('🚀 Launching Puppeteer browser...');
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        return this.browser;
    }

    async scrapeCGTrader(query) {
        console.log(`🔍 Scraping CGTrader for: ${query}`);

        try {
            const browser = await this.getBrowser();
            const page = await browser.newPage();

            // Set user agent to avoid bot detection
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

            // Search CGTrader for free GLTF models
            const searchUrl = `https://www.cgtrader.com/3d-models?keywords=${encodeURIComponent(query)}&file_types[]=gltf&price=free`;
            console.log('🌐 Navigating to:', searchUrl);

            await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });

            // Extract model information
            const models = await page.evaluate(() => {
                const modelElements = document.querySelectorAll('.product-item');
                const foundModels = [];

                modelElements.forEach((element, index) => {
                    if (index >= 10) return; // Limit to 10 models

                    const titleElement = element.querySelector('.product-title a');
                    const linkElement = element.querySelector('a');
                    const imageElement = element.querySelector('img');

                    if (titleElement && linkElement) {
                        foundModels.push({
                            name: titleElement.textContent.trim(),
                            url: linkElement.href,
                            image: imageElement ? imageElement.src : null,
                            source: 'CGTrader Scraped'
                        });
                    }
                });

                return foundModels;
            });

            console.log(`✅ Found ${models.length} CGTrader models`);

            // For each model, try to get the actual download URL
            const modelsWithDownloads = [];
            for (let i = 0; i < Math.min(3, models.length); i++) {
                const model = models[i];
                console.log(`📥 Getting download URL for: ${model.name}`);

                try {
                    await page.goto(model.url, { waitUntil: 'networkidle0', timeout: 15000 });

                    // Look for download button or GLTF file links
                    const downloadUrl = await page.evaluate(() => {
                        // Look for download links
                        const downloadButtons = document.querySelectorAll('a[href*="download"], a[href*=".gltf"], a[href*=".glb"]');

                        for (let button of downloadButtons) {
                            const href = button.href;
                            if (href && (href.includes('.gltf') || href.includes('.glb') || href.includes('download'))) {
                                return href;
                            }
                        }

                        // Look in JavaScript variables
                        const scripts = document.querySelectorAll('script');
                        for (let script of scripts) {
                            const content = script.textContent;
                            const gltfMatch = content.match(/['"](https?:\/\/[^'"]*\.gltf?)['"]/);
                            const glbMatch = content.match(/['"](https?:\/\/[^'"]*\.glb)['"]/);

                            if (gltfMatch) return gltfMatch[1];
                            if (glbMatch) return glbMatch[1];
                        }

                        return null;
                    });

                    if (downloadUrl) {
                        modelsWithDownloads.push({
                            ...model,
                            downloadUrl: downloadUrl
                        });
                        console.log(`✅ Found download URL: ${downloadUrl}`);
                    } else {
                        console.log(`❌ No download URL found for: ${model.name}`);
                    }

                } catch (error) {
                    console.log(`❌ Error processing ${model.name}:`, error.message);
                }
            }

            await page.close();
            return modelsWithDownloads;

        } catch (error) {
            console.error('❌ CGTrader scraping failed:', error.message);
            return [];
        }
    }

    async scrapeSketchfab(modelId) {
        console.log(`🎨 Scraping Sketchfab model: ${modelId}`);

        try {
            const browser = await this.getBrowser();
            const page = await browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

            const modelUrl = `https://sketchfab.com/3d-models/${modelId}`;
            console.log('🌐 Navigating to:', modelUrl);

            await page.goto(modelUrl, { waitUntil: 'networkidle0', timeout: 30000 });

            // Extract download URLs from Sketchfab
            const downloadInfo = await page.evaluate(() => {
                // Look for download buttons and file URLs
                const downloadButtons = document.querySelectorAll('button[data-url], a[href*="download"]');
                const downloadUrls = [];

                downloadButtons.forEach(button => {
                    const url = button.dataset.url || button.href;
                    if (url && (url.includes('.gltf') || url.includes('.glb'))) {
                        downloadUrls.push(url);
                    }
                });

                // Look in page source for model file URLs
                const scripts = document.querySelectorAll('script');
                for (let script of scripts) {
                    const content = script.textContent;

                    // Look for various Sketchfab URL patterns
                    const patterns = [
                        /"model_file":\s*"([^"]+\.gltf?)"/g,
                        /"downloadUrl":\s*"([^"]+\.gltf?)"/g,
                        /https:\/\/media\.sketchfab\.com\/[^"]*\.gltf?/g,
                        /https:\/\/assets\.sketchfab\.com\/[^"]*\.gltf?/g
                    ];

                    patterns.forEach(pattern => {
                        let match;
                        while ((match = pattern.exec(content)) !== null) {
                            downloadUrls.push(match[1] || match[0]);
                        }
                    });
                }

                return {
                    downloadUrls: [...new Set(downloadUrls)], // Remove duplicates
                    title: document.querySelector('h1, .model-title')?.textContent?.trim()
                };
            });

            await page.close();

            console.log(`✅ Found ${downloadInfo.downloadUrls.length} Sketchfab download URLs`);

            return {
                name: downloadInfo.title || `Sketchfab Model ${modelId}`,
                downloadUrls: downloadInfo.downloadUrls,
                source: 'Sketchfab Scraped'
            };

        } catch (error) {
            console.error('❌ Sketchfab scraping failed:', error.message);
            return null;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = ModelScraper;