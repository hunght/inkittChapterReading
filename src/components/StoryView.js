// @flow

import React from 'react';
import HTMLView from '../common/htmlView';
import { Text, StyleSheet, ScrollView } from 'react-native';

const StoryView = ({ chapter }: Object) => (
  <ScrollView style={styles.container}>
    <Text
      style={{
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
      }}
    >
      {chapter.name}
    </Text>

    <HTMLView value={chapter.text} />
  </ScrollView>
);

export default StoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray'
  }
});
