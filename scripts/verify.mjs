import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');
const pages=['index.html','story/index.html','menu/index.html','gallery/index.html','visit/index.html'];
const origin='https://nishita-gp1111.github.io/maruichi/';
let references=0;
for(const page of pages){
  const file=resolve(root,page),html=await readFile(file,'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${page}: one primary heading`);
  assert.match(html,/<html lang="ja">/);
  assert.match(html,/<meta name="description" content="[^"]{20,}"/);
  assert.match(html,/maruichi_tokorozawa/);
  assert(html.includes(`<link rel="canonical" href="${origin}${page.replace('index.html','')}">`),`${page}: GitHub Pages canonical`);
  assert.doesNotMatch(html,/chatgpt\.site|\/Users\/|file:\/\//);
  assert.doesNotMatch(html,/aoisisters|lorem ipsum|Coming soon|TODO|仮テキスト/i);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,`${page}: unique IDs`);
  for(const m of html.matchAll(/(?:href|src|data-full)="([^"]+)"/g)){
    const value=m[1];if(/^(https?:|tel:|data:)/.test(value))continue;
    assert(!value.startsWith('/'),`${page}: project-relative URL ${value}`);
    const [path,hash]=value.split('#');
    let target=path?resolve(dirname(file),path):file;
    assert(target.startsWith(root));
    if((await stat(target)).isDirectory())target=resolve(target,'index.html');
    assert((await stat(target)).size>0,`${page}: ${value}`);
    if(hash){const text=await readFile(target,'utf8');assert(text.includes(`id="${hash}"`),`${page}: anchor ${value}`);}
    references++;
  }
}
const menu=await readFile(resolve(root,'menu/index.html'),'utf8');
for(const [name,price] of [['中華そば','950'],['まるいちスペシャル','1,350'],['味噌チャーシューメン','1,350'],['塩ラーメン','950'],['つけ麺','1,200'],['つまみチャーシュー','750'],['餃子（5個）','400'],['厚揚げ','400']])assert(menu.includes(`<h3>${name}</h3><p class="price"><span>¥</span>${price}</p>`));
assert.match(menu,/whole-price">¥4,000/);
const visit=await readFile(resolve(root,'visit/index.html'),'utf8');
for(const fact of ['04-2925-7515','星の宮1-2-8','18:00–22:00','18:00–23:00','18:00–21:00','月</th><td colspan="2">定休日'])assert(visit.includes(fact));
const story=await readFile(resolve(root,'story/index.html'),'utf8');
assert(story.includes('2025年11月12日'));assert(story.includes('三人目'));
const css=await readFile(resolve(root,'assets/site.css'),'utf8');
assert(css.includes('prefers-reduced-motion:reduce'));assert(css.includes('photo-open'));
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
for(const page of pages)assert(sitemap.includes(`<loc>${origin}${page.replace('index.html','')}</loc>`));
assert((await readFile(resolve(root,'robots.txt'),'utf8')).includes(`Sitemap: ${origin}sitemap.xml`));
console.log(`PASS: ${pages.length} pages; ${references} local links, anchors and assets; 9 prices; hours, contacts, story and reduced-motion support.`);
