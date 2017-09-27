//@flow
import React from 'react';

import htmlToElement from './htmlToElement';
import { Platform, StyleSheet, View } from 'react-native';
import { compose, withState, defaultProps, lifecycle } from 'recompose';

const boldStyle = { fontWeight: '500' };
const italicStyle = { fontStyle: 'italic' };
const underlineStyle = { textDecorationLine: 'underline' };
const codeStyle = { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' };

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  u: underlineStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF'
  },
  h1: { fontWeight: '500', fontSize: 36 },
  h2: { fontWeight: '500', fontSize: 30 },
  h3: { fontWeight: '500', fontSize: 24 },
  h4: { fontWeight: '500', fontSize: 18 },
  h5: { fontWeight: '500', fontSize: 14 },
  h6: { fontWeight: '500', fontSize: 12 }
});

const htmlToElementOptKeys = [
  'lineBreak',
  'paragraphBreak',
  'bullet',
  'TextComponent',
  'textComponentProps',
  'NodeComponent',
  'nodeComponentProps'
];

const HtmlView = ({ RootComponent, style, element, rootComponentProps }) => (
  <RootComponent {...rootComponentProps} style={style}>
    {element}
  </RootComponent>
);

export default compose(
  withState('isElement', 'setElement', null),
  defaultProps({
    addLineBreaks: true,
    onError: console.error.bind(console),
    RootComponent: View
  }),
  lifecycle({
    componentDidMount() {
      this.mounted = true;
      this.startHtmlRender(this.props.value);
    },

    componentWillUnmount() {
      this.mounted = false;
    },

    startHtmlRender(value, style) {
      const { addLineBreaks, stylesheet, renderNode, onError } = this.props;

      if (!value) {
        this.setState({ element: null });
      }

      const opts = {
        addLineBreaks,

        styles: { ...baseStyles, ...stylesheet, ...style },
        customRenderer: renderNode
      };

      htmlToElementOptKeys.forEach((key) => {
        if (typeof this.props[key] !== 'undefined') {
          opts[key] = this.props[key];
        }
      });

      htmlToElement(value, opts, (err, element) => {
        if (err) {
          onError(err);
        }

        if (this.mounted) {
          this.setState({ element });
        }
      });
    }
  })
)(HtmlView);
