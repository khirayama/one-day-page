import * as React from 'react';

import { DateInfo } from '../services';
import { Button } from './Button';
import { CalendarDateCell } from './CalendarDateCell';

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

          return (
            <CalendarDateCell
              key={`${dateInfo.month}-${dateInfo.date}`}
              date={props.date}
              dateInfo={dateInfo}
              disabled={!isInThisMonth}
            />
          );
        })}
      </tr>,
    );
  }

  return (
    <div className="py-1 px-2">
      <div className="text-center py-4">
        {firstDateInfoOfMonth.year}年 {firstDateInfoOfMonth.yearJa} {firstDateInfoOfMonth.month}月{' '}
        {firstDateInfoOfMonth.monthJa}
      </div>
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th colSpan={7}>
              <div className="flex justify-between">
                <Button onClick={props.onPrevMonthButtonClick}>前月</Button>
                <Button onClick={props.onCurrentMonthButtonClick}>今月</Button>
                <Button onClick={props.onNextMonthButtonClick}>次月</Button>
              </div>
            </th>
          </tr>
          <tr>
            {days.map((day) => (
              <th key={day} className="py-1 border-l border-r font-normal">
                {day.replace('曜日', '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{calendarRows}</tbody>
      </table>
    </div>
  );
}
