import * as uuid from 'uuid';
import dayjs from 'dayjs';
import axios from 'axios';

import { Config, ResourceScheme, SelectOption, SelectRelation } from './config';

type CommandOptions = {
  skipSave: boolean;
};

// TODO Support delete with relations
const req = axios.create({
  baseURL: 'http://localhost:3000',
});

export type ValidationError = {
  [resourceName: string]: {
    [id: string]: {
      attributeName: string;
      message: string;
    };
  };
};

export type ValidationResult =
  | { isValid: true; resourceName: string; id: string }
  | { isValid: false; resourceName: string; id: string; attributeName: string; message: string };

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

  private errors: ValidationError = {};

  private callbacks: Function[] = [];

  private readyCallback: Function[] = [];

  constructor(config: Config) {
    this.config = config;

    this.load();
  }

  public onChange(callback: Function) {
    this.callbacks.push(callback);
  }

  public toJSON(): { errors: ValidationError; resources: DataType } {
    return {
      errors: this.errors,
      resources: this.data,
    };
  }

  public ready(callback: Function) {
    this.readyCallback.push(callback);
  }

  public create(resourceName: string, options?: CommandOptions) {
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

    const result = this.valid(resourceName, scheme, row);
    const isValid = this.registerError(result);
    if (isValid) {
      if (!options || (options && !options.skipSave)) {
        this.save();
      }
    }
    this.emitChange();

    return row;
  }

  public update(
    resourceName: string,
    id: string,
    attributeName: string,
    value: string | number | boolean,
    options?: CommandOptions,
  ): void {
    let prevValue = null;

    this.data[resourceName][attributeName] = value;
    const rows = this.data[resourceName];
    for (const row of rows) {
      if (row.id === id) {
        const result = this.valid(resourceName, this.config.resources[resourceName], {
          ...row,
          [attributeName]: value,
        });
        const isValid = this.registerError(result);
        if (isValid) {
          prevValue = row[attributeName];
          row[attributeName] = value;
        }
        break;
      }
    }

    const hasError = !!Object.keys(this.data)
      .map((resourceName) => {
        const errors = this.errors[resourceName] || {};
        return !!Object.keys(errors).length;
      })
      .filter((i) => i).length;
    if (!hasError) {
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

      if (!options || (options && !options.skipSave)) {
        this.save();
      }
    } else {
      console.log('unvalid');
    }
    this.emitChange();
  }

  public delete(resourceName: string, id: string, options?: CommandOptions): void {
    const rows = this.data[resourceName];
    this.data[resourceName] = rows.filter((row) => {
      return row.id !== id;
    });

    if (!options || (options && !options.skipSave)) {
      this.save();
    }
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

      for (let callback of this.readyCallback) {
        callback(this);
      }
    });
  }

  public forceSave(): void {
    this.save();
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

  private valid(resourceName: string, scheme: ResourceScheme, row: ResourceRow): ValidationResult {
    const attributeNames = Object.keys(scheme.attributes);

    // unique
    for (const attributeName of attributeNames) {
      const attribute = scheme.attributes[attributeName];

      if (attribute.unique) {
        const rows = this.data[resourceName];
        for (const r of rows) {
          if (r[attributeName] === row[attributeName] && r.id !== row.id) {
            return {
              isValid: false,
              resourceName,
              id: row.id,
              attributeName,
              message: 'ununique value',
            };
          }
        }
      }
    }
    return {
      isValid: true,
      id: row.id,
      resourceName,
    };
  }

  private registerError(result: ValidationResult) {
    const resourceName = result.resourceName;

    if (this.errors[resourceName] === undefined) {
      this.errors[resourceName] = {};
    }

    if (result.isValid === false) {
      this.errors[resourceName][result.id] = {
        attributeName: result.attributeName,
        message: result.message,
      };
    } else {
      if (this.errors[resourceName]) {
        delete this.errors[resourceName][result.id];
      }
    }
    return result.isValid;
  }
}
