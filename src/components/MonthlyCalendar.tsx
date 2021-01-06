import * as React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { DateInfo, ScheduleInfo } from '../services';

export function MonthlyCalendar(props: {
  date: string;
  monthlyCalendar: DateInfo[];
  onPrevMonthButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCurrentMonthButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNextMonthButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const monthlyCalendar = props.monthlyCalendar;
  const days = monthlyCalendar.slice(0, 7).map((dateInfo: DateInfo) => dateInfo.dayJa);
  const firstDateInfoOfMonth = monthlyCalendar.filter((dateInfo: DateInfo) => dateInfo.date === '1')[0];

  const calendarRows = [];
  for (let i = 0; i < monthlyCalendar.length / days.length; i += 1) {
    calendarRows.push(
      <tr key={`week-${i}-of-month`}>
        {days.map((day, j) => {
          const num = i * days.length + j;
          const dateInfo: DateInfo = monthlyCalendar[num];

          const isInThisMonth = firstDateInfoOfMonth.month === dateInfo.month;
          const isHoliday = !!dateInfo.schedules.filter((schedule) => schedule.label === 'nationalholiday').length;
          const isTarget =
            props.date === dayjs(`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}`).format('YYYY-MM-DD');

          return (
            <td
              key={`${dateInfo.month}-${dateInfo.date}`}
              className={classNames(
                'border',
                'align-top',
                { 'text-gray-300': !isInThisMonth },
                { 'text-red-400': isHoliday && isInThisMonth },
                { 'text-red-400': j === 0 && isInThisMonth },
                { 'font-bold': isTarget },
              )}
            >
              <div>{dateInfo.date}</div>
              <div>{dateInfo.rokuyo}</div>
              <div>{dateInfo.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}</div>
            </td>
          );
        })}
      </tr>,
    );
  }

  return (
    <div>
      <h3>月間カレンダー</h3>
      <div>
        {firstDateInfoOfMonth.year}年({firstDateInfoOfMonth.yearJa}){firstDateInfoOfMonth.month}月{' '}
        {firstDateInfoOfMonth.monthJa}
      </div>
      <button onClick={props.onPrevMonthButtonClick}>前月</button>
      <button onClick={props.onCurrentMonthButtonClick}>今月</button>
      <button onClick={props.onNextMonthButtonClick}>次月</button>
      <table className="table-fixed border w-full">
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day} className="border">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{calendarRows}</tbody>
      </table>
    </div>
  );
}
