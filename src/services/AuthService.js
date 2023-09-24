import Keycloak from 'keycloak-js';

const keycloakSetting = {
    url: "http://localhost:8080",
    realm: 'StockManagement',
    clientId: 'StockManagementBackend'
  };

const authInstance = new Keycloak(keycloakSetting);

export default authInstance;
