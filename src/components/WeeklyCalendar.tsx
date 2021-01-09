import * as React from 'react';

import { DateInfo } from '../services';
import { Button } from './Button';
import { CalendarDateCell } from './CalendarDateCell';

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
              <th key={dateInfo.day} className="py-1 border-l border-r font-normal">
                {dateInfo.dayJa.replace('曜日', '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weeklyCalendar.map((dateInfo: DateInfo) => {
              return (
                <CalendarDateCell key={`${dateInfo.month}-${dateInfo.date}`} date={props.date} dateInfo={dateInfo} />
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
