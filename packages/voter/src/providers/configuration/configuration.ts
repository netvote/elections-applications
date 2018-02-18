import {Injectable} from '@angular/core';

declare const webpackGlobalVars: any;

@Injectable()
export class ConfigurationProvider {
  public base = webpackGlobalVars.nv_config;
}
