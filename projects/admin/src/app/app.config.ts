import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: '/auth',
        realm: 'school-realm',
        clientId: 'admin-client'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: true,
        checkLoginIframeInterval: 25,
        pkceMethod: 'S256',
        enableLogging: true
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: [
        '/assets',
        '/ws',
        '/sockjs-node',
        '/ng-cli-ws'
      ],
      loadUserProfileAtStartUp: true,
      bearerPrefix: 'Bearer'
    }).catch(error => {
      console.error('Keycloak init error:', error);
      return false;
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      (req, next) => {
        const modified = req.clone({
          setHeaders: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        return next(modified);
      }
    ])),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
}; 