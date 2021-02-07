import type { NextApiRequest, NextApiResponse } from 'next';

import dayjs from 'dayjs';
import { createCanvas } from 'canvas';

import { services } from '../../../services';
import { render } from '../../../utils/OGPRender';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const dateString = (Array.isArray(id) ? id.join('') : id).replace('.png', '');

  const canvas = createCanvas(200, 200);
  const fmt = 'YYYY-MM-DD';
  const d = dayjs(dateString);

  const date = d.format(fmt);
  const frm = d.add(1, 'day').format(fmt);
  const to = d.add(12, 'month').format(fmt);

  Promise.all([
    services.fetchDate(date),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'nationalholiday' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'solarterm' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'specialterm' }),
  ]).then(([dInfo, nationalholidays, solarterms, specialterms]) => {
    render(canvas, {
      dateInfo: dInfo,
      nextNationalholiday: nationalholidays[0],
      nextSolarterm: solarterms[0],
      nextSpecialterm: specialterms[0],
    });

    // [Send file as response Discussion #15453 vercel/next.js](https://github.com/vercel/next.js/discussions/15453#discussioncomment-41926)
    res.setHeader('Content-Type', 'image/jpg');
    res.send(canvas.toBuffer());
  });
}
