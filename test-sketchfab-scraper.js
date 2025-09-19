const puppeteer = require('puppeteer');

async function testSketchfabScraper() {
    console.log('🎨 Testing Sketchfab scraper in isolation...');

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
        const queries = ['house', 'car', 'chair'];

        for (let query of queries) {
            console.log(`\n🔍 Testing Sketchfab scraper with: "${query}"`);

            // Use Sketchfab search URL
            const searchUrl = `https://sketchfab.com/search?features=downloadable&q=${encodeURIComponent(query)}&type=models`;
            console.log('🌐 Navigating to:', searchUrl);

            await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for page to load
            await page.waitForTimeout(3000);

            const models = await page.evaluate(() => {
                console.log('📊 Page loaded, extracting Sketchfab models...');

                // Try multiple selectors for Sketchfab model items
                const selectors = [
                    '[data-testid="search-result-item"]',
                    '.c-search-result',
                    '.search-result-item',
                    '[data-testid="model-card"]',
                    '.model-card',
                    '.c-model-card'
                ];

                let modelElements = [];

                for (let selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    console.log(`Selector "${selector}": found ${elements.length} elements`);
                    if (elements.length > 0) {
                        modelElements = Array.from(elements);
                        break;
                    }
                }

                console.log('Total Sketchfab model elements found:', modelElements.length);

                const foundModels = [];

                modelElements.slice(0, 5).forEach((element, index) => {
                    console.log(`Processing Sketchfab element ${index + 1}:`);

                    // Try different selectors for title and link
                    const titleSelectors = [
                        'h3 a',
                        '.model-title a',
                        '.c-model-title a',
                        'a[href*="/3d-models/"]',
                        '.title a',
                        '.model-name a'
                    ];

                    let titleElement = null;
                    let linkElement = null;

                    for (let selector of titleSelectors) {
                        titleElement = element.querySelector(selector);
                        if (titleElement) {
                            linkElement = titleElement;
                            console.log(`Found title with selector: ${selector}`);
                            break;
                        }
                    }

                    if (!titleElement) {
                        // Try to find any link in the element
                        linkElement = element.querySelector('a[href*="/3d-models/"]') || element.querySelector('a');
                    }

                    if (linkElement) {
                        const name = titleElement ? titleElement.textContent.trim() : `Sketchfab Model ${index + 1}`;
                        const url = linkElement.href;

                        console.log(`Found Sketchfab model: ${name} - ${url}`);

                        foundModels.push({
                            name: name,
                            url: url,
                            source: 'Sketchfab Scraped'
                        });
                    } else {
                        console.log('No link found in Sketchfab element');
                    }
                });

                return foundModels;
            });

            console.log(`📊 Sketchfab results for "${query}":`, models.length);
            models.forEach((model, index) => {
                console.log(`  ${index + 1}. ${model.name}`);
                console.log(`     URL: ${model.url}`);
            });

            if (models.length === 0) {
                // Take screenshot for debugging
                await page.screenshot({ path: `sketchfab-debug-${query}.png`, fullPage: true });
                console.log(`📸 Sketchfab screenshot saved: sketchfab-debug-${query}.png`);
            }
        }

    } catch (error) {
        console.error('❌ Sketchfab scraper test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log('🧪 Sketchfab scraper test complete');
    }
}

testSketchfabScraper();