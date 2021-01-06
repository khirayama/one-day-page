import * as React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { DateInfo, ScheduleInfo } from '../services';

export function WeeklyCalendar(props: {
  date: string;
  weeklyCalendar: DateInfo[];
  onPrevWeekButtonClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onCurrentWeekButtonClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onNextWeekButtonClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const weeklyCalendar = props.weeklyCalendar;
  const first = weeklyCalendar[0];
  const last = weeklyCalendar[weeklyCalendar.length - 1];
  const firstMonthLength = weeklyCalendar.filter((dateInfo) => dateInfo.month === first.month).length;
  const lastMonthLength = weeklyCalendar.filter((dateInfo) => dateInfo.month === last.month).length;

  return (
    <div>
      <h3>週間カレンダー</h3>
      <div>
        {first.year}年({first.yearJa}){first.month}月{first.date}日 - {last.year}年({last.yearJa}){last.month}月
        {last.date}日
      </div>
      <button onClick={props.onPrevWeekButtonClick}>前週</button>
      <button onClick={props.onCurrentWeekButtonClick}>今週</button>
      <button onClick={props.onNextWeekButtonClick}>次週</button>
      <table className="table-fixed border w-full">
        <thead>
          <tr>
            {firstMonthLength !== 0 ? (
              <th key={first.day} colSpan={firstMonthLength} className="border text-left">
                {first.month} {first.monthJa}
              </th>
            ) : null}
            {lastMonthLength !== 0 && firstMonthLength !== lastMonthLength ? (
              <th key={last.day} colSpan={lastMonthLength} className="border text-left">
                {last.month} {last.monthJa}
              </th>
            ) : null}
          </tr>
          <tr>
            {weeklyCalendar.map((dateInfo) => (
              <th key={dateInfo.day} className="border">
                {dateInfo.dayJa}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weeklyCalendar.map((dateInfo: DateInfo, i) => {
              const isHoliday = !!dateInfo.schedules.filter((schedule) => schedule.label === 'nationalholiday').length;
              const isTarget =
                props.date === dayjs(`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}`).format('YYYY-MM-DD');

              return (
                <td
                  key={`${dateInfo.month}-${dateInfo.date}`}
                  className={classNames(
                    'border',
                    'align-top',
                    { 'text-red-400': i === 0 },
                    { 'text-red-400': isHoliday },
                    { 'font-bold': isTarget },
                  )}
                >
                  <div>{dateInfo.date}</div>
                  <div>{dateInfo.rokuyo}</div>
                  <div>{dateInfo.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}</div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
