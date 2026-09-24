const path = require('path');

const localLoginContentRoot = process.env.LOGIN_CONTENT_DIR ||
  '/Users/tesfatsionnh/Documents/Projects/bentoBaseProject/ctdc/bento-ctdc-static-content/login';
const localLoginContentRoute = '/local-static-content/login';
const localLoginAssetRoot = path.join(localLoginContentRoot, 'assets');

function sendFile(response, filePath, contentType) {
  if (contentType) {
    response.type(contentType);
  }

  response.sendFile(filePath);
}

function sendLocalAsset(request, response) {
  const requestedPath = request.params[0] || '';
  const assetPath = path.resolve(localLoginAssetRoot, requestedPath);

  if (!assetPath.startsWith(`${localLoginAssetRoot}${path.sep}`)) {
    response.sendStatus(403);
    return;
  }

  sendFile(response, assetPath);
}

module.exports = function setupProxy(app) {
  app.get(`${localLoginContentRoute}/loginView.yaml`, (request, response) => {
    sendFile(
      response,
      path.join(localLoginContentRoot, 'loginView.yaml'),
      'text/yaml',
    );
  });

  app.get(`${localLoginContentRoute}/assets/*`, sendLocalAsset);
};
