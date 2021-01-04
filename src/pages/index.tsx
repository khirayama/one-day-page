import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { services, DateInfo, ScheduleInfo, IngredientInfo } from '../services';

export default function IndexPage() {
  let fmt = 'YYYY-MM-DD';

  let d = dayjs();
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      d = dayjs(query.date || d);
    }
  }

  const [date] = React.useState(d.format(fmt));
  const [firstDayOfWeek, setFirstDayOfWeek] = React.useState(d.add(-1 * d.get('day'), 'day').format(fmt));
  const [yearAndMonth, setYearAndMonth] = React.useState(d.format('YYYY-MM'));
  const [dateInfo, setDateInfo] = React.useState(null);
  const [nextNationalholiday, setNextNationalholiday] = React.useState(null);
  const [nextSolarterm, setNextSolarterm] = React.useState(null);
  const [nextSpecialterm, setNextSpecialterm] = React.useState(null);
  const [weekCalendar, setWeekCalendar] = React.useState(null);
  const [monthCalendar, setMonthCalendar] = React.useState(null);
  const [seasonalVegetables, setSeasonalVegetables] = React.useState(null);
  const [seasonalFruits, setSeasonalFruits] = React.useState(null);
  const [seasonalFishes, setSeasonalFishes] = React.useState(null);
  const [seasonalSeafoods, setSeasonalSeafoods] = React.useState(null);
  const [seasonalOthers, setSeasonalOthers] = React.useState(null);

  React.useEffect(() => {
    const frm = d.add(1, 'day').format(fmt);
    const to = d.add(12, 'month').format(fmt);

    services.fetchDate(date).then((dInfo: DateInfo) => {
      setDateInfo(dInfo);
    });
    services.fetchSchedules(frm, to, 1, ['nationalholiday']).then((scheduleInfo: ScheduleInfo[]) => {
      setNextNationalholiday(scheduleInfo[0]);
    });
    services.fetchSchedules(frm, to, 1, ['solarterm']).then((scheduleInfo: ScheduleInfo[]) => {
      setNextSolarterm(scheduleInfo[0]);
    });
    services.fetchSchedules(frm, to, 1, ['specialterm']).then((scheduleInfo: ScheduleInfo[]) => {
      setNextSpecialterm(scheduleInfo[0]);
    });

    services
      .fetchCalendar({
        from: firstDayOfWeek,
        to: dayjs(firstDayOfWeek).add(6, 'day').format(fmt),
      })
      .then((weekCal: DateInfo[]) => {
        setWeekCalendar(weekCal);
      });

    const firstDayOfMonth = dayjs(`${yearAndMonth}-1`);
    const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
    services
      .fetchCalendar({
        from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
        to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
      })
      .then((monthCal: DateInfo[]) => {
        setMonthCalendar(monthCal);
      });

    const month = d.get('month') + 1;
    services.fetchIngredients(month, month, 3, ['vegetable']).then((ingredients: IngredientInfo[]) => {
      setSeasonalVegetables(ingredients);
    });
    services.fetchIngredients(month, month, 3, ['fruit']).then((ingredients: IngredientInfo[]) => {
      setSeasonalFruits(ingredients);
    });
    services.fetchIngredients(month, month, 3, ['fish']).then((ingredients: IngredientInfo[]) => {
      setSeasonalFishes(ingredients);
    });
    services.fetchIngredients(month, month, 3, ['seafood']).then((ingredients: IngredientInfo[]) => {
      setSeasonalSeafoods(ingredients);
    });
    services.fetchIngredients(month, month, 3, ['other']).then((ingredients: IngredientInfo[]) => {
      setSeasonalOthers(ingredients);
    });
  }, []);

  return dateInfo === null ||
    nextNationalholiday === null ||
    nextSolarterm === null ||
    nextSpecialterm === null ||
    weekCalendar === null ||
    monthCalendar === null ||
    seasonalVegetables === null ||
    seasonalFruits === null ||
    seasonalFishes === null ||
    seasonalSeafoods === null ||
    seasonalOthers === null ? (
    '読み込み中'
  ) : (
    <div className="max-w-screen-sm mx-auto">
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
          {dateInfo.schedules.map((schedule: DateInfo['schedules'][0]) => {
            return (
              <div key={schedule.name}>
                {schedule.name}({schedule.labelJa})
              </div>
            );
          })}

          {[nextNationalholiday, nextSolarterm, nextSpecialterm].map((scheduleInfo) => {
            const scheduleDate = dayjs(scheduleInfo.date);
            return (
              <div key={scheduleInfo.label + scheduleInfo.date}>
                次の{scheduleInfo.labelJa}は{scheduleDate.format('M月D日')}({scheduleDate.diff(date, 'day')}日後){' '}
                {scheduleInfo.name}
              </div>
            );
          })}
        </div>
      </header>
      <div>週間カレンダー</div>
      <button
        onClick={() => {
          const prevFirstDayOfWeek = dayjs(firstDayOfWeek).add(-7, 'day').format(fmt);
          services
            .fetchCalendar(prevFirstDayOfWeek, dayjs(prevFirstDayOfWeek).add(6, 'day').format(fmt), 1000)
            .then((weekCal: DateInfo[]) => {
              setFirstDayOfWeek(prevFirstDayOfWeek);
              setWeekCalendar(weekCal);
            });
        }}
      >
        前週
      </button>
      <button
        onClick={() => {
          const nextFirstDayOfWeek = dayjs(firstDayOfWeek).add(7, 'day').format(fmt);
          setFirstDayOfWeek(nextFirstDayOfWeek);
          services
            .fetchCalendar(nextFirstDayOfWeek, dayjs(nextFirstDayOfWeek).add(6, 'day').format(fmt), 1000)
            .then((weekCal: DateInfo[]) => {
              setWeekCalendar(weekCal);
            });
        }}
      >
        次週
      </button>
      <ul>
        {weekCalendar.map((weekCal: DateInfo) => {
          return (
            <li key={`week-${weekCal.month}-${weekCal.date}`}>
              {weekCal.date} {weekCal.dayJa} {weekCal.rokuyo}{' '}
              {weekCal.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}
            </li>
          );
        })}
      </ul>

      <div>月間カレンダー({yearAndMonth}月)</div>
      <button
        onClick={() => {
          const current = dayjs(`${yearAndMonth}-1`);
          const firstDayOfMonth = current.add(-1, 'month');
          const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
          services
            .fetchCalendar(
              firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
              lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
              1000,
            )
            .then((monthCal: DateInfo[]) => {
              setYearAndMonth(firstDayOfMonth.format('YYYY-MM'));
              setMonthCalendar(monthCal);
            });
        }}
      >
        前月
      </button>
      <button
        onClick={() => {
          const current = dayjs(`${yearAndMonth}-1`);
          const firstDayOfMonth = current.add(1, 'month');
          const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
          services
            .fetchCalendar(
              firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
              lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
              1000,
            )
            .then((monthCal: DateInfo[]) => {
              setYearAndMonth(firstDayOfMonth.format('YYYY-MM'));
              setMonthCalendar(monthCal);
            });
        }}
      >
        次月
      </button>
      <ul>
        {monthCalendar.map((monthCal: DateInfo) => {
          return (
            <li key={`month-${monthCal.month}-${monthCal.date}`}>
              {monthCal.date} {monthCal.dayJa} {monthCal.rokuyo}{' '}
              {monthCal.schedules.map((schedule: ScheduleInfo) => schedule.name).join(',')}
            </li>
          );
        })}
      </ul>
      <h2>旬の食べ物</h2>
      {[seasonalVegetables, seasonalFruits, seasonalFishes, seasonalSeafoods, seasonalOthers].map(
        (ingredients: IngredientInfo[], i) => {
          return (
            <div key={`ingredient-${i}`}>
              <h3>{ingredients[0].labelJa}</h3>
              <ul>
                {ingredients.map((ingredient: IngredientInfo) => {
                  return <li key={ingredient.name}>{ingredient.name}</li>;
                })}
              </ul>
            </div>
          );
        },
      )}
    </div>
  );
}
