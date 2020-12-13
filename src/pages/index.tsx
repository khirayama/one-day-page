import * as React from 'react';

import { ResetStyle } from '../styles/ResetStyle';
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
    <>
      <ResetStyle />
      <style jsx>{`
        background red;

        .year {
          background: blue;
        }
      `}</style>
      <Header />
      <div>
        <span>大根</span>
        <span>ブロッコリー</span>
        <span>太刀魚</span>
        <span>柿</span>
      </div>
    </>
  );
}
