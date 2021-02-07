// https://crieit.net/posts/Vercel-API-Routes-OGP-2020
import type { NextApiRequest, NextApiResponse } from 'next';

import * as path from 'path';

import { createCanvas, registerFont, loadImage } from 'canvas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  registerFont(path.resolve('./fonts/ipagp.ttf'), {
    family: 'ipagp',
  });

  const width = 600;
  const height = 315;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#fafafa';
  context.fillRect(0, 0, width, height);

  context.font = '15px ipagp';
  context.fillStyle = '#424242';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('あいうえお', 100, 50);

  const test = await loadImage(path.resolve('./images/test.png'));
  context.drawImage(test, 300, 0, 70, 70);

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    'Cache-Control': 'public, max-age=315360000, s_maxage=315360000',
    Expires: new Date(Date.now() + 315360000000).toUTCString(),
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.end(buffer, 'binary');
};
