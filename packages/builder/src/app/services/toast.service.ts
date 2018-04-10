import {Injectable} from '@angular/core';
import {ToastsManager, Toast} from 'ng2-toastr/ng2-toastr';

@Injectable()
export class ToastService {

  constructor(public toastr: ToastsManager) {
  }

  // Toast options: https://github.com/PointInside/ng2-toastr#toastoptions-configurations

  error(message: string, title?: string, options?: object) {
    this.toastr.error(message, title, options);
  }

  info(message: string, title?: string, options?: object) {
    this.toastr.info(message, title, options);
  }

  success(message: string, title?: string, options?: object) {
    this.toastr.success(message, title, options);
  }

  warning(message: string, title?: string, options?: object) {
    this.toastr.warning(message, title, options);
  }

}
