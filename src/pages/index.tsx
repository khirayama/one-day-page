import * as React from 'react';

import { ResetStyle } from '../styles/ResetStyle';

export default function IndexPage() {
  // const now = new Date().toLocaleDateString('ja-JP-u-ca-japanese', {
  //   era: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   weekday: 'short',
  // });

  return (
    <>
      <ResetStyle />
      <style jsx>{`
        background red;
      `}</style>
      <div>令和2年</div>
      <div>2020</div>
      <div>霜月</div>
      <div>11月</div>
      <div>23日</div>
      <div>赤口</div>
      <div>日</div>
      <div>勤労感謝の日</div>
      <div>大寒</div>
      <div>節分</div>
      <div>大根</div>
      <div>ブロッコリー</div>
      <div>太刀魚</div>
      <div>柿</div>
    </>
  );
}
