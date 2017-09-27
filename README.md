# inkittChapterReading

Brief for app structure:

- htmlParser.js is tool for parsing html from HTML string to Abstract Syntax Tree
- htmlToElement.js handle generating Element by loop through all the node of AST tree
- HTMLView.js is for dealing with StyleSheet, (basically mapping from <i> <b>,... to stylesheet) ,and it process style option.
