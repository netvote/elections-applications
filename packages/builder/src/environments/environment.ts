// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCYwUBgD-jq6bgbKqvLi8zjtMbRLmStN4I",
    authDomain: "netvote2.firebaseapp.com",
    databaseURL: "https://netvote2.firebaseio.com",
    projectId: "netvote2",
    storageBucket: "netvote2.appspot.com",
    messagingSenderId: "861498385067"
  }
}

// export const environment = {
//   production: false,
//   firebase: {
//     apiKey: 'AIzaSyBYpXBb6kk2L1GjZNVR4l4GH1uqmPnTNh8',
//     authDomain: 'netvote1.firebaseapp.com',
//     databaseURL: 'https://netvote1.firebaseio.com',
//     projectId: 'netvote1',
//     storageBucket: 'netvote1.appspot.com',
//     messagingSenderId: '465732821727'
//   }
// }
