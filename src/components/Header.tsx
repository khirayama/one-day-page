import * as React from 'react';

export function Header() {
  return (
    <header className="py-4 px-2">
      <div>
        <div>2020年(令和2年)</div>
        <div>霜月</div>
        <div>
          <div className="inline-block">11</div>
          <div className="inline-block">月</div>
          <div className="inline-block">23</div>
          <div className="inline-block">日</div>
        </div>
        <div>
          <div>日曜日</div>
          <div>赤口</div>
        </div>
      </div>

      <div>
        <div>勤労感謝の日</div>
        <div>次の祝日は11月23日 日曜日 勤労感謝の日(10日後)</div>
        <div>大寒</div>
        <div>次の二十四節気は11月23日 日曜日 小寒(10日後)</div>
        <div>節分</div>
        <div>次の雑期は11月23日 日曜日 小寒(10日後)</div>
      </div>
    </header>
  );
}
