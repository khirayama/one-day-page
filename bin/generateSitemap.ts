import * as fs from 'fs';
import dayjs from 'dayjs';

import { config } from '../src/config';

(() => {
  const now = dayjs();
  const startDate = dayjs('2020-02-01');
  const endDate = dayjs('2021-11-31');
  let current = startDate.clone();

  console.log(`From ${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}`);
  const urls = [];
  while (!current.isAfter(endDate)) {
    urls.push(`<url>
<loc>${config.APP_URL}/?date=${current.format('YYYY-MM-DD')}</loc>
<lastmod>${now.format('YYYY-MM-DD')}</lastmod>
</url>`);
    current = current.add(1, 'day');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;
  fs.writeFileSync('./public/sitemap.xml', xml);
})();
