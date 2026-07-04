# API_SPEC.md

## Eesmärk

See fail kirjeldab tulevase backend API põhimõtet.

Etapp 1 ei kasuta veel API-t.

See fail on vajalik etappide 2 ja 3 jaoks.

---

# Etapp 1

Etapp 1:

```text
API puudub.
Kõik töötab ühes brauseris.
```

---

# Etapp 2 API eesmärk

Etapp 2 lisab backendile järgmised ülesanded:

```text
mängutoa loomine;
mängijate liitumine;
mängu alustamine;
mänguseisu hoidmine;
mängija privaatse info tagastamine;
hüpoteesi töötlemine;
süüdistuse kontrollimine.
```

---

# REST API esialgne kavand

## POST /api/games

Loob uue mängutoa.

Request:

```json
{
  "caseId": "kadunud-leiutis",
  "hostName": "Merlis"
}
```

Response:

```json
{
  "gameId": "game_123",
  "roomCode": "ABCD",
  "playerId": "player_1"
}
```

---

## POST /api/games/:roomCode/join

Liitub mänguga.

Request:

```json
{
  "playerName": "Jaan"
}
```

Response:

```json
{
  "gameId": "game_123",
  "playerId": "player_2",
  "roomCode": "ABCD"
}
```

---

## POST /api/games/:gameId/start

Alustab mängu.

Request:

```json
{
  "playerId": "player_1"
}
```

Response:

```json
{
  "ok": true,
  "status": "in_progress"
}
```

---

## GET /api/games/:gameId/public

Tagastab avaliku mänguseisu.

Response:

```json
{
  "gameId": "game_123",
  "status": "in_progress",
  "currentPlayerId": "player_2",
  "players": [
    {
      "id": "player_1",
      "name": "Merlis"
    },
    {
      "id": "player_2",
      "name": "Jaan"
    }
  ],
  "lastAction": "Jaan esitas hüpoteesi."
}
```

Avalik seis ei tohi sisaldada:

```text
salajast lahendust;
teiste mängijate kaarte;
privaatseid märkmeid.
```

---

## GET /api/games/:gameId/private/:playerId

Tagastab ühe mängija privaatse seisu.

Response:

```json
{
  "playerId": "player_1",
  "hand": [
    {
      "id": "mari",
      "type": "suspect",
      "name": "Mari"
    }
  ],
  "notes": {
    "mari": "excluded",
    "jaan": "unknown"
  }
}
```

---

## POST /api/games/:gameId/suggestions

Esitab hüpoteesi.

Request:

```json
{
  "playerId": "player_1",
  "suspectId": "mari",
  "locationId": "keemialabor",
  "itemId": "malupulk"
}
```

Response:

```json
{
  "ok": true,
  "needsReveal": true,
  "revealingPlayerId": "player_2"
}
```

Server peab kontrollima:

```text
kas on selle mängija kord;
kas mäng on õiges olekus;
kas valitud kaardid on olemas;
kes peab kaarti näitama.
```

---

## POST /api/games/:gameId/reveal

Näitab kaardi küsijale.

Request:

```json
{
  "revealingPlayerId": "player_2",
  "cardId": "mari"
}
```

Response:

```json
{
  "ok": true
}
```

Server peab kontrollima:

```text
kas see mängija on õige näitaja;
kas kaart on tema käes;
kas kaart sobib hüpoteesiga.
```

---

## POST /api/games/:gameId/accusations

Teeb lõpliku süüdistuse.

Request:

```json
{
  "playerId": "player_1",
  "suspectId": "mari",
  "locationId": "keemialabor",
  "itemId": "malupulk"
}
```

Response õige vastuse korral:

```json
{
  "ok": true,
  "correct": true,
  "gameOver": true
}
```

Response vale vastuse korral:

```json
{
  "ok": true,
  "correct": false,
  "gameOver": false
}
```

---

# API veateated

Kõik vead võiksid olla lihtsas formaadis:

```json
{
  "ok": false,
  "error": {
    "code": "NOT_YOUR_TURN",
    "message": "Praegu ei ole sinu kord."
  }
}
```

---

# Turvareegel

Ära usalda klienti.

Klient võib saata käsu:

```text
ma tahan teha süüdistuse;
ma tahan näidata kaarti;
ma tahan liikuda;
ma tahan alustada mängu.
```

Server peab alati kontrollima, kas see on lubatud.
