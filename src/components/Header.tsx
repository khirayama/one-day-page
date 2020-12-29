import * as React from 'react';

export function Header() {
  return (
    <header>
      <div className="year-and-date-information">
        <div className="year">2020年(令和2年)</div>
        <div className="date-information">
          <div className="lunar-month-and-month">
            <div className="lunar-month">霜月</div>
            <div className="month">11</div>
          </div>
          <div className="month-text">月</div>
          <div className="date">23</div>
          <div className="date-text">日</div>
        </div>
        <div className="day-and-rokuyo">
          <div className="day">日曜日</div>
          <div className="rokuyo">赤口</div>
        </div>
      </div>

      <div>
        <div>勤労感謝の日</div>
        <div>大寒</div>
        <div>節分</div>
      </div>
    </header>
  );
}
