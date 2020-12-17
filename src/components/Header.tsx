import * as React from 'react';

export function Header() {
  return (
    <>
      <style jsx>{`
        header {
          width: 100%;
          max-width: 630px;
          padding: 12px;
          margin: 0 auto;
        }

        .year-and-date-information {
          display: inline-block;
          vertical-align: bottom;
          line-height: 1;
          padding: 24px 12px;
        }

        .year-and-date-information .year {
          display: inline-block;
          width: 100%;
          padding: 12px 0;
        }

        .year-and-date-information .date-information {
          width: 100%;
          height: 100%;
        }

        .year-and-date-information .date-information .lunar-month-and-month {
          display: inline-block;
        }

        .year-and-date-information .date-information .lunar-month-and-month .lunar-month {
          text-align: center;
        }

        .year-and-date-information .date-information .lunar-month-and-month .month {
          text-align: center;
          font-size: 4rem;
        }

        .year-and-date-information .date-information .month-text,
        .year-and-date-information .date-information .date-text {
          display: inline-block;
        }

        .year-and-date-information .date-information .date {
          display: inline-block;
          font-size: 4rem;
        }

        .year-and-date-information .day-and-rokuyo {
        }

        .year-and-date-information .day-and-rokuyo .rokuyo {
          font-size: 1rem;
        }

        .year-and-date-information .date-information .day-and-rokuyo .day {
        }
      `}</style>
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
    </>
  );
}
