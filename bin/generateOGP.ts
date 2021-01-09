import * as fs from 'fs';
import dayjs from 'dayjs';
import { createCanvas } from 'canvas';
import { decode } from 'urlsafe-base64';

import { services } from '../src/services';
import { render } from '../src/utils/OGPRender';

(() => {
  const d = dayjs();
  const fmt = 'YYYY-MM-DD';
  const size = 1200;

  const date = d.format(fmt);
  const frm = d.add(1, 'day').format(fmt);
  const to = d.add(12, 'month').format(fmt);

  const canvas = createCanvas(0, 0);

  Promise.all([
    services.fetchDate(date),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'nationalholiday' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'solarterm' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'specialterm' }),
  ]).then(([dInfo, nationalholidays, solarterms, specialterms]) => {
    render(
      canvas,
      {
        dateInfo: dInfo,
        nextNationalholiday: nationalholidays[0],
        nextSolarterm: solarterms[0],
        nextSpecialterm: specialterms[0],
      },
      { width: size, height: size },
    );
    let b64 = canvas.toDataURL().split(',');
    let img = decode(b64[1]);

    fs.writeFile('./sample.jpg', img, (err) => {
      console.log(err);
    });
  });
})();
