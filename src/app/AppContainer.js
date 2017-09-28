import { compose, withState, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import App from './App';
import { getChapterAsync } from './actions';

export default compose(
  connect(({ app }) => ({ app }), { getChapterAsync }),
  withState('isLoading', 'setLoading', false),
  withHandlers({
    getChapterButtonPress: ({ getChapterAsync, setLoading }) => () => {
      setLoading(true);
      getChapterAsync(() => {
        setLoading(false);
      });
    }
  })
)(App);
