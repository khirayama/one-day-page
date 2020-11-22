import * as React from 'react';
import styled from 'styled-components';

import { ResourceScheme } from './config';
import { ResourceRow } from './Data';
import { ResourceTableRow } from './ResourceTableRow';
import { Action } from './ResourceEditor';

const Wrapper = styled.div`
  h2 {
    padding: 24px 0 12px;
  }

  th {
    text-align: left;
    color: #ccc;
    padding: 4px;
    border: solid 1px #ccc;

    &:first-of-type {
      border-left: 0;
    }

    &:last-of-type {
      border-right: 0;
    }
  }

  .new-button {
    color: #ccc;
    padding: 4px;
    background: transparent;
  }
`;

type ResourceTableProps = {
  resourceName: string;
  scheme: ResourceScheme;
  rows: ResourceRow[];
  action: Action;
};

export class ResourceTable extends React.Component<ResourceTableProps> {
  constructor(props: ResourceTableProps) {
    super(props);

    this.onAddButtonClick = this.onAddButtonClick.bind(this);
  }

  public onAddButtonClick() {
    this.props.action.create(this.props.resourceName);
  }

  public render() {
    const resourceName = this.props.resourceName;
    const scheme = this.props.scheme;

    return (
      <Wrapper>
        <h2>{scheme.label || resourceName}</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              {Object.keys(scheme.attributes).map((key) => {
                return <th key={key}>{key}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map((row: ResourceRow) => {
              return (
                <ResourceTableRow
                  key={row.id}
                  resourceName={this.props.resourceName}
                  row={row}
                  scheme={scheme}
                  action={this.props.action}
                />
              );
            })}
          </tbody>
        </table>
        <button className="new-button" onClick={this.onAddButtonClick}>
          New
        </button>
      </Wrapper>
    );
  }
}
