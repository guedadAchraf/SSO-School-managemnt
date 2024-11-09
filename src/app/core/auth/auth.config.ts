import { KeycloakConfig } from 'keycloak-js';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

export const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'school-realm',
  clientId: 'school-client'
};