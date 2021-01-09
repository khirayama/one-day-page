import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { services } from '../services';
import { render } from '../utils/OGPRender';

export default function CanvasPreviewPage() {
  const canvasRef = React.useRef();
  const fmt = 'YYYY-MM-DD';
  const size = 1200;

  let d = dayjs();
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      d = dayjs(query.date || d);
    }
  }

  React.useEffect(() => {
    const date = d.format(fmt);
    const frm = d.add(1, 'day').format(fmt);
    const to = d.add(12, 'month').format(fmt);

    Promise.all([
      services.fetchDate(date),
      services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'nationalholiday' }),
      services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'solarterm' }),
      services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'specialterm' }),
    ]).then(([dInfo, nationalholidays, solarterms, specialterms]) => {
      render(
        canvasRef.current,
        {
          dateInfo: dInfo,
          nextNationalholiday: nationalholidays[0],
          nextSolarterm: solarterms[0],
          nextSpecialterm: specialterms[0],
        },
        { width: size, height: size },
      );
    });
  }, []);

  return (
    <div className="bg-black w-full h-full py-20">
      <canvas ref={canvasRef} className="mx-auto" />
    </div>
  );
}
