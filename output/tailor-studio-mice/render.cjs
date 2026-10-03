const { chromium } = require('C:/Users/usrr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = __dirname;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'card.html';
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(absolute)) { res.writeHead(404).end(); return; }
  const type = { '.html':'text/html; charset=utf-8', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.png':'image/png', '.ttf':'font/ttf' }[path.extname(absolute)] || 'application/octet-stream';
  res.writeHead(200, {'Content-Type':type});fs.createReadStream(absolute).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(8797, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1500,height:900},deviceScaleFactor:1});
    const errors=[];page.on('pageerror', error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8797/card.html',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const checks=await page.evaluate(()=>({fontReady:document.fonts.check('600 30px Manrope'),imageLoaded:document.querySelector('img').naturalWidth>0,qrLoaded:document.querySelector('.wechat-card img').naturalWidth>0,text:document.body.innerText,websiteText:document.querySelector('a[href="https://mice.tailorstudio.ru"]').innerText,overflow:document.querySelector('.business-card').scrollWidth>1500,contactsClearOfScope:document.querySelector('.contacts').getBoundingClientRect().bottom<document.querySelector('.scope').getBoundingClientRect().top}));
    await page.locator('.business-card').screenshot({path:path.join(root,'elizaveta-gannenko-business-card-final.png')});
    await page.locator('.business-card').screenshot({path:path.join(root,'elizaveta-gannenko-business-card-final.jpg'),type:'jpeg',quality:95});
    const sizes=Object.fromEntries(['png','jpg'].map(ext=>[ext,fs.statSync(path.join(root,'elizaveta-gannenko-business-card-final.'+ext)).size]));
    await page.locator('.business-card').evaluate(el=>el.classList.add('phone-card'));
    await page.setViewportSize({width:900,height:1100});
    await page.locator('.business-card').screenshot({path:path.join(root,'elizaveta-gannenko-mobile-card-final.jpg'),type:'jpeg',quality:95});
    const mobileSize=fs.statSync(path.join(root,'elizaveta-gannenko-mobile-card-final.jpg')).size;
    const mobileCheck=await page.evaluate(()=>({overflow:document.querySelector('.business-card').scrollWidth>900,phoneContactPixels:37*390/900,portraitWidth:document.querySelector('img').naturalWidth,qrLoaded:document.querySelector('.wechat-card img').naturalWidth>0,websiteText:document.querySelector('a[href="https://mice.tailorstudio.ru"]').innerText,contactsClearOfScope:document.querySelector('.contacts').getBoundingClientRect().bottom<document.querySelector('.scope').getBoundingClientRect().top}));
    console.log(JSON.stringify({checks,errors,sizes,mobileSize,mobileCheck},null,2));
    if(!checks.fontReady||!checks.imageLoaded||!checks.qrLoaded||checks.overflow||!checks.contactsClearOfScope||checks.websiteText!=='mice.tailorstudio.ru'||mobileCheck.overflow||!mobileCheck.qrLoaded||!mobileCheck.contactsClearOfScope||mobileCheck.websiteText!=='mice.tailorstudio.ru'||errors.length||sizes.jpg>=2000000||sizes.png>=2000000||mobileSize>=2000000) process.exitCode=1;
  } finally { await browser.close();server.close(); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
