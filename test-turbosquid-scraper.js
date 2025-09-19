const puppeteer = require('puppeteer');

async function testTurboSquidScraper() {
    console.log('🌪️ Testing TurboSquid scraper in isolation...');

    let browser;

    try {
        console.log('🚀 Launching Puppeteer browser...');
        browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

        // Test with simple search terms
        const queries = ['house', 'car'];

        for (let query of queries) {
            console.log(`\n🔍 Testing TurboSquid scraper with: "${query}"`);

            // Use TurboSquid free GLTF search URL
            const searchUrl = `https://www.turbosquid.com/Search/3D-Models/free/gltf?keyword=${encodeURIComponent(query)}`;
            console.log('🌐 Navigating to:', searchUrl);

            await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for page to load
            await page.waitForTimeout(5000);

            const models = await page.evaluate(() => {
                console.log('📊 TurboSquid page loaded, extracting models...');

                // Try multiple selectors for TurboSquid model items
                const selectors = [
                    '.product-tile',
                    '.search-result',
                    '.product-item',
                    '[data-testid="product-tile"]',
                    '.tile',
                    '.model-tile'
                ];

                let modelElements = [];

                for (let selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    console.log(`TurboSquid selector "${selector}": found ${elements.length} elements`);
                    if (elements.length > 0) {
                        modelElements = Array.from(elements);
                        break;
                    }
                }

                console.log('Total TurboSquid model elements found:', modelElements.length);

                const foundModels = [];

                modelElements.slice(0, 5).forEach((element, index) => {
                    console.log(`Processing TurboSquid element ${index + 1}:`);

                    // Try different selectors for title and link
                    const titleSelectors = [
                        '.product-title a',
                        '.title a',
                        'h3 a',
                        'a[href*="/3d-model/"]',
                        '.model-title a'
                    ];

                    let titleElement = null;
                    let linkElement = null;

                    for (let selector of titleSelectors) {
                        titleElement = element.querySelector(selector);
                        if (titleElement) {
                            linkElement = titleElement;
                            console.log(`Found TurboSquid title with selector: ${selector}`);
                            break;
                        }
                    }

                    if (!titleElement) {
                        // Try to find any link in the element
                        linkElement = element.querySelector('a[href*="/3d-model/"]') || element.querySelector('a');
                    }

                    if (linkElement) {
                        const name = titleElement ? titleElement.textContent.trim() : `TurboSquid Model ${index + 1}`;
                        const url = linkElement.href;

                        console.log(`Found TurboSquid model: ${name} - ${url}`);

                        foundModels.push({
                            name: name,
                            url: url,
                            source: 'TurboSquid Scraped'
                        });
                    } else {
                        console.log('No link found in TurboSquid element');
                    }
                });

                return foundModels;
            });

            console.log(`📊 TurboSquid results for "${query}":`, models.length);
            models.forEach((model, index) => {
                console.log(`  ${index + 1}. ${model.name}`);
                console.log(`     URL: ${model.url}`);
            });

            if (models.length === 0) {
                // Take screenshot for debugging
                await page.screenshot({ path: `turbosquid-debug-${query}.png`, fullPage: true });
                console.log(`📸 TurboSquid screenshot saved: turbosquid-debug-${query}.png`);
            }
        }

    } catch (error) {
        console.error('❌ TurboSquid scraper test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log('🧪 TurboSquid scraper test complete');
    }
}

testTurboSquidScraper();