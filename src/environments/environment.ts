// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  URL_APP: 'http://localhost:8082/api',
  production: true
};

export const cedula = {
  // data property
  cedula:'0000000000',

  // accessor property(getter)
  get getCedula() {
      return this.cedula;
  },

  //accessor property(setter)
  set setcedula(newCedula) {
      this.cedula = newCedula;
  }
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
