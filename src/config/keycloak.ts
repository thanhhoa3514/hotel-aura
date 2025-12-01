import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'hotel-realm',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'hotel-app',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
