const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const {chromium}=require('C:/Users/usrr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp=require('C:/Users/usrr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.join(__dirname,'site');const base='http://127.0.0.1:8798';
async function prepare(){
 const source='C:/Users/usrr/.codex/generated_images/01a1013f-a754-7411-a06a-2718f696270e/exec-39226773-0c63-49b0-b606-d445fa370263.png';
 if(!fs.existsSync(path.join(root,'assets','venue.webp')))await sharp(source).resize({width:1600,withoutEnlargement:true}).webp({quality:87}).toFile(path.join(root,'assets','venue.webp'));
}
function serve(){return new Promise(resolve=>{
 const server=http.createServer((req,res)=>{const url=new URL(req.url,base);let rel=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.ttf':'font/ttf'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);});server.listen(8798,'127.0.0.1',()=>{console.log('Tailor Studio preview: '+base);resolve(server);});
});}
async function inspect(){
 const browser=await chromium.launch({headless:true});const reports=[];
 try{for(const [name,width,height]of[['desktop',1440,1000],['mobile',390,844],['small-phone',320,780],['tablet',768,1024]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});const errors=[];const failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>null);}));});
  const report=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,fontLoaded:document.fonts.check('600 30px Manrope'),brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.src),badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href')!=='#'&&!document.querySelector(a.getAttribute('href'))).map(a=>a.getAttribute('href')),h1:document.querySelector('h1').innerText,contactEmail:document.querySelector('.contact-email').innerText,diaryImages:document.querySelectorAll('.diary-card img').length}));
  if(name==='desktop'||name==='mobile'){await page.screenshot({path:path.join(__dirname,'site-'+name+'.png'),fullPage:true});await page.screenshot({path:path.join(__dirname,'site-'+name+'-first-screen.png')});await page.locator('.contact').screenshot({path:path.join(__dirname,'site-'+name+'-contact.png')});}
  const heroPlates=await page.locator('.hero-plate').count();await page.locator('.hero-plate--canal').hover();await page.waitForTimeout(80);const heroInteraction=await page.locator('.hero-scene').evaluate(scene=>scene.classList.contains('is-engaged'));
  await page.locator('.format-row').nth(1).click();await page.waitForTimeout(80);const formatSwap=await page.locator('.format-preview img').getAttribute('src')==='assets/gallery/format-incentives-umbrellas.jpg';
  await page.locator('.destination-tabs button').nth(1).click();await page.waitForTimeout(80);const suzhouSwap=await page.locator('.destination-photo img').getAttribute('src')==='assets/gallery/destination-suzhou-canal.jpg';await page.locator('.destination-tabs button').nth(2).click();await page.waitForTimeout(80);const destinationSwap=await page.locator('.destination-photo img').getAttribute('src')==='assets/gallery/destination-chongqing-river-bridge.jpg';await page.locator('.destination-tabs button').nth(3).click();await page.waitForTimeout(80);const jiangnanSwap=await page.locator('.destination-photo img').getAttribute('src')==='assets/gallery/destination-jiangnan-water-town.jpg';
  await page.evaluate(()=>document.querySelector('.site-menu nav a[href="#contact"]').click());await page.waitForTimeout(250);const contactReached=await page.evaluate(()=>{const b=document.querySelector('#contact').getBoundingClientRect();return b.top<innerHeight&&b.bottom>0;});
  reports.push({name,...report,heroPlates,heroInteraction,formatSwap,suzhouSwap,destinationSwap,jiangnanSwap,contactReached,errors,failed});await page.close();
 }
 console.log(JSON.stringify(reports,null,2));if(reports.some(r=>r.overflow||!r.fontLoaded||r.brokenImages.length||r.missingAlt.length||r.badAnchors.length||r.errors.length||r.failed.length||r.heroPlates!==4||!r.heroInteraction||!r.formatSwap||!r.suzhouSwap||!r.destinationSwap||!r.jiangnanSwap||!r.contactReached))process.exitCode=1;
 }finally{await browser.close();}
}
(async()=>{await prepare();if(process.argv.includes('--serve')){await serve();return;}if(process.argv.includes('--qa')){await inspect();return;}const server=await serve();try{await inspect();}finally{server.close();}})().catch(e=>{console.error(e);process.exit(1);});
