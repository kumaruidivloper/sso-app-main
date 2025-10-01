# AngularFormsTutoriall

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```
## Create the App
ng new stepper-reactive-signal-form --no-standalone --routing --style=scss
npx -p @angular/cli@17 ng new stepper-reactive-signal-form --no-standalone --routing --style=scss

## Run the server
ng serve --host 0.0.0.0 --port 4200


## Building

ng build --configuration production --base-href /Flight-Luggage-Tracker-App/

cp -r dist/Flight-Luggage-Tracker-App/browser/* dist/Flight-Luggage-Tracker-App/

npx angular-cli-ghpages --dir=dist/Flight-Luggage-Tracker-App

