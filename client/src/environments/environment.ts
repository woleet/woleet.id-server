// The build system defaults to this environment, but if you do
// `ng build|serve --prod` then `environment.prod.ts` will be used instead.

const { protocol, hostname } = window.location;

const port = 3000;

export const environment = {
  version: '0.3.1',
  production: false,
  serverURL: `${protocol}//${hostname}:${port}`
};
