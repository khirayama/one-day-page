import * as React from 'react';

import { Header } from '../components/Header';

export default function IndexPage() {
  // const now = new Date().toLocaleDateString('ja-JP-u-ca-japanese', {
  //   era: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   weekday: 'short',
  // });

  return (
    <div className="max-w-screen-sm mx-auto">
      <Header />
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
