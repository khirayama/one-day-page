import * as React from 'react';
import styled from 'styled-components';

import { ResourceScheme } from './config';
import { ResourceRow } from './Data';
import { Action } from './ResourceEditor';
import { ResourceTableCell } from './ResourceTableCell';

type ResourceTableRowProps = {
  resourceName: string;
  scheme: ResourceScheme;
  row: ResourceRow;
  action: Action;
};

const StyledCell = styled.td`
  border: solid 1px #ccc;
  border-left: 0;
`;

export class ResourceTableRow extends React.Component<ResourceTableRowProps> {
  constructor(props: ResourceTableRowProps) {
    super(props);

    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
  }

  private onDeleteButtonClick() {
    this.props.action.delete(this.props.resourceName, this.props.row.id);
  }

  public render() {
    const scheme = this.props.scheme;
    const row = this.props.row;

    return (
      <tr>
        <StyledCell>
          <div onClick={this.onDeleteButtonClick}>[DELETE]</div>
        </StyledCell>
        {Object.keys(scheme.attributes).map((attributeName) => {
          const attribute = scheme.attributes[attributeName];

          return (
            <ResourceTableCell
              key={attributeName}
              resourceName={this.props.resourceName}
              attributeName={attributeName}
              attribute={attribute}
              row={row}
              action={this.props.action}
            />
          );
        })}
      </tr>
    );
  }
}
