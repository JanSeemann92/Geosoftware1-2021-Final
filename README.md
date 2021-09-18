# Geosoftware1-2021-Final

Requirements: Node >= 14

## Docker

> Note: You have to add your custom `OPENWEATHERMAP_API_KEY` to the `docker-compose.yaml` file

Start:

```sh
docker-compose up
```

Open `http://localhost:8080` in your browser.

The frontend and backend are available on Docker Hub:

- `nschnierer/geosoft1-final-frontend`
- `nschnierer/geosoft1-final-backend`

## Frontend

Is using [Create React App](https://create-react-app.dev/).

Install and run:

```sh
cd frontend
npm install
```

```sh
npm run start
```

Test:

```sh
npm run test
```

## Backend

Install and run:

```sh
cd backend
npm install
```

```sh
npm run start
```
