# ModelServices - UI APP

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests
`NOTE!!!` This part is not yet complete.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Key architectural points.
App consists of 2 main lazy loaded modules.
  Model -> This module is responsible for showing models summary data. Loads only if router points to `models/` route.
  ModelDetails -> This module is responsible for showing the details of a single model. Loads only if router points to `models/:modelId` route.
Lazy loaded modules are self-contained and can have the same structure as the root app itself.

`Core` part of the app is the part that is always loaded along-side the root app. no matter. (It's mandatory part of the main app)
`Shared` part can contain shared content not specific to any self-contained lazy loaded module.
The idea of this architecture is to mimic micro-frontends architecture.    

In order to implement complex validation for delta updates angular forGroup was used with custom validators as well as form helpers.
Each component used for delta configurations are connected via the form. each child component gets parent form and extends it in a way it needs.
It brings some flexibility to easily modify the nested structure of model. Since each component knows only about its own properties and handles
only it's part.
 
   
