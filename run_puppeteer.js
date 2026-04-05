import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  
  // wait for the page to load
  await new Promise(r => setTimeout(r, 2000));
  
  // upload a file to show the file card
  const inputUploadHandle = await page.$('input[type=file]');
  await inputUploadHandle.uploadFile('./package.json');
  
  await new Promise(r => setTimeout(r, 1000));
  
  // click the dropdown to open it
  await page.click('button.w-full.flex.items-center.justify-between');
  
  await new Promise(r => setTimeout(r, 500));
  
  // take a screenshot
  await page.screenshot({ path: 'screenshot.png' });
  
  // get computed styles of the dropdown container
  const dropdownStyle = await page.evaluate(() => {
    const dropdown = document.querySelector('div.absolute.z-50.w-full.mt-1\\.5');
    if (!dropdown) return 'No dropdown';
    const style = window.getComputedStyle(dropdown);
    return {
      backdropFilter: style.backdropFilter,
      webkitBackdropFilter: style.webkitBackdropFilter,
      backgroundColor: style.backgroundColor
    };
  });
  
  console.log('Dropdown Style:', dropdownStyle);
  
  // get computed styles of a hover item
  const hoverStyle = await page.evaluate(() => {
    const btn = document.querySelectorAll('div.absolute.z-50.w-full.mt-1\\.5 button')[1];
    if (!btn) return 'No button';
    
    // Simulate hover
    btn.classList.add('hover');
    return btn.className;
  });
  
  console.log('Hover Item Classes:', hoverStyle);
  
  await browser.close();
})();
