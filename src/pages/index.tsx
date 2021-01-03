import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { services, DateInfo, ScheduleInfo } from '../services';

export default function IndexPage() {
  let fmt = 'YYYY-MM-DD';

  let d = dayjs();
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      d = dayjs(query.date || d);
    }
  }
  const date: string = d.format(fmt);

  const [dateInfo, setDateInfo] = React.useState(null);
  const [nextNationalholiday, setNextNationalholiday] = React.useState(null);
  const [nextSolarterm, setNextSolarterm] = React.useState(null);
  const [nextSpecialterm, setNextSpecialterm] = React.useState(null);

  React.useEffect(() => {
    const nextD = d.add(1, 'day');
    // date
    services.fetchDate(date).then((dInfo: DateInfo) => {
      setDateInfo(dInfo);
    });
    // Next nationalholiday
    services
      .fetchSchedules(nextD.format(fmt), d.add(12, 'month').format(fmt), 1, ['nationalholiday'])
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextNationalholiday(scheduleInfo[0]);
      });
    // Next solarterm
    services
      .fetchSchedules(nextD.format(fmt), d.add(12, 'month').format(fmt), 1, ['solarterm'])
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextSolarterm(scheduleInfo[0]);
      });
    // Next specialterm
    services
      .fetchSchedules(nextD.format(fmt), d.add(12, 'month').format(fmt), 1, ['specialterm'])
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextSpecialterm(scheduleInfo[0]);
      });
  }, []);

  return dateInfo === null || nextNationalholiday === null || nextSolarterm === null || nextSpecialterm === null ? (
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
                {schedule.name}({schedule.labelJa})
              </div>
            );
          })}

          {[nextNationalholiday, nextSolarterm, nextSpecialterm].map((scheduleInfo) => {
            const scheduleDate = dayjs(scheduleInfo.date);
            return (
              <div key={scheduleInfo.label + scheduleInfo.date}>
                次の{scheduleInfo.labelJa}は{scheduleDate.format('M月D日')}({scheduleDate.diff(date, 'day')}日後){' '}
                {scheduleInfo.name}
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
