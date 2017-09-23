// @flow

import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import StoryView from '../components/StoryView';
const App = ({ getChapterButtonPress, app }: Object) => (
  <View style={styles.container}>
    {app && app.response ? (
      <StoryView chapter={app.response} />
    ) : (
      <Button onPress={getChapterButtonPress} title="Get Chapter!" />
    )}
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  }
});
