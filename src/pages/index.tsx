import * as React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import Head from 'next/head';

import { config } from '../config';
import { services, DateInfo, ScheduleInfo, IngredientInfo } from '../services';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { Ingredients } from '../components/Ingredients';

process.env.TZ = 'Asia/Tokyo';

const fmt = 'YYYY-MM-DD';

function generateDescription(dateInfo: DateInfo, nextSchedules: ScheduleInfo[]): string {
  let description = `${dateInfo.rokuyo.name}(${dateInfo.rokuyo.kana})は、${dateInfo.rokuyo.note}`;
  const nationalholiday =
    dateInfo.schedules.filter((schedule) => schedule && schedule.label === 'nationalholiday')[0] ||
    nextSchedules.filter((schedule) => schedule && schedule.label === 'nationalholiday')[0] ||
    null;
  const solarterm =
    dateInfo.schedules.filter((schedule) => schedule && schedule.label === 'solarterm')[0] ||
    nextSchedules.filter((schedule) => schedule && schedule.label === 'solarterm')[0] ||
    null;
  const specialterm =
    dateInfo.schedules.filter((schedule) => schedule && schedule.label === 'specialterm')[0] ||
    nextSchedules.filter((schedule) => schedule && schedule.label === 'specialterm')[0] ||
    null;

  [nationalholiday, solarterm, specialterm]
    .filter((schedule: ScheduleInfo | null) => !!schedule)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((schedule: ScheduleInfo) => {
      const diff = dayjs(schedule.date).diff(dayjs(`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}`), 'day');
      if (diff === 0) {
        description += `本日の${schedule.name}(${schedule.kana})は、`;
      } else if (diff === 1) {
        description += `明日の${schedule.name}(${schedule.kana})は、`;
      } else if (diff === 2) {
        description += `明後日の${schedule.name}(${schedule.kana})は、`;
      } else {
        description += `${diff}日後の${schedule.name}(${schedule.kana})は、`;
      }

      description += `${schedule.note}`;
    });
  return description;
}

type IndexPageProps = {
  date: string;
  currentMonth: string;
  dateInfo: DateInfo;
  nextNationalholiday: ScheduleInfo | null;
  nextSolarterm: ScheduleInfo | null;
  nextSpecialterm: ScheduleInfo | null;
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

  const description = generateDescription(dateInfo, [nextNationalholiday, nextSolarterm, nextSpecialterm]);

  // TODO metaInfoを更新
  const metaInfo = {
    title: d.format(`YYYY年M月D日(${dateInfo.dayJa})`),
    description,
    keywords: config.keywords,
    siteName: config.name,
    image: `${config.APP_URL}/api/ogp/${date}.png?timestamp=${Date.now().toString()}`,
    imageAlt: d.format(`YYYY年M月D日(${dateInfo.dayJa})`),
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
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.TRACKING_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.TRACKING_ID}');`,
          }}
        />
        <script
          data-ad-client="ca-pub-1858903845445485"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        ></script>
      </Head>

      <div className="max-w-screen-sm mx-auto text-gray-600">
        <div className="aspect-w-1 aspect-h-1">
          <div>
            <div className="relative w-full h-full">
              {dateInfo.schedules.filter((schedule) => schedule.label === 'nationalholiday').length !== 0 ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-200 w-48 h-48 rounded-full" />
              ) : null}

              <div className="box-content leading-4 absolute bottom-1/2 w-full pb-28">
                <span className="absolute right-1/2 pr-0.5">{dateInfo.year}年</span>
                <span className="absolute left-1/2 pl-0.5">{dateInfo.yearJa}</span>
              </div>

              <div className="box-content leading-8 absolute bottom-1/2 w-full pb-24">
                <span className="absolute right-1/2 pr-0.5">{dateInfo.month}月</span>
                <span className="absolute left-1/2 pl-0.5">{dateInfo.monthJa}</span>
              </div>

              <div className="text-9xl font-bold tracking-tighter absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pr-4 text-gray-800">
                {dateInfo.date}
              </div>

              <div className="box-content leading-4 absolute top-1/2 w-full pt-16">
                <span
                  className={classNames(
                    'absolute right-1/2 pr-0.5',
                    { 'text-blue-400': dateInfo.dayJa === '土曜日' },
                    { 'text-red-400': dateInfo.dayJa === '日曜日' },
                  )}
                >
                  {dateInfo.dayJa.replace('曜日', '曜')}
                </span>
                <span className="absolute left-1/2 pl-0.5">{dateInfo.rokuyo.name}</span>
              </div>

              <div className="box-content leading-6 absolute top-1/2 w-full pt-24">
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
          </div>
        </div>

        <div className="text-justify px-8 leading-7 text-gray-600 whitespace-pre-wrap">{description}</div>

        <div className="text-right p-8">
          {[nextNationalholiday, nextSolarterm, nextSpecialterm]
            .filter((a) => !!a)
            .map((scheduleInfo) => {
              const scheduleDate = dayjs(scheduleInfo.date);
              const diff = scheduleDate.diff(date, 'day');
              const diffText = diff === 2 ? '(明後日)' : diff === 1 ? '(明日)' : `(${diff}日後)`;

              return (
                <div key={scheduleInfo.label + scheduleInfo.date}>
                  <span className="text-gray-400 pr-2">次の{scheduleInfo.labelJa}</span>
                  <span>
                    {scheduleDate.format('M月D日')}
                    {diffText} {scheduleInfo.name}
                  </span>
                </div>
              );
            })}
        </div>

        <div className="py-4 px-8">
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
        </div>

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
  // const to = d.add(12, 'month').format(fmt);
  const to = config.AVAILABEL_DATE;

  const currentMonth = d.format('YYYY-MM');
  const firstDayOfMonth = dayjs(`${currentMonth}-1`);
  const lastDayOfMonth = firstDayOfMonth.add(1, 'month').add(-1, 'day');

  const month = d.get('month') + 1;
  const limit = 3;

  return Promise.all(
    [
      services.fetchDate(date),
      services.fetchSchedules({ from: frm, to: to, limit: 1, labels: 'nationalholiday' }),
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
    ] as [any, any, any, any, any, any, any, any, any, any] /* TODO */,
  ).then(
    ([
      dateInfo,
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
      const props = {
        date: d.format(fmt),
        currentMonth,
        dateInfo,
        monthlyCalendar,
        nextNationalholiday: nationalholidays[0] || null,
        nextSolarterm: solarterms[0] || null,
        nextSpecialterm: specialterms[0] || null,
        seasonalVegetables,
        seasonalFruits,
        seasonalFishes,
        seasonalSeafoods,
        seasonalOthers,
      };
      return { props };
    },
  );
}
