import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { services, DateInfo } from '../services';

export default function IndexPage() {
  let fmt = 'YYYY-MM-DD';
  let date: string = dayjs().format(fmt);
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      date = dayjs(query.date || date).format(fmt);
    }
  }

  const [dateInfo, setDateInfo] = React.useState(null);

  React.useEffect(() => {
    services.fetchDate(date).then((dInfo: DateInfo) => {
      setDateInfo(dInfo);
    });
  }, []);

  return dateInfo === null ? (
    '読み込み中'
  ) : (
    <div className="max-w-screen-sm mx-auto">
      <header className="py-4 px-2">
        <div>
          <div>
            {dateInfo.year}年({dateInfo.yearJa})
          </div>
          <div>{dateInfo.monthJa}</div>
          <div>
            <div className="inline-block">{dateInfo.month}</div>
            <div className="inline-block">月</div>
            <div className="inline-block">{dateInfo.date}</div>
            <div className="inline-block">日</div>
          </div>
          <div>
            <div>{dateInfo.dayJa}</div>
            <div>{dateInfo.rokuyo}</div>
          </div>
        </div>

        <div>
          {dateInfo.schedules.map((schedule: DateInfo['schedules'][0]) => {
            return (
              <div key={schedule.name}>
                {schedule.labelJa} {schedule.name}
              </div>
            );
          })}
          {Object.keys(dateInfo.nextSchedules).map((scheduleLabel) => {
            const schedule = dateInfo.nextSchedules[scheduleLabel];
            const scheduleDate = dayjs(schedule.date);
            return (
              <div key={schedule.label + schedule.date}>
                次の{schedule.labelJa}は{scheduleDate.format('M月D日')}({scheduleDate.diff(date, 'day')}日後){' '}
                {schedule.name}
              </div>
            );
          })}
        </div>
      </header>
      <div>週間カレンダー</div>
      <div>月間カレンダー</div>
      <h2>旬の食べ物</h2>
      <div>
        <span>大根</span>
        <span>ブロッコリー</span>
        <span>太刀魚</span>
        <span>柿</span>
      </div>
    </div>
  );
}
