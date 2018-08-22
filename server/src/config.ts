const defaultPort = 3000;

export const ports = {
  signature: defaultPort,
  identity: 4000,
  api: defaultPort
}

export const db = {
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'wid',
  username: process.env.POSTGRES_USER || 'pguser',
  password: process.env.POSTGRES_PASSWORD || 'pass'
}
