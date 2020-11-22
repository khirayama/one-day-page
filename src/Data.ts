import * as uuid from 'uuid';
import dayjs from 'dayjs';
import axios from 'axios';

import { Config, SelectOption, SelectRelation } from './config';

// TODO Support unique
// TODO Support delete with relations
const req = axios.create({
  baseURL: 'http://localhost:3000',
});

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

    this.load();
  }

  public onChange(callback: Function) {
    this.callbacks.push(callback);
  }

  public toJSON(): DataType {
    return this.data;
  }

  public create(resourceName: string): void {
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
          row[key] = dayjs(now).format('YYYY-MM-DD');
          break;
        }
        case 'datetime': {
          row[key] = dayjs(now).format('YYYY-MM-DD hh:mm:ss Z');
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
    let prevValue = null;

    this.data[resourceName][attributeName] = value;
    const rows = this.data[resourceName];
    for (const row of rows) {
      if (row.id === id) {
        prevValue = row[attributeName];
        row[attributeName] = value;
        break;
      }
    }

    for (const schemeKey of Object.keys(this.config.resources)) {
      const scheme = this.config.resources[schemeKey].attributes;

      for (const attrKey of Object.keys(scheme)) {
        const attr = scheme[attrKey];
        if (
          attr.type === 'select' &&
          attr.relation &&
          attr.relation.resource === resourceName &&
          attr.relation.value === attributeName
        ) {
          for (const row of this.data[schemeKey]) {
            if (row[attr.relation.value] === prevValue) {
              row[attr.relation.value] = value;
            }
          }
        }
      }
    }

    this.save();
    this.emitChange();
  }

  public delete(resourceName: string, id: string): void {
    const rows = this.data[resourceName];
    this.data[resourceName] = rows.filter((row) => {
      return row.id !== id;
    });

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

  private load(): void {
    req.get('/resources').then((res) => {
      this.data = res.data.resources;
      this.emitChange();
    });
  }

  private save(): void {
    req.put('/resources', {
      data: this.data,
    });
  }

  private emitChange() {
    this.callbacks.forEach((callback) => {
      callback(this);
    });
  }
}
