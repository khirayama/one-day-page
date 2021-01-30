import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL || 'http://localhost:4000';
const BASE_URL = 'https://radiant-badlands-93029.herokuapp.com';

const req = axios.create({
  baseURL: BASE_URL,
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
  fetchCalendar: (params: { from: String; to: String; limit?: number }): Promise<DateInfo[]> => {
    return req.get('/calendar', { params }).then((res) => {
      return res.data;
    });
  },

  fetchDate: (date: String): Promise<DateInfo> => {
    return req.get(`/calendar/${date}`).then((res) => {
      return res.data;
    });
  },

  fetchSchedules: (params: { from: String; to: String; limit?: number; labels?: string }): Promise<ScheduleInfo[]> => {
    return req.get('/schedules', { params }).then((res) => {
      return res.data;
    });
  },

  fetchIngredients: (params: {
    from: number;
    to: number;
    limit?: number;
    labels?: string;
  }): Promise<IngredientInfo[]> => {
    return req.get('/ingredients', { params }).then((res) => {
      return res.data;
    });
  },
};
