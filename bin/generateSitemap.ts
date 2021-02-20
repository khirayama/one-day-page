import * as fs from 'fs';

(() => {
  fs.writeFileSync('./public/sitemap.xml', 'hi');
})();
