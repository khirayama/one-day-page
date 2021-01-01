import * as React from 'react';

import { Header } from '../components/Header';
import { services, DateInfo } from '../services';

export default function IndexPage() {
  const now = new Date();
  const [dateInfo, setDateInfo] = React.useState(null);

  React.useEffect(() => {
    services.fetchDate(now).then((dInfo: DateInfo) => {
      setDateInfo(dInfo);
    });
  }, []);

  return dateInfo === null ? (
    '読み込み中'
  ) : (
    <div className="max-w-screen-sm mx-auto">
      <Header dateInfo={dateInfo} />
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
