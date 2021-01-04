import * as React from 'react';
import { DateInfo, ScheduleInfo } from '../services';

export function WeeklyCalendar(props: {
  weeklyCalendar: DateInfo[];
  onPrevWeekButtonClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onNextWeekButtonClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const weeklyCalendar = props.weeklyCalendar;

  return (
    <>
      <button onClick={props.onPrevWeekButtonClick}>前週</button>
      <button onClick={props.onNextWeekButtonClick}>次週</button>
      <ul className="flex">
        {weeklyCalendar.map((weeklyCal: DateInfo) => {
          return (
            <li key={`week-${weeklyCal.month}-${weeklyCal.date}`} className="flex-1">
              <div>{weeklyCal.month}</div>
              <div>
                {weeklyCal.date} {weeklyCal.dayJa} {weeklyCal.rokuyo}
              </div>
              <div>{weeklyCal.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
