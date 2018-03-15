import {Injectable} from '@angular/core';
import {ErrorHandler} from '@angular/core';

@Injectable()
export class Issuehandler implements ErrorHandler {

  constructor() {
  }

  handleError(error:any) : void {
    const err = error.originalError || error;
    console.log("NV: Err: ", JSON.stringify(err));
  }

}
