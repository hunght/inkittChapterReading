// @flow

import React from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';

const StoryView = ({ chapter }: Object) => (
  <View style={styles.container}>
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
    <WebView source={{ html: chapter.text }} />
  </View>
);

export default StoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray'
  }
});
