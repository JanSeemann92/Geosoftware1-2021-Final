# Geosoftware1-2021-Final - API

> Node >= 14.x

## Run

Install dependencies:

```sh
npm install
```

Development:

```sh
npm run start
```

Production:

```sh
npm run start:prod
```

## Specification

### Sights

#### `GET /sights`

| QUERY PARAMETER | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `search`        | Search for sights over the field `name`. Example: `/sights?search=Uni` |

Response `200`:

```json
[
  {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [7.631495, 51.973963],
          [7.632244, 51.9733],
          [7.633101, 51.974174],
          [7.631495, 51.973963]
        ]
      ]
    },
    "properties": {
      "id": "0e7b7a91-f8db-46d8-b5ee-baf92ed1cd4e",
      "name": "Westfälische Wilhelms-Universität Münster",
      "description": "Die Westfälische Wilhelms-Universität Münster (WWU) in Münster ist mit rund 45.700 Studierenden ...",
      "url": "https://de.wikipedia.org/wiki/Westf%C3%A4lische_Wilhelms-Universit%C3%A4t_M%C3%BCnster"
    }
  }
]
```

#### `GET /sights/{id}`

Response `200`:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [7.626343, 51.960505]
  },
  "properties": {
    "id": "fc7bdbb5-8684-4af6-a604-d76d56761e16",
    "name": "Münster",
    "description": "",
    "url": ""
  }
}
```

#### `GET /sights/{id}/infos`

Get next bus stop and weather for a sight.

```json
{
  "sightId": "fc7bdbb5-8684-4af6-a604-d76d56761e16",
  "busStop": {
    "type": "Feature",
    "properties": {
      "nr": "4192302",
      "typ": "1",
      "lbez": "Picasso-Museum",
      "kbez": "PICA",
      "richtung": "einwärts",
      "featureIndex": 942,
      "distanceToPoint": 0.02195240234980468
    },
    "geometry": {
      "type": "Point",
      "coordinates": [7.6260228, 51.9604983]
    }
  },
  "weather": {
    "coord": {
      "lon": 7.626,
      "lat": 51.9605
    },
    "weather": [
      {
        "id": 803,
        "main": "Clouds",
        "description": "broken clouds",
        "icon": "04d"
      }
    ],
    "base": "stations",
    "main": {
      "temp": 15.35,
      "feels_like": 14.27,
      "temp_min": 14.83,
      "temp_max": 16.23,
      "pressure": 1022,
      "humidity": 51
    },
    "visibility": 10000,
    "wind": {
      "speed": 2.57,
      "deg": 50
    },
    "clouds": {
      "all": 75
    },
    "dt": 1632141119,
    "sys": {
      "type": 1,
      "id": 1269,
      "country": "DE",
      "sunrise": 1632114740,
      "sunset": 1632159216
    },
    "timezone": 7200,
    "id": 2867543,
    "name": "Münster",
    "cod": 200
  }
}
```

#### `POST /sights`

Create a new sight.

Response `200`:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [7.626343, 51.960505]
  },
  "properties": {
    "name": "Münster",
    "description": "",
    "url": ""
  }
}
```

> Only geometry `Point` and `Polygon` are supported.

#### `PUT /sights`

Update a sight.

Response `200`:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [7.631495, 51.973963],
        [7.632244, 51.9733],
        [7.633101, 51.974174],
        [7.631495, 51.973963]
      ]
    ]
  },
  "properties": {
    "id": "fc7bdbb5-8684-4af6-a604-d76d56761e16",
    "name": "Münster",
    "description": "",
    "url": ""
  }
}
```

#### `DELETE /sights/{id}`

Delete a sight.

Response `200`:

```json
{
  "id": "fc7bdbb5-8684-4af6-a604-d76d56761e16"
}
```

### Tours

#### `GET /tour`

| QUERY PARAMETER | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `search`        | Search for tours over the field `name`. Example: `/tours?search=Uni` |

Response `200`:

```json
[
  {
    "name": "Tour 42",
    "sights": [
      "22c4018e-df89-443c-aad2-bb5bd98a39ff",
      "0e7b7a91-f8db-46d8-b5ee-baf92ed1cd4e"
    ],
    "id": "69468059-e8f2-46df-b8de-594398e6d153"
  }
]
```

#### `GET /tours/{id}`

Get a tour.

Response `200`:

```json
{
  "name": "Tour 42",
  "sights": [
    "22c4018e-df89-443c-aad2-bb5bd98a39ff",
    "0e7b7a91-f8db-46d8-b5ee-baf92ed1cd4e"
  ],
  "id": "69468059-e8f2-46df-b8de-594398e6d153"
}
```

#### `POST /tours`

Create a new tour.

Response `200`:

```json
{
  "name": "Tour 42",
  "sights": [
    "22c4018e-df89-443c-aad2-bb5bd98a39ff",
    "0e7b7a91-f8db-46d8-b5ee-baf92ed1cd4e"
  ]
}
```

#### `PUT /tours`

Update a tour.

Response `200`:

```json
{
  "name": "Tour 42",
  "sights": [
    "22c4018e-df89-443c-aad2-bb5bd98a39ff",
    "0e7b7a91-f8db-46d8-b5ee-baf92ed1cd4e"
  ],
  "id": "69468059-e8f2-46df-b8de-594398e6d153"
}
```

#### `DELETE /tours/{id}`

Delete a tour.

Response `200`:

```json
{
  "id": "69468059-e8f2-46df-b8de-594398e6d153"
}
```
