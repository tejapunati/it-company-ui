import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appRouterProviders } from './app/app.routes';

bootstrapApplication(App, {
  providers: [appRouterProviders]
}).catch(err => console.error(err));
