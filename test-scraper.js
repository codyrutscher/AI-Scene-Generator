const puppeteer = require('puppeteer');

async function testCGTraderScraper() {
    console.log('🧪 Testing CGTrader scraper in isolation...');

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
            console.log(`\n🔍 Testing scraper with: "${query}"`);

            const searchUrl = `https://www.cgtrader.com/3d-models?keywords=${encodeURIComponent(query)}&file_types[]=gltf&price=free`;
            console.log('🌐 Navigating to:', searchUrl);

            await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for page to load and extract models
            await page.waitForTimeout(3000);

            const models = await page.evaluate(() => {
                console.log('📊 Page loaded, extracting models...');

                // Try multiple selectors for CGTrader model items
                const selectors = [
                    '.product-item',
                    '.model-item',
                    '[data-testid="product-item"]',
                    '.product-card',
                    '.grid-item'
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

                console.log('Total model elements found:', modelElements.length);

                const foundModels = [];

                modelElements.slice(0, 5).forEach((element, index) => {
                    console.log(`Processing element ${index + 1}:`);

                    // Try different selectors for title and link
                    const titleSelectors = [
                        '.product-title a',
                        '.model-title a',
                        'h3 a',
                        'a[href*="/3d-models/"]',
                        '.title a'
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
                        const name = titleElement ? titleElement.textContent.trim() : `Model ${index + 1}`;
                        const url = linkElement.href;

                        console.log(`Found model: ${name} - ${url}`);

                        foundModels.push({
                            name: name,
                            url: url,
                            source: 'CGTrader Scraped'
                        });
                    } else {
                        console.log('No link found in element');
                    }
                });

                return foundModels;
            });

            console.log(`📊 Results for "${query}":`, models.length);
            models.forEach((model, index) => {
                console.log(`  ${index + 1}. ${model.name}`);
                console.log(`     URL: ${model.url}`);
            });

            if (models.length === 0) {
                // Take screenshot for debugging
                await page.screenshot({ path: `cgtrader-debug-${query}.png`, fullPage: true });
                console.log(`📸 Screenshot saved: cgtrader-debug-${query}.png`);
            }
        }

    } catch (error) {
        console.error('❌ Scraper test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log('🧪 Scraper test complete');
    }
}

testCGTraderScraper();