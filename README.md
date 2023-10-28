# Getting Started

## Local installation

1. Install Vercel CLI (more info [here](https://vercel.com/docs/functions/serverless-functions/quickstart)):
```
npm i -g vercel@latest
```

2. Run the server
```
npm start
```

## Endpoints

### Get movies

Endpoint: `/api/movies`

Response example:
```json
[
  {
    "title": "LOS ASESINOS DE LA LUNA",
    "duration": "206",
    "classification": "DOE",
    "rating": "16",
    "img": "https://cinebaixtaquilla81.com/karpeta_0004baix/posters/1880.jpg",
    "schedule": [
      {
        "day": "Dissabte 28, oct.",
        "rooms": [
          {
            "room": "Sala 2",
            "time": "17:55"
          },
          {
            "room": "Sala 4",
            "time": "19:50"
          }
        ]
      },
      {
        "day": "Diumenge 29, oct.",
        "rooms": [
          {
            "room": "Sala 2",
            "time": "17:55"
          },
          {
            "room": "Sala 4",
            "time": "19:50"
          }
        ]
      },
      {
        "day": "Dilluns 30, oct.",
        "rooms": [
          {
            "room": "Sala 2",
            "time": "17:55"
          },
          {
            "room": "Sala 4",
            "time": "19:50"
          }
        ]
      }
    ]
  },
  {
    "title": "LA PATRULLA CANINA: LA SUPERPELÍCULA",
    "duration": "95",
    "classification": "DOE",
    "rating": "Apta",
    "img": "https://cinebaixtaquilla81.com/karpeta_0004baix/posters/1875.jpg",
    "schedule": [
      {
        "day": "Dissabte 28, oct.",
        "rooms": [
          {
            "room": "Sala 3",
            "time": "16:30"
          },
          {
            "room": "Sala 3",
            "time": "18:20"
          }
        ]
      },
      {
        "day": "Diumenge 29, oct.",
        "rooms": [
          {
            "room": "Sala 3",
            "time": "16:30"
          },
          {
            "room": "Sala 3",
            "time": "18:20"
          }
        ]
      },
      {
        "day": "Dilluns 30, oct.",
        "rooms": [
          {
            "room": "Sala 3",
            "time": "18:20"
          }
        ]
      }
    ]
  },
  {
    "title": ".DON QUIXOTE -BALLET EN DIRECTE DES DE ROH-",
    "duration": "210",
    "classification": "",
    "rating": "- - -",
    "img": "https://cinebaixtaquilla81.com/karpeta_0004baix/cartelteatro/_583.jpg",
    "schedule": [
      {
        "day": "Dimarts 7, nov.",
        "rooms": [
          {
            "room": "Sala 1",
            "time": "20:15"
          }
        ]
      }
    ]
  }
]
```

### Get movie IMDb info

Endpoint: `/api/movies/imdb?title={movie-title}`

Response example:
```json
{
  "url": "https://www.imdb.com/title/tt5537002/?ref_=fn_al_tt_1",
  "imdbRating": 8.1,
  "plot": "Miembros de la tribu osage en los Estados Unidos son asesinados bajo circunstancias misteriosas en la década de 1920 provocado una importante investigación del FBI que involucra a J. Edgar Hoover.",
  "directors": [
    "Martin Scorsese"
  ],
  "writers": [
    "Eric Roth",
    "Martin Scorsese",
    "David Grann"
  ],
  "stars": [
    "Leonardo DiCaprio",
    "Robert De Niro",
    "Lily Gladstone"
  ]
}
```
