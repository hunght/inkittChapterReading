//@flow

const kMarkupPattern: RegExp = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/gi;
const kAttributePattern: RegExp = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/gi;
const kSelfClosingElements = {
  meta: true,
  img: true,
  link: true,
  input: true,
  area: true,
  br: true,
  hr: true
};
const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};
const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};
const kBlockTextElements = {
  script: true,
  noscript: true,
  style: true,
  pre: true
};

type HTMLElement = {
  +id: ?number,
  +name: ?string,
  +children: Array<Object>,
  +classNames: Array<string>,
  +rawAttrs: string
};

const createHTMLElement = (name, keyAttrs, rawAttrs): HTMLElement => ({
  name: name,
  rawAttrs: rawAttrs || '',
  children: [],
  id: keyAttrs ? keyAttrs.id : null,
  classNames: keyAttrs && keyAttrs.class ? keyAttrs.class.split(/\s+/) : [],
  type: 'tag'
});

const TextNode = (text) => ({
  data: text,
  type: 'text'
});

const appendChild = (parent: HTMLElement, node: Object) => {
  if (parent && parent.children) {
    parent.children.push(node);
  }
};

const back = (array: Array<Object>): Object => {
  return array[array.length - 1];
};

const parse = (data, options) => {
  let currentParent = createHTMLElement();
  let node: ?HTMLElement = null;
  const root = currentParent;
  const stack = [root];
  let lastTextPos = -1;

  options = options || {};

  for (let match, text; (match = kMarkupPattern.exec(data)); ) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        // if has content
        text = data.substring(
          lastTextPos,
          kMarkupPattern.lastIndex - match[0].length
        );
        appendChild(currentParent, TextNode(text));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] == '!') {
      // this is a comment
      continue;
    }
    if (options.lowerCaseType) match[2] = match[2].toLowerCase();
    if (!match[1]) {
      // not </ tags
      const attrs = {};
      for (let attMatch; (attMatch = kAttributePattern.exec(match[3])); )
        attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
      // console.log(attrs);
      if (!match[4] && kElementsClosedByOpening[currentParent.name]) {
        if (kElementsClosedByOpening[currentParent.name][match[2]]) {
          stack.pop();
          currentParent = back(stack);
        }
      }
      node = createHTMLElement(match[2], attrs, match[3]);

      appendChild(currentParent, node);
      currentParent = node;
      stack.push(currentParent);
      if (kBlockTextElements[match[2]]) {
        // a little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        if (options[match[2]]) {
          if (index == -1) {
            // there is no matching ending for the text element.
            text = data.substr(kMarkupPattern.lastIndex);
          } else {
            text = data.substring(kMarkupPattern.lastIndex, index);
          }
          if (text.length > 0) {
            appendChild(currentParent, TextNode(text));
          }
        }
        if (index == -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        } else {
          lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
          match[1] = true;
        }
      }
    }
    if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
      // </ or /> or <br> etc.
      /*eslint no-constant-condition: "off"*/
      while (true) {
        if (currentParent.name == match[2]) {
          stack.pop();
          currentParent = back(stack);
          break;
        } else {
          // Trying to close current tag, and move on
          if (kElementsClosedByClosing[currentParent.name]) {
            if (kElementsClosedByClosing[currentParent.name][match[2]]) {
              stack.pop();
              currentParent = back(stack);
              continue;
            }
          }
          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  return root.children;
};

export default parse;
