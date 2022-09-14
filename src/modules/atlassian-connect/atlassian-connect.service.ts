import { Injectable, OnModuleInit } from '@nestjs/common';
import { AddOn } from 'atlassian-connect-express';
@Injectable()
export class AtlassianConnectService implements OnModuleInit {
  /**
   * `Atlassian Connect Express` (ACE) instance
   */
  public aceInstance: AddOn;
  /**
   * Initialize the service with the `Atlassian Connect Express` (ACE) instance
   *
   * @param instance
   */
  initialization(instance: AddOn) {
    this.aceInstance = instance;
  }

  getInstance(): AddOn {
    return this.aceInstance;
  }

  onModuleInit(): any {
    this.aceInstance.authorizeJira({
      global: [],
      project: [],
    });
  }
}
