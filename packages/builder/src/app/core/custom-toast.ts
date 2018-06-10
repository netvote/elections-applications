import {ToastOptions} from 'ng2-toastr';

export class CustomToastOption extends ToastOptions {
    showCloseButton = true;
    dismiss = 'auto';
    positionClass= 'toast-top-center';
    maxShown = 1;
}

