import { Controller, Get, OnModuleInit, Render, Req } from "@nestjs/common";
import { AtlassianConnectService } from './modules/atlassian-connect/atlassian-connect.service';

@Controller()
export class AppController implements OnModuleInit{
  constructor(private readonly appService: AtlassianConnectService) {


  }


  onModuleInit(): any {
    console.log(this.appService.getInstance().name);
  }
  @Get('hello-world')
  @Render('index')
  getHelloWorld(): { message: string } {
    return { message: 'Hello world!' };
  }

  @Get('configuration')
  @Render('configuration')
  configuration(@Req() req) {
    return { id: req.query['id'], type: req.query['type'] };
  }
  @Get('web-panel')
  @Render('dropdown-web-panel')
  webPanel(@Req() req) {
    return { id: req.query['id'], mode: req.query['mode'] };
  }
  @Get('example-issue-left-panel')
  @Render('index')
  leftPanel(@Req() req) {
    return { message: 'Hello world!' };
  }
  @Get('example-issue-right-panel')
  @Render('index')
  rightPanel(@Req() req) {
    return { message: 'Hello world!' };
  }
}
