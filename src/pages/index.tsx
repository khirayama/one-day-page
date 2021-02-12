import * as React from 'react';
import dayjs from 'dayjs';
import Head from 'next/head';

import { config } from '../config';
import { services, DateInfo, ScheduleInfo, IngredientInfo } from '../services';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { Ingredients } from '../components/Ingredients';

process.env.TZ = 'Asia/Tokyo';

const fmt = 'YYYY-MM-DD';

type IndexPageProps = {
  date: string;
  description: string;
  currentMonth: string;
  dateInfo: DateInfo;
  nextNationalholiday: ScheduleInfo;
  nextSolarterm: ScheduleInfo;
  nextSpecialterm: ScheduleInfo;
  monthlyCalendar: DateInfo[];
  seasonalVegetables: IngredientInfo[];
  seasonalFruits: IngredientInfo[];
  seasonalFishes: IngredientInfo[];
  seasonalSeafoods: IngredientInfo[];
  seasonalOthers: IngredientInfo[];
};

export default function IndexPage(props: IndexPageProps) {
  const d = dayjs(props.date);

  const dateInfo = props.dateInfo;
  const nextNationalholiday = props.nextNationalholiday;
  const nextSolarterm = props.nextSolarterm;
  const nextSpecialterm = props.nextSpecialterm;
  const seasonalVegetables = props.seasonalVegetables;
  const seasonalFruits = props.seasonalFruits;
  const seasonalFishes = props.seasonalFishes;
  const seasonalSeafoods = props.seasonalSeafoods;
  const seasonalOthers = props.seasonalOthers;

  const [date] = React.useState(d.format(fmt));
  const [currentMonth, setCurrentMonth] = React.useState(props.currentMonth);
  const [monthlyCalendar, setMonthlyCalendar] = React.useState(props.monthlyCalendar);

  // TODO metaInfoを更新
  const metaInfo = {
    title: d.format(`YYYY年M月D日の日めくりカレンダー`),
    description: `${dateInfo.dayJa}、${dateInfo.rokuyo}。`,
    keywords: config.keywords,
    siteName: config.name,
    image: `${config.APP_URL}/api/ogp/${date}.png?timestamp=${Date.now().toString()}`,
    imageAlt: d.format('YYYY年M月D日の日めくりカレンダー'),
    twitter: '@TODO',
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="/api/manifest" />
        <title>{metaInfo.title}</title>
        <meta name="description" content={metaInfo.description} />
        <meta name="keyword" content={metaInfo.keywords.join(',')} />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaInfo.title} />
        <meta property="og:description" content={metaInfo.description} />
        <meta property="og:site_name" content={metaInfo.siteName} />
        <meta property="og:image" content={metaInfo.image} />
        <meta property="og:image:alt" content={metaInfo.imageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={metaInfo.twitter} />
        <meta name="twitter:title" content={metaInfo.title} />
        <meta name="twitter:description" content={metaInfo.description} />
        <meta name="twitter:image" content={metaInfo.image} />
        <meta name="twitter:image:alt" content={metaInfo.imageAlt} />
      </Head>

      <div className="max-w-screen-sm mx-auto">
        <header className="p-4">
          <div className="text-center pt-24 pb-12">
            <div className="box-content h-4 pt-4 pb-1 leading-4 relative">
              <span className="absolute right-1/2 pr-0.5">{dateInfo.year}年</span>
              <span className="absolute left-1/2 pl-0.5">{dateInfo.yearJa}</span>
            </div>
            <div className="box-content h-4 py-1 leading-4 relative">
              <span className="absolute right-1/2 pr-0.5">{dateInfo.month}月</span>
              <span className="absolute left-1/2 pl-0.5">{dateInfo.monthJa}</span>
            </div>
            <div className="text-9xl font-bold py-1 tracking-tighter">{dateInfo.date}</div>
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

          <div className="text-left">{props.description}</div>

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

export async function getServerSideProps(context: {
  query: { [key: string]: string };
}): Promise<{ props: IndexPageProps }> {
  const date = context.query.date ? dayjs(context.query.date).format(fmt) : dayjs().format(fmt);

  const d = dayjs(date);
  const frm = d.add(1, 'day').format(fmt);
  const to = d.add(12, 'month').format(fmt);

  const currentMonth = d.format('YYYY-MM');
  const firstDayOfMonth = dayjs(`${currentMonth}-1`);
  const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');

  const month = d.get('month') + 1;
  const limit = 3;

  return Promise.all([
    services.fetchDate(date),
    services.fetchDescription(date),
    services.fetchSchedules({ from: frm, to: to, limit: 0, labels: 'nationalholiday' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'solarterm' }),
    services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'specialterm' }),
    services.fetchCalendar({
      from: firstDayOfMonth.add(-1 * firstDayOfMonth.get('day'), 'day').format(fmt),
      to: lastDayOfMonth.add(6 - lastDayOfMonth.get('day'), 'day').format(fmt),
    }),
    services.fetchIngredients({ from: month, to: month, limit, labels: 'vegetable' }),
    services.fetchIngredients({ from: month, to: month, limit, labels: 'fruit' }),
    services.fetchIngredients({ from: month, to: month, limit, labels: 'fish' }),
    services.fetchIngredients({ from: month, to: month, limit, labels: 'seafood' }),
    services.fetchIngredients({ from: month, to: month, limit, labels: 'other' }),
  ]).then(
    ([
      dateInfo,
      description,
      nationalholidays,
      solarterms,
      specialterms,
      monthlyCalendar,
      seasonalVegetables,
      seasonalFruits,
      seasonalFishes,
      seasonalSeafoods,
      seasonalOthers,
    ]) => {
      return {
        props: {
          date: d.format(fmt),
          description,
          currentMonth,
          dateInfo,
          monthlyCalendar,
          nextNationalholiday: nationalholidays[0],
          nextSolarterm: solarterms[0],
          nextSpecialterm: specialterms[0],
          seasonalVegetables,
          seasonalFruits,
          seasonalFishes,
          seasonalSeafoods,
          seasonalOthers,
        },
      };
    },
  );
}
