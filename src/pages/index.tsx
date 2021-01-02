import * as React from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { services, DateInfo } from '../services';
import { Header } from '../components/Header';

export default function IndexPage() {
  let fmt = 'YYYY-MM-DD';
  let date: string = dayjs().format(fmt);
  if (typeof window === 'object') {
    const query = queryString.parse(window.location.search);
    if (query.date && typeof query.date === 'string') {
      date = dayjs(query.date || date).format(fmt);
    }
  }
  console.log(date);

  const [dateInfo, setDateInfo] = React.useState(null);

  React.useEffect(() => {
    services.fetchDate(date).then((dInfo: DateInfo) => {
      setDateInfo(dInfo);
    });
  }, []);

  return dateInfo === null ? (
    '読み込み中'
  ) : (
    <div className="max-w-screen-sm mx-auto">
      <Header date={date} dateInfo={dateInfo} />
      <div>週間カレンダー</div>
      <div>月間カレンダー</div>
      <h2>旬の食べ物</h2>
      <div>
        <span>大根</span>
        <span>ブロッコリー</span>
        <span>太刀魚</span>
        <span>柿</span>
      </div>
    </div>
  );
}
