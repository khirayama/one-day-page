import axios from 'axios';

const req = axios.create({
  baseURL: 'http://localhost:4000',
});

export type DateScheduleInfo = {
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
  schedules: {
    label: string;
    labelJa: string;
    name: string;
    kana: string;
  }[];
  nextSchedules: {
    nationalholiday: DateScheduleInfo;
    solarterm: DateScheduleInfo;
    specialterm: DateScheduleInfo;
  };
  prevSchedules: {
    nationalholiday: DateScheduleInfo;
    solarterm: DateScheduleInfo;
    specialterm: DateScheduleInfo;
  };
};

export type ScheduleInfo = {
  schedules: {
    type: 'nationalholiday' | 'solarterm' | 'specialterm';
    date: string;
    name: string;
  }[];
  prev: {
    nationalholiday: {
      date: string;
      name: string;
    };
    solarterm: {
      date: string;
      name: string;
    };
    specialterm: {
      date: string;
      name: string;
    };
  };
  next: {
    nationalholiday: {
      date: string;
      name: string;
    };
    solarterm: {
      date: string;
      name: string;
    };
    specialterm: {
      date: string;
      name: string;
    };
  };
};

export const services = {
  fetchDate: (date: String): Promise<DateInfo> => {
    return req.get(`/dates/${date}`).then((res) => {
      return res.data;
    });
  },

  fetchCalander: async (from: Date, to: Date): Promise<DateInfo[]> => {
    console.log(from.toString(), to.toString());
    // TODO
    return [];
  },

  fetchSchedule: async (from: Date, to: Date): Promise<ScheduleInfo> => {
    console.log(from.toString(), to.toString());
    // TODO
    return {
      schedules: [],
      prev: {
        nationalholiday: {
          name: '',
          date: '',
        },
        solarterm: {
          name: '',
          date: '',
        },
        specialterm: {
          name: '',
          date: '',
        },
      },
      next: {
        nationalholiday: {
          name: '',
          date: '',
        },
        solarterm: {
          name: '',
          date: '',
        },
        specialterm: {
          name: '',
          date: '',
        },
      },
    };
  },
};
