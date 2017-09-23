import {
  compose,
  withState,
  withHandlers,
  withProps,
  defaultProps
} from 'recompose';

import { connect } from 'react-redux';

import App from './App';
import { getChapterAsync } from './actions';

export default compose(
  connect(({ app }) => ({ app }), { getChapterAsync }),
  withHandlers({
    getChapterButtonPress: ({ getChapterAsync }) => () => {
      getChapterAsync();
    }
  }),
  defaultProps({ app: null })
)(App);
