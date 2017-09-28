// @flow

import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Platform
} from 'react-native';
import StoryView from '../components/StoryView';

const App = ({ getChapterButtonPress, isLoading, app }: Object) => (
  <View style={styles.container}>
    {app && app.response ? (
      <StoryView chapter={app.response} />
    ) : (
      <Button onPress={getChapterButtonPress} title="Get Chapter!" />
    )}

    {isLoading && (
      <ActivityIndicator
        animating={isLoading}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        size="large"
      />
    )}
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0
  }
});
