import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as nocache from 'nocache';
import { AppModule } from './app.module';
import * as atlassianConnect from 'atlassian-connect-express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AtlassianConnectService } from './modules/atlassian-connect/atlassian-connect.service';
import { join } from 'path';

async function bootstrap() {
  const expressAdapter = new ExpressAdapter();

  // Atlassian security policy requirements
  // http://go.atlassian.com/security-requirements-for-cloud-apps
  // HSTS must be enabled with a minimum age of at least one year
  expressAdapter.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: false,
    }),
  );
  expressAdapter.use(
    helmet.referrerPolicy({
      policy: ['origin'],
    }),
  );

  expressAdapter.use(express.json());
  expressAdapter.use(express.urlencoded({ extended: false }));
  expressAdapter.use(cookieParser());

  // Gzip responses when appropriate
  expressAdapter.use(compression());

  // Atlassian security policy requirements
  // http://go.atlassian.com/security-requirements-for-cloud-apps
  expressAdapter.use(nocache());

  const aceInstance = atlassianConnect(expressAdapter as any);
  // Include atlassian-connect-express middleware
  expressAdapter.use(aceInstance.middleware());

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    expressAdapter,
  );
  // retrieve the express server
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance();

  // See config.json
  const port = aceInstance.config.port();
  app.set('port', port);

  const devEnv = expressApp.get('env') === 'development';

  app.use(morgan(devEnv ? 'dev' : 'combined'));

  // Configure Handlebars
  app.setBaseViewsDir(
    '/Users/admin/Documents/web/atlassian-connect-nestjs/src/views',
  );
  console.log(path.join(__dirname, 'views'));
  app.setViewEngine('hbs');

  // Show nicer errors in dev mode
  //if (devEnv) app.use(errorHandler());

  // Initialize the injectable NestJS Service that lets you access the instance of `atlassian-connect-express`
  const atlassianConnectService = app.get(AtlassianConnectService);
  atlassianConnectService.initialization(aceInstance);

  // Boot the HTTP server
  await app.listen(port, () => {
    console.log('App server running on port' + port);
    // Enables auto registration/de-registration of app into a host in dev mode
    if (devEnv) aceInstance.register();
  });
}
bootstrap();
