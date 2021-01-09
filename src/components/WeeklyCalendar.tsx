import * as React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { DateInfo, ScheduleInfo } from '../services';
import { Button } from './Button';

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

  return (
    <div className="py-8 px-2">
      <div className="text-center py-4">
        {first.year}年 {first.yearJa} {first.month}月{first.date}日 - {last.month}月{last.date}日
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th colSpan={7}>
              <div className="flex justify-between">
                <Button onClick={props.onPrevWeekButtonClick}>前週</Button>
                <Button onClick={props.onCurrentWeekButtonClick}>今週</Button>
                <Button onClick={props.onNextWeekButtonClick}>次週</Button>
              </div>
            </th>
          </tr>
          <tr>
            {weeklyCalendar.map((dateInfo) => (
              <th key={dateInfo.day} className="py-1 border-l border-r">
                {dateInfo.dayJa.replace('曜日', '')}
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
                    'border-l',
                    'border-r',
                    'align-top',
                    'p-2',
                    'border-r',
                    { 'text-red-400': i === 0 },
                    { 'text-red-400': isHoliday },
                    { 'font-bold': isTarget },
                  )}
                >
                  <div className="flex justify-between">
                    <div className="font-bold">{dateInfo.date}</div>
                    <div>{dateInfo.rokuyo}</div>
                  </div>
                  <ul className="text-xs py-4">
                    {dateInfo.schedules.map((schedule: ScheduleInfo, i) => (
                      <li key={`weely-calendar-schedule-${schedule.date}-${i}`}>{schedule.name}</li>
                    ))}
                  </ul>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
