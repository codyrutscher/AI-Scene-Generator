const axios = require('axios');

async function testSketchfabAPI() {
    console.log('🎨 Testing Sketchfab API for downloadable models...');

    const apiKey = '595fa5e1c8cf4d05a869eb418cc7088f';

    try {
        // Search for downloadable models
        const queries = ['house', 'car', 'furniture'];

        for (let query of queries) {
            console.log(`\n🔍 Searching Sketchfab API for: "${query}"`);

            const searchUrl = `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&downloadable=true&sort_by=-likeCount&count=10`;
            console.log('🌐 API URL:', searchUrl);

            const response = await axios.get(searchUrl, {
                headers: {
                    'Authorization': `Token ${apiKey}`
                }
            });

            console.log(`📊 Found ${response.data.results?.length || 0} downloadable models`);

            if (response.data.results && response.data.results.length > 0) {
                for (let i = 0; i < Math.min(3, response.data.results.length); i++) {
                    const model = response.data.results[i];
                    console.log(`\n  ${i + 1}. ${model.name}`);
                    console.log(`     UID: ${model.uid}`);
                    console.log(`     Downloadable: ${model.isDownloadable}`);

                    // Try to get detailed model info
                    try {
                        const detailUrl = `https://api.sketchfab.com/v3/models/${model.uid}`;
                        const detailResponse = await axios.get(detailUrl, {
                            headers: {
                                'Authorization': `Token ${apiKey}`
                            }
                        });

                        const modelData = detailResponse.data;
                        console.log(`     License: ${modelData.license?.label || 'Unknown'}`);

                        if (modelData.downloadable && modelData.downloadable.gltf) {
                            console.log(`     ✅ GLTF Download URL available!`);

                            // Try to get the actual download URL
                            const downloadUrl = modelData.downloadable.gltf.url;
                            console.log(`     Download URL: ${downloadUrl}`);

                            // Test if we can access the download
                            try {
                                const downloadResponse = await axios.get(downloadUrl, {
                                    headers: {
                                        'Authorization': `Token ${apiKey}`
                                    }
                                });

                                if (downloadResponse.data && downloadResponse.data.gltf) {
                                    console.log(`     🎯 REAL GLTF URL: ${downloadResponse.data.gltf}`);
                                } else {
                                    console.log(`     ⚠️ Download requires additional auth`);
                                }

                            } catch (downloadError) {
                                console.log(`     ❌ Download failed: ${downloadError.message}`);
                            }

                        } else {
                            console.log(`     ❌ No GLTF download available`);
                        }

                    } catch (detailError) {
                        console.log(`     ❌ Error getting details: ${detailError.message}`);
                    }
                }
            } else {
                console.log(`  ❌ No downloadable models found for "${query}"`);
            }

            console.log('\n' + '='.repeat(60));
        }

    } catch (error) {
        console.error('❌ Sketchfab API test failed:', error.message);
    }

    console.log('\n🧪 Sketchfab API test complete');
}

testSketchfabAPI();