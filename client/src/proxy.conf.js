const PROXY_CONFIG = {
  "/api": {
    "target": "https://localhost:" + (process.env['WOLEET_ID_SERVER_API_PORT'] || 3000),
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

module.exports = PROXY_CONFIG;
