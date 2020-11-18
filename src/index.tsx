import * as React from 'react';
import * as ReactDOM from 'react-dom';

import config from './config';
import { ResourceEditor } from './ResourceEditor';
import { ResetStyle } from './ResetStyle';
import { Data } from './Data';

const data = new Data(config);

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <>
      <ResetStyle />
      <ResourceEditor config={config} data={data} />
    </>,
    window.document.querySelector('#root'),
  );
});
