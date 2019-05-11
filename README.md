# @bryandbor/metaphor

> Store metadata for analytics

Metaphor is built for storing/accessing metadata which can be used within analytics. This metadata is commonly not used within your application for purposes such as rendering. Since metadata can change over time, Metaphor provides a simple API for adding, or updating, metadata with a simple Redux action.

[![NPM](https://img.shields.io/npm/v/@bryandbor/metaphor.svg)](https://www.npmjs.com/package/@bryandbor/metaphor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Package Size](https://badgen.net/packagephobia/publish/@bryandbor/metaphor)](https://packagephobia.now.sh/result?p=%40bryandbor%2Fmetaphor) [![Weekly downloads](https://badgen.net/npm/dw/@bryandbor/metaphor)](https://www.npmjs.com/package/@bryandbor/metaphor)

## Install

```bash
npm install --save @bryandbor/metaphor
```

## Usage

Add Metaphor's reducer to the Redux state
```js
// reducers/index.js
import {combineReducers} from 'redux';
import {reducer as metaphorReducer} from '@bryandbor/metaphor';
// ...
export default combineReducers({
  meta: metaphorReducer,
  // Other reducers
});
```

Add metadata whenever appropriate
```jsx
// The following libraries are only used for demonstration, they are not required to use Metaphor
import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v4';
import moment from 'moment';
import fetch from 'isomorphic-fetch';

import {addMeta as addMetaAction, getMetaValue, createMetaValueSelector} from '@bryandbor/metaphor';
// ...
export class RootComponent {
  componentDidMount() {
    const {experiments, addMeta} = this.props;
    addMeta({
      session: {
        id: uuid(),
        start: moment.utc(),
      },
      experiments: someFunctionWhichDeterminesExperimentsInitialState(),
    });
  }
  // Used to change the status of an experiment in metadata
  handleExperimentChange = (experimentId, newValue) => {
    const {addMeta} = this.props;
    addMeta({
      experiments: {
        [experimentId]: newValue,
      },
    });
  };
  trackButtonClick = (buttonId) => {
    const {sessionId, experiments} = this.props;
    fetch('/events', {
      method: 'POST',
      body: JSON.stringify({
        type: 'click',
        id: buttonId,
        sessionId,
        meta: {
          experiments,
        },
      }),
    });
  };
  render() {
    // ...
  }
}
// Selectors can be created to DRY the code:
export const getSessionId = createMetaValueSelector('session.id', null);

export const mapStateToProps = state => ({
  experiments: getMetaValue(state, 'experiments', {}),
  sessionId: getSessionId(state),
});
const mapDispatchToProps = {
  addMeta: addMetaAction,
};
const hoc = connect(mapStateToProps, mapDispatchToProps);
export default hoc(RootComponent);
```

The example shown above includes usage of many libraries that are not required to use Metaphor. It is purely a demonstration of how metadata can be stored/accessed from the Redux store.

## License

MIT © [bryandbor](https://github.com/bryandbor)
