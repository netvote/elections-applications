// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseOrig: {
    apiKey: 'AIzaSyBYpXBb6kk2L1GjZNVR4l4GH1uqmPnTNh8',
    authDomain: 'netvote1.firebaseapp.com',
    databaseURL: 'https://netvote1.firebaseio.com',
    projectId: 'netvote1',
    storageBucket: 'netvote1.appspot.com',
    messagingSenderId: '465732821727'
  },
  firebase: {
    apiKey: "AIzaSyBJVzv2pjIe4fblPY-AKyqngpk0rTFcNwE",
    authDomain: "metaauth.firebaseapp.com",
    databaseURL: "https://metaauth.firebaseio.com",
    projectId: "metaauth",
    storageBucket: "metaauth.appspot.com",
    messagingSenderId: "881515123506"
  }
};
