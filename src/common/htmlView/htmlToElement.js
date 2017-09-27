// @flow
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import htmlParser from './htmlParser';

const defaultOpts = {
  lineBreak: '\n',
  paragraphBreak: '\n\n',
  bullet: '\u2022 ',
  TextComponent: Text,
  textComponentProps: null,
  NodeComponent: Text,
  nodeComponentProps: null
};

const htmlToElement = (rawHtml, customOpts = {}, done) => {
  const opts = {
    ...defaultOpts,
    ...customOpts
  };

  const inheritedStyle = (parent) => {
    if (!parent) return null;
    const style = StyleSheet.flatten(opts.styles[parent.name]) || {};
    const parentStyle = inheritedStyle(parent.parent) || {};
    return { ...parentStyle, ...style };
  };

  const domToElement = (dom, parent) => {
    if (!dom) return null;

    const renderNode = opts.customRenderer;

    return dom.map((node, index, list) => {
      if (renderNode) {
        const rendered = renderNode(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      const { TextComponent } = opts;

      if (node.type === 'text') {
        const defaultStyle = opts.textComponentProps
          ? opts.textComponentProps.style
          : null;
        const customStyle = inheritedStyle(parent);

        return (
          <TextComponent
            {...opts.textComponentProps}
            key={index}
            style={[defaultStyle, customStyle]}
          >
            {node.data}
          </TextComponent>
        );
      }

      if (node.type === 'tag') {
        let linebreakBefore = null;
        let linebreakAfter = null;
        if (opts.addLineBreaks) {
          switch (node.name) {
            case 'pre':
              linebreakBefore = opts.lineBreak;
              break;
            case 'p':
              if (index < list.length - 1) {
                linebreakAfter = opts.paragraphBreak;
              }
              break;
            case 'br':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
              linebreakAfter = opts.lineBreak;
              break;
          }
        }

        const { NodeComponent, styles } = opts;

        return (
          <NodeComponent
            {...opts.nodeComponentProps}
            key={index}
            style={!node.parent ? styles[node.name] : null}
          >
            {linebreakBefore}
            {domToElement(node.children, node)}
            {linebreakAfter}
          </NodeComponent>
        );
      }
    });
  };

  done(null, domToElement(htmlParser(rawHtml)));
};
export default htmlToElement;
