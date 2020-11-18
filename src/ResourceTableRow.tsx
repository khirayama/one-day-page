import * as React from 'react';

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

export class ResourceTableRow extends React.Component<ResourceTableRowProps> {
  public render() {
    const scheme = this.props.scheme;
    const row = this.props.row;

    return (
      <tr>
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
