import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';
import Head from 'next/head';

import { services, DateInfo, ScheduleInfo, IngredientInfo } from '../services';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { Ingredients } from '../components/Ingredients';

export default function IndexPage() {
  const fmt = 'YYYY-MM-DD';

  let d = dayjs();
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      d = dayjs(query.date || d);
    }
  }

  const [date] = React.useState(d.format(fmt));
  const [currentMonth, setCurrentMonth] = React.useState(d.format('YYYY-MM'));
  const [dateInfo, setDateInfo] = React.useState(null);
  const [nextNationalholiday, setNextNationalholiday] = React.useState(null);
  const [nextSolarterm, setNextSolarterm] = React.useState(null);
  const [nextSpecialterm, setNextSpecialterm] = React.useState(null);
  const [monthlyCalendar, setMonthlyCalendar] = React.useState(null);
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
    services
      .fetchSchedules({ from: frm, to: to, limit: 0, labels: 'nationalholiday' })
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextNationalholiday(scheduleInfo[0]);
      });
    services
      .fetchSchedules({ from: frm, to: to, limit: 1, labels: 'solarterm' })
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextSolarterm(scheduleInfo[0]);
      });
    services
      .fetchSchedules({ from: frm, to: to, limit: 1, labels: 'specialterm' })
      .then((scheduleInfo: ScheduleInfo[]) => {
        setNextSpecialterm(scheduleInfo[0]);
      });

    const firstDayOfMonth = dayjs(`${currentMonth}-1`);
    const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
    services
      .fetchCalendar({
        from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
        to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
      })
      .then((monthCal: DateInfo[]) => {
        setMonthlyCalendar(monthCal);
      });

    const month = d.get('month') + 1;
    const limit = 3;
    services
      .fetchIngredients({ from: month, to: month, limit, labels: 'vegetable' })
      .then((ingredients: IngredientInfo[]) => {
        setSeasonalVegetables(ingredients);
      });
    services
      .fetchIngredients({ from: month, to: month, limit, labels: 'fruit' })
      .then((ingredients: IngredientInfo[]) => {
        setSeasonalFruits(ingredients);
      });
    services
      .fetchIngredients({ from: month, to: month, limit, labels: 'fish' })
      .then((ingredients: IngredientInfo[]) => {
        setSeasonalFishes(ingredients);
      });
    services
      .fetchIngredients({ from: month, to: month, limit, labels: 'seafood' })
      .then((ingredients: IngredientInfo[]) => {
        setSeasonalSeafoods(ingredients);
      });
    services
      .fetchIngredients({ from: month, to: month, limit, labels: 'other' })
      .then((ingredients: IngredientInfo[]) => {
        setSeasonalOthers(ingredients);
      });
  }, []);

  return dateInfo === null ||
    nextNationalholiday === null ||
    nextSolarterm === null ||
    nextSpecialterm === null ||
    monthlyCalendar === null ||
    seasonalVegetables === null ||
    seasonalFruits === null ||
    seasonalFishes === null ||
    seasonalSeafoods === null ||
    seasonalOthers === null ? (
    '読み込み中'
  ) : (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:site_name" content="" />
        <meta property="og:image" content={`/api/ogp/${date}.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@TODO" />
      </Head>
      <div className="max-w-screen-sm mx-auto">
        <header className="p-4">
          <div className="text-center pt-24 pb-28">
            <div className="box-content h-4 pt-4 pb-1 leading-4 relative">
              <span className="absolute right-1/2 pr-0.5">{dateInfo.year}年</span>
              <span className="absolute left-1/2 pl-0.5">{dateInfo.yearJa}</span>
            </div>
            <div className="box-content h-4 py-1 leading-4 relative">
              <span className="absolute right-1/2 pr-0.5">{dateInfo.month}月</span>
              <span className="absolute left-1/2 pl-0.5">{dateInfo.monthJa}</span>
            </div>
            <div className="text-9xl font-bold py-1">{dateInfo.date}</div>
            <div className="box-content h-4 py-1 leading-4 relative">
              <span className="absolute right-1/2 pr-0.5">{dateInfo.dayJa}</span>
              <span className="absolute left-1/2 pl-0.5">{dateInfo.rokuyo}</span>
            </div>

            <div className="py-8">
              {dateInfo.schedules.map((schedule: DateInfo['schedules'][0]) => {
                return (
                  <div key={schedule.name}>
                    <div className="text-center">
                      <span className="relative">
                        <span className="absolute right-full pr-2 text-gray-400 w-max">{schedule.labelJa}</span>
                        <span>{schedule.name}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-right py-4">
            {[nextNationalholiday, nextSolarterm, nextSpecialterm].map((scheduleInfo) => {
              const scheduleDate = dayjs(scheduleInfo.date);
              return (
                <div key={scheduleInfo.label + scheduleInfo.date}>
                  <span className="text-gray-400 pr-2">次の{scheduleInfo.labelJa}</span>
                  <span>
                    {scheduleDate.format('M月D日')}({scheduleDate.diff(date, 'day')}日後) {scheduleInfo.name}
                  </span>
                </div>
              );
            })}
          </div>
        </header>

        <MonthlyCalendar
          date={date}
          monthlyCalendar={monthlyCalendar}
          onPrevMonthButtonClick={() => {
            const current = dayjs(`${currentMonth}-1`);
            const firstDayOfMonth = current.add(-1, 'month');
            const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
            services
              .fetchCalendar({
                from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
                to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
              })
              .then((monthCal: DateInfo[]) => {
                setCurrentMonth(firstDayOfMonth.format('YYYY-MM'));
                setMonthlyCalendar(monthCal);
              });
          }}
          onCurrentMonthButtonClick={() => {
            const firstDayOfMonth = dayjs(d.format('YYYY-MM-01'));
            const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
            services
              .fetchCalendar({
                from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
                to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
              })
              .then((monthCal: DateInfo[]) => {
                setCurrentMonth(firstDayOfMonth.format('YYYY-MM'));
                setMonthlyCalendar(monthCal);
              });
          }}
          onNextMonthButtonClick={() => {
            const current = dayjs(`${currentMonth}-1`);
            const firstDayOfMonth = current.add(1, 'month');
            const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');
            services
              .fetchCalendar({
                from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
                to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
              })
              .then((monthCal: DateInfo[]) => {
                setCurrentMonth(firstDayOfMonth.format('YYYY-MM'));
                setMonthlyCalendar(monthCal);
              });
          }}
        />

        <Ingredients
          seasonalVegetables={seasonalVegetables}
          seasonalFruits={seasonalFruits}
          seasonalFishes={seasonalFishes}
          seasonalSeafoods={seasonalSeafoods}
          seasonalOthers={seasonalOthers}
        />
      </div>
    </>
  );
}
