import dayjs from 'dayjs';
import * as React from 'react';
import styled from 'styled-components';

import { Attribute, SelectOption } from './config';
import { ResourceRow } from './Data';
import { Action } from './ResourceEditor';

const Wrapper = styled.td`
  border: solid 1px #ccc;

  &:first-of-type {
    border-left: 0;
  }

  &:last-of-type {
    border-right: 0;
  }

  select,
  input,
  .checkbox-wrapper {
    padding: 4px;
    width: 100%;
    height: 100%;

    &::placeholder {
      color: #ccc;
    }
  }

  input[type='text'] {
    text-overflow: ellipsis;
  }

  input[type='number'] {
    text-align: right;
  }

  .checkbox-wrapper {
    text-align: center;

    input[type='checkbox'] {
      border: solid 1px #ccc;
      width: 1rem;
      height: 1rem;
      line-height: 1rem;
      border-radius: 2px;

      &:checked {
        background: #aaa;
      }
    }
  }

  &.disabled {
    background: #ddd;
  }
`;

type ResourceTableCellProps = {
  resourceName: string;
  attributeName: string;
  attribute: Attribute;
  row: ResourceRow;
  action: Action;
};

type ResourceTableCellState = {
  value: string | number | boolean;
};

export class ResourceTableCell extends React.Component<ResourceTableCellProps, ResourceTableCellState> {
  constructor(props: ResourceTableCellProps) {
    super(props);

    this.state = {
      value: this.props.row[this.props.attributeName],
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  public componentDidUpdate() {
    if (this.props.attribute.type === 'select' && this.props.row[this.props.attributeName] !== this.state.value) {
      this.setState({ value: this.props.row[this.props.attributeName] });
    }
  }

  public onInputChange(event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) {
    const el = event.currentTarget;
    const value: string | number | boolean = el.type === 'checkbox' ? (el as HTMLInputElement).checked : el.value;
    this.setState({ value });
    this.props.action.update(this.props.resourceName, this.props.row.id, this.props.attributeName, value);
  }

  public render() {
    const attribute = this.props.attribute;
    let content = null;

    switch (attribute.type) {
      case 'text': {
        content = (
          <input
            type="text"
            disabled={attribute.readOnly}
            value={String(this.state.value)}
            placeholder="Text"
            onChange={this.onInputChange}
          />
        );
        break;
      }
      case 'number': {
        content = (
          <input
            type="number"
            disabled={attribute.readOnly}
            value={this.state.value as number}
            onChange={this.onInputChange}
          />
        );
        break;
      }
      case 'boolean': {
        content = (
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              disabled={attribute.readOnly}
              checked={this.state.value as boolean}
              onChange={this.onInputChange}
            />
          </div>
        );
        break;
      }
      case 'date': {
        content = (
          <input
            type="date"
            disabled={attribute.readOnly}
            value={dayjs(this.state.value as string).format('YYYY-MM-DD')}
            onChange={this.onInputChange}
          />
        );
        break;
      }
      case 'datetime': {
        content = (
          <input
            type="datetime-local"
            disabled={attribute.readOnly}
            value={dayjs(this.state.value as string).format('YYYY-MM-DDTHH:mm')}
            onChange={this.onInputChange}
          />
        );
        break;
      }
      case 'select': {
        const options = attribute.options || [];
        content = (
          <select onChange={this.onInputChange} disabled={attribute.readOnly} value={String(this.state.value)}>
            {options.map((option: SelectOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      }
    }

    return <Wrapper className={attribute.readOnly ? 'disabled' : ''}>{content}</Wrapper>;
  }
}
