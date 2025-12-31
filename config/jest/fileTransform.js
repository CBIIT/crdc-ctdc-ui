'use strict';

const path = require('path');

// Custom Jest transformer for file imports.

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    let code;
    if (filename.match(/\.svg$/)) {
      code = `
        module.exports = {
          __esModule: true,
          default: ${assetFilename},
          ReactComponent: (props) => ({
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: null,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          }),
        };
      `;
    } else {
      code = `module.exports = ${assetFilename};`;
    }

    // Return an object as required by Jest 28+
    return { code };
  },
};