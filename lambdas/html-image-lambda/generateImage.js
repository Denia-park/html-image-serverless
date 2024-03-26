// generateImage.js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core')

exports.generateImage = async (url) => {
    let browser = null;

    // Load NanumGothic font for Korean characters
    await chromium.font('https://rawcdn.githack.com/demun/NanumGothic/dce7dfebb1bd3020be65b169db27188dea26d1f3/fonts/NanumGothic-Regular.ttf')

    // Launch Chromium
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        console.log('Chromium launched -> url : ' + url);

        // Open new page
        const page = await browser.newPage();
        // Go to the URL and wait for the page to load
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });

        // 'wrapper' ID를 가진 요소의 마진 조정
        await page.evaluate(() => {
            const wrapper = document.querySelector('#wrapper');
            wrapper.style.marginTop = '10px'; // 위쪽 마진 조정
            wrapper.style.marginBottom = '10px'; // 아래쪽 마진 조정
            wrapper.style.marginRight = '10px'; // 오른쪽 마진 조정
            wrapper.style.marginLeft = '10px'; // 왼쪽 마진 조정
        });

        // 'wrapper' id를 가진 요소 선택
        const element = await page.$('#wrapper');
        // Take a screenshot
        const imageBuffer = await element.screenshot();
        return imageBuffer;
    } catch (e) {
        console.log('Chromium error', { e })
    } finally {
        // Close the browser
        if (browser !== null) {
            await browser.close();
        }
    }
};
