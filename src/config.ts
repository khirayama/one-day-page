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
    }
  | {
      type: 'number';
      default?: number;
    }
  | {
      type: 'boolean';
      default?: boolean;
    }
  | {
      type: 'date';
    }
  | {
      type: 'datetime';
    }
  | {
      type: 'select';
      options?: SelectOption[];
      relation?: SelectRelation;
    };

export type ResourceScheme = {
  label?: string;
  attributes: {
    id: {
      type: 'text';
      auto: true;
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
        },
        key: {
          type: 'text',
        },
        createdAt: {
          type: 'datetime',
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
