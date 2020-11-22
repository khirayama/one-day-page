/*
 * text(input text)
 * number(input number)
 * boolean(input checkbox)
 * date(input date)
 * datetime(input datetime-locale)
 * select(select)
 */
export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectRelation = {
  resource: string;
  value: string;
  label: string;
};

export type Attribute =
  | {
      type: 'text';
      default?: string;
      auto?: boolean;
      readOnly?: boolean;
      unique?: boolean;
    }
  | {
      type: 'number';
      default?: number;
      readOnly?: boolean;
      unique?: boolean;
    }
  | {
      type: 'boolean';
      default?: boolean;
      readOnly?: boolean;
      unique?: boolean;
    }
  | {
      type: 'date';
      readOnly?: boolean;
      unique?: boolean;
    }
  | {
      type: 'datetime';
      readOnly?: boolean;
      unique?: boolean;
    }
  | {
      type: 'select';
      options?: SelectOption[];
      relation?: SelectRelation;
      readOnly?: boolean;
      unique?: boolean;
    };

export type ResourceScheme = {
  label?: string;
  attributes: {
    id: {
      type: 'text';
      auto: true;
      readOnly: true;
      unique: true;
    };
    [key: string]: Attribute;
  };
};

export type Config = {
  resources: {
    [resource: string]: ResourceScheme;
  };
};

const config: Config = {
  resources: {
    item: {
      label: 'Item',
      attributes: {
        id: {
          type: 'text',
          auto: true,
          readOnly: true,
          unique: true,
        },
        key: {
          type: 'text',
          unique: true,
        },
        createdAt: {
          type: 'datetime',
          readOnly: true,
        },
        updatedAt: {
          type: 'datetime',
        },
      },
    },
    itemContent: {
      label: 'Item Content',
      attributes: {
        id: {
          type: 'text',
          auto: true,
          readOnly: true,
          unique: true,
        },
        key: {
          type: 'select',
          relation: {
            resource: 'item',
            label: 'key',
            value: 'key',
          },
        },
        locale: {
          type: 'select',
          options: [
            {
              label: '日本 - 日本語',
              value: 'ja_JP',
            },
            {
              label: 'US - English',
              value: 'en_US',
            },
          ],
        },
        name: {
          type: 'text',
        },
        age: {
          type: 'number',
        },
        admin: {
          type: 'boolean',
        },
        birthday: {
          type: 'date',
        },
      },
    },
  },
};

export default config;
