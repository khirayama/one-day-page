import type { NextApiRequest, NextApiResponse } from 'next';

import { config } from '../../config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    lang: config.lang,
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: '/?utm_source=pwa',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#aaa',
    icons: [
      {
        src: 'http://placehold.jp/48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: 'http://placehold.jp/96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: 'http://placehold.jp/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'http://placehold.jp/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
}
