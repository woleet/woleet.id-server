# Client

## Development mode:
### Serve client app

Run `npm run dev` to run the app in development mode.
<br>The development app will be servet on `http://localhost:4220/`.
<br>In development mode, live reload is enabled: the app will automatically reload if you change any of the source files.

### Production preview

Run `npm run dev:prod` for a dev server with production preview.

### With SSL

You can suffix `npm run dev[:prod]` with `:ssl` to run the app in SSL mode.

## Production mode:
### Build

Run `npm run build --prod` to build the project. 
<br>The build artifacts will be stored in the `dist/` directory.
<br>You can then serve these static file the way you want, in this repository this is done by an nginx server running in a docker container (see docker-).
