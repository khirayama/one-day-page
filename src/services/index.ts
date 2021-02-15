import axios from 'axios';

import { config } from '../config';

const req = axios.create({
  baseURL: config.API_URL,
});

export type ScheduleInfo = {
  date: string;
  label: string;
  labelJa: string;
  name: string;
  kana: string;
  note: string;
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
  rokuyo: {
    name: string;
    kana: string;
    note: string;
  };
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

  fetchDescription: (date: String): Promise<string> => {
    return req.get(`/descriptions/${date}`).then((res) => {
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
