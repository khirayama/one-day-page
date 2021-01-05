import * as React from 'react';
import { DateInfo, ScheduleInfo } from '../services';

export function MonthlyCalendar(props: {
  monthlyCalendar: DateInfo[];
  onPrevMonthButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNextMonthButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const monthlyCalendar = props.monthlyCalendar;

  return (
    <div>
      <button onClick={props.onPrevMonthButtonClick}>前月</button>
      <button onClick={props.onNextMonthButtonClick}>次月</button>
      <ul className="grid grid-cols-7">
        {monthlyCalendar.map((monthCal: DateInfo) => {
          return (
            <li key={`month-${monthCal.month}-${monthCal.date}`} className="p-1 border">
              {monthCal.date} {monthCal.dayJa} {monthCal.rokuyo}{' '}
              {monthCal.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
