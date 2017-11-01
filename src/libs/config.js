// @flow

let config = {};

config = {
  authApi: process.env.authApi,
  sync_api: process.env.sync_api,
  database: process.env.database,
  local_db: process.env.local_db,
  auth0_api: `https://${process.env.auth0_domain}`,
  auth0_client_id: process.env.auth0_client_id,
  auth0_domain: process.env.auth0_domain,
};

export default config;
