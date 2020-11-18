import * as uuid from 'uuid';
import dayjs from 'dayjs';

import { Config, SelectOption, SelectRelation } from './config';

export type ResourceRow = {
  id: string;
  [key: string]: string | number | boolean;
};

export type DataType = {
  [key: string]: ResourceRow[];
};

export class Data {
  private data: DataType = {};

  private config: Config;

  private callbacks: Function[] = [];

  constructor(config: Config) {
    this.config = config;

    const tmp = window.localStorage.getItem('__data');
    this.data = tmp ? JSON.parse(tmp) : this.data;
  }

  public onChange(callback: Function) {
    this.callbacks.push(callback);
  }

  public toJSON(): DataType {
    return this.data;
  }

  public createRow(resourceName: string): void {
    if (!this.data[resourceName]) {
      this.data[resourceName] = [];
    }
    const row = { id: '' };

    const scheme = this.config.resources[resourceName];

    Object.keys(scheme.attributes).forEach((key: string) => {
      const attribute = scheme.attributes[key];
      const now = new Date();

      switch (attribute.type) {
        case 'text': {
          row[key] = attribute.auto ? uuid.v4() : attribute.default || '';
          break;
        }
        case 'number': {
          row[key] = attribute.default || 0;
          break;
        }
        case 'boolean': {
          row[key] = attribute.default || false;
          break;
        }
        case 'date': {
          row[key] = dayjs(now).format('YYYY/MM/DD');
          break;
        }
        case 'datetime': {
          row[key] = dayjs(now).format('YYYY/MM/DD/hh:mm:ss Z');
          break;
        }
        case 'select': {
          const options = attribute.options || this.getOptions(attribute.relation);
          row[key] = options[0].value;
          break;
        }
      }
    });

    this.data[resourceName].push(row);

    this.save();
    this.emitChange();
  }

  public update(resourceName: string, id: string, attributeName: string, value: string | number | boolean): void {
    this.data[resourceName][attributeName] = value;
    const rows = this.data[resourceName];
    for (const row of rows) {
      if (row.id === id) {
        row[attributeName] = value;
        break;
      }
    }

    this.save();
    this.emitChange();
  }

  public getOptions(relation: SelectRelation) {
    const rows = this.data[relation.resource];
    const options: SelectOption[] = [];

    if (rows) {
      for (const row of rows) {
        const option: SelectOption = {
          label: String(row[relation.label]),
          value: row[relation.value] as string | number,
        };
        options.push(option);
      }
    }

    return options;
  }

  private save(): void {
    window.localStorage.setItem('__data', JSON.stringify(this.data));
  }

  private clear(): void {
    window.localStorage.removeItem('__data');
  }

  private emitChange() {
    this.callbacks.forEach((callback) => {
      callback(this);
    });
  }
}