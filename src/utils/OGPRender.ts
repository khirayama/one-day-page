import dayjs from 'dayjs';
import { Canvas, registerFont } from 'canvas';

import { DateInfo, ScheduleInfo } from '../services';

export function render(
  canvas: Canvas,
  data: {
    dateInfo: DateInfo;
    nextNationalholiday: ScheduleInfo;
    nextSolarterm: ScheduleInfo;
    nextSpecialterm: ScheduleInfo;
  },
) {
  const dateInfo = data.dateInfo;
  const date = dayjs(`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}`).format('YYYY-MM-DD');
  let width = 1200;
  let height = 1200;

  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');

  const styles = {
    padding: 80,
    background: '#fff',
    fontSize: 44,
    // fontFamily:
    //   'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontFamily: 'NotoSansJP-Regular.otf',
    color: '#333', // TODO
    color2: '#aaa', // TODO
  };

  if (typeof window === 'undefined') {
    const path = require('path');
    registerFont(path.resolve(`./public/fonts/${styles.fontFamily}`), { family: styles.fontFamily });
  } else {
    registerFont(`./public/fonts/${styles.fontFamily}`, { family: styles.fontFamily });
  }

  ctx.fillStyle = styles.background;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = styles.color;
  ctx.textBaseline = 'top';
  ctx.font = `${styles.fontSize}px ${styles.fontFamily}`;
  // ctx.font = `${styles.fontSize}px`;

  let y = styles.fontSize * 1.5;

  const yearText = `${dateInfo.year}年`;
  const sizeOfYearText = ctx.measureText(yearText);
  ctx.fillText(yearText, width / 2 - sizeOfYearText.width - styles.fontSize / 4, y);
  ctx.fillText(dateInfo.yearJa, width / 2 + styles.fontSize / 4, y);

  const monthText = `${dateInfo.month}月`;
  const sizeOfMonthText = ctx.measureText(monthText);
  y = y + styles.fontSize + styles.fontSize / 2;
  ctx.fillText(monthText, width / 2 - sizeOfMonthText.width - styles.fontSize / 4, y);
  ctx.fillText(dateInfo.monthJa, width / 2 + styles.fontSize / 4, y);

  ctx.font = `bold ${styles.fontSize * 8}px ${styles.fontFamily}`;

  y = y + styles.fontSize * 2;
  const sizeOfDate = ctx.measureText(dateInfo.date);
  ctx.fillText(dateInfo.date, (width - sizeOfDate.width) / 2, y);

  ctx.font = `${styles.fontSize}px ${styles.fontFamily}`;

  y = y + styles.fontSize * 9;
  const sizeOfDay = ctx.measureText(dateInfo.dayJa);
  ctx.fillText(dateInfo.dayJa, width / 2 - sizeOfDay.width - styles.fontSize / 4, y);
  ctx.fillText(dateInfo.rokuyo, width / 2 + styles.fontSize / 4, y);

  y = y + styles.fontSize;
  for (let i = 0; i < dateInfo.schedules.length; i += 1) {
    const schedule = dateInfo.schedules[i];
    const sizeOfSchedule = ctx.measureText(schedule.name);
    const sizeOfScheduleLabel = ctx.measureText(schedule.labelJa);
    y = y + (styles.fontSize + styles.fontSize / 2);
    ctx.fillStyle = styles.color2;
    ctx.fillText(
      schedule.labelJa,
      (width - sizeOfSchedule.width) / 2 - sizeOfScheduleLabel.width - styles.fontSize / 4,
      y,
    );
    ctx.fillStyle = styles.color;
    ctx.fillText(schedule.name, (width - sizeOfSchedule.width) / 2, y);
  }

  // y = y + styles.fontSize * 3;
  const nextSchedules = [data.nextNationalholiday, data.nextSolarterm, data.nextSpecialterm];
  let yFromBottom = height - styles.fontSize * 1.5;
  for (let i = nextSchedules.length - 1; i >= 0; i -= 1) {
    const schedule = nextSchedules[i];
    const scheduleDate = dayjs(schedule.date);

    const scheduleText = `${scheduleDate.format('M月D日')}(${scheduleDate.diff(date, 'day')}日後) ${schedule.name}`;
    const scheduleLabelText = '次の' + schedule.labelJa;
    const sizeOfSchedule = ctx.measureText(scheduleText);
    const sizeOfScheduleLabel = ctx.measureText(scheduleLabelText);
    yFromBottom -= styles.fontSize;
    ctx.fillStyle = styles.color2;
    ctx.fillText(
      '次の' + schedule.labelJa,
      width - sizeOfSchedule.width - styles.fontSize - sizeOfScheduleLabel.width - styles.fontSize,
      yFromBottom,
    );
    ctx.fillStyle = styles.color;
    ctx.fillText(scheduleText, width - sizeOfSchedule.width - styles.fontSize * 1.5, yFromBottom);
    yFromBottom -= styles.fontSize * 0.5;
  }
}
