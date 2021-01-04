import axios from 'axios';

const req = axios.create({
  baseURL: 'http://localhost:4000',
});

export type ScheduleInfo = {
  date: string;
  label: string;
  labelJa: string;
  name: string;
  kana: string;
};

export type DateInfo = {
  year: string;
  yearJa: string;
  month: string;
  monthJa: string;
  monthJaKana: string;
  date: string;
  day: string;
  dayJa: string;
  dayJaKana: string;
  rokuyo: string;
  rokuyoKana: string;
  schedules: ScheduleInfo[];
};

export type IngredientInfo = {
  label: string;
  labelJa: string;
  name: string;
  kana: string;
  season: {
    month: string;
    monthJa: string;
    monthJaKana: string;
  }[];
};

export const services = {
  fetchCalander: (from: String, to: String, limit: number): Promise<DateInfo[]> => {
    return req
      .get('/calendar', {
        params: {
          from,
          to,
          limit,
        },
      })
      .then((res) => {
        return res.data;
      });
  },

  fetchDate: (date: String): Promise<DateInfo> => {
    return req.get(`/calendar/${date}`).then((res) => {
      return res.data;
    });
  },

  fetchSchedules: (from: String, to: String, limit: number, labels: string[]): Promise<ScheduleInfo[]> => {
    return req
      .get('/schedules', {
        params: {
          from,
          to,
          limit,
          labels: labels.join(','),
        },
      })
      .then((res) => {
        return res.data;
      });
  },

  fetchIngredients: (from: number, to: number, limit: number, labels: string[]): Promise<IngredientInfo[]> => {
    return req
      .get('/ingredients', {
        params: {
          from,
          to,
          limit,
          labels: labels.join(','),
        },
      })
      .then((res) => {
        return res.data;
      });
  },
};
