
import * as https from 'https';

export function getAgent(url, apiPath): https.Agent {
  const isDev = process.env['WOLEET_ID_SERVER_PRODUCTION'];
  if (isDev) {
    const agentOptions = {
      host: url.host,
      path: url.pathname + apiPath,
      rejectUnauthorized: false
    };
    const agent = new https.Agent(agentOptions);
    return agent;
  } else {
    return;
  }
}
