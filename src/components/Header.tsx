import * as React from 'react';
import dayjs from 'dayjs';

import { DateInfo } from '../services';

type HeaderProps = {
  date: string;
  dateInfo: DateInfo;
};

export function Header(props: HeaderProps) {
  const targetDate = dayjs(props.date);
  const dateInfo = props.dateInfo;

  return (
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
        {dateInfo.schedules.map((schedule) => {
          return (
            <div key={schedule.name}>
              {schedule.labelJa} {schedule.name}
            </div>
          );
        })}
        {Object.keys(dateInfo.nextSchedules).map((scheduleLabel) => {
          const schedule = dateInfo.nextSchedules[scheduleLabel];
          const date = dayjs(schedule.date);
          return (
            <div key={schedule.label + schedule.date}>
              次の{schedule.labelJa}は{date.format('M月D日')} {schedule.name} {date.diff(targetDate, 'day')}日後
            </div>
          );
        })}
      </div>
    </header>
  );
}
