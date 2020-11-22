import * as React from 'react';
import styled from 'styled-components';

import { Config, SelectRelation } from './config';
import { Data, DataType } from './Data';
import { ResourceTable } from './ResourceTable';

const Wrapper = styled.div`
  padding: 12px;
`;

export type Action = {
  [key: string]: Function;
};

type ResourceEditorProps = {
  config: Config;
  data: Data;
};

export class ResourceEditor extends React.Component<ResourceEditorProps, DataType> {
  public action: Action = {};

  constructor(props: ResourceEditorProps) {
    super(props);

    this.state = this.props.data.toJSON();
    this.action = {
      create: this.props.data.create.bind(this.props.data),
      update: this.props.data.update.bind(this.props.data),
      delete: this.props.data.delete.bind(this.props.data),
    };
  }

  public componentDidMount() {
    this.props.data.onChange(() => {
      this.setState(this.props.data.toJSON());
    });
  }

  public render() {
    const normalizedSchemes = this.normalizeResourceScheme();

    return Object.keys(normalizedSchemes).map((resourceName: string) => {
      const scheme = normalizedSchemes[resourceName];
      return (
        <Wrapper key={resourceName}>
          <ResourceTable
            resourceName={resourceName}
            scheme={scheme}
            rows={this.state[resourceName] || []}
            action={this.action}
          />
        </Wrapper>
      );
    });
  }

  private normalizeResourceScheme() {
    const normalizedResourceSchemes = {};
    const resources = this.props.config.resources;

    Object.keys(resources).forEach((resourceName: string) => {
      const resourceScheme = resources[resourceName];
      const normalizedResourceScheme = {
        label: resourceScheme.label,
        attributes: {},
      };

      Object.keys(resourceScheme.attributes).forEach((attributeName: string) => {
        const attribute = resourceScheme.attributes[attributeName];
        switch (attribute.type) {
          case 'select': {
            if (attribute.relation) {
              const options = this.props.data.getOptions(attribute.relation as SelectRelation);

              normalizedResourceScheme.attributes[attributeName] = {
                type: 'select',
                options,
              };
            } else {
              normalizedResourceScheme.attributes[attributeName] = attribute;
            }
            break;
          }
          default: {
            normalizedResourceScheme.attributes[attributeName] = attribute;
            break;
          }
        }
      });
      normalizedResourceSchemes[resourceName] = normalizedResourceScheme;
    });

    return normalizedResourceSchemes;
  }
}
