import * as React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { DateInfo, ScheduleInfo } from '../services';

export function CalendarDateCell(props: { date: string; dateInfo: DateInfo; disabled?: boolean }) {
  const dateInfo = props.dateInfo;

  const isHoliday = !!dateInfo.schedules.filter((schedule) => schedule.label === 'nationalholiday').length;
  const isTarget = props.date === dayjs(`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}`).format('YYYY-MM-DD');

  return (
    <td
      className={classNames(
        'text-xs',
        'border-l',
        'border-r',
        'align-top',
        'py-2',
        'px-1',
        { 'text-red-400': dateInfo.day === 'Sunday' && !props.disabled },
        { 'text-red-400': isHoliday && !props.disabled },
        { 'text-gray-300': props.disabled },
        { 'font-bold': isTarget },
      )}
    >
      <div className="flex justify-between">
        <div className="font-bold">{dateInfo.date}</div>
        <div>{dateInfo.rokuyo}</div>
      </div>
      <ul className="pt-2 pb-4 h-24">
        {dateInfo.schedules.map((schedule: ScheduleInfo, i) => (
          <li key={`weely-calendar-schedule-${schedule.date}-${i}`}>{schedule.name}</li>
        ))}
      </ul>
    </td>
  );
}
