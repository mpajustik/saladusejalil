# WEBSOCKET_EVENTS.md

## Eesmärk

See fail kirjeldab tulevase reaalajas mitme mängija versiooni sündmusi.

Etapp 1 ei kasuta WebSocketit.

Etapp 3 kasutab seda faili.

---

# Põhimõte

Kõik mängijad on ühes mängutoas.

Kui üks mängija teeb tegevuse, saadab server teistele vajaliku info.

Oluline:

```text
avalikud sündmused lähevad kõigile;
privaatsed sündmused lähevad ainult kindlale mängijale.
```

---

# Sündmuste nimekonventsioon

Soovituslik formaat:

```text
game:created
player:joined
game:started
turn:changed
suggestion:created
reveal:requested
reveal:shown
accusation:created
game:ended
error
```

---

# Client → Server sündmused

## player:join

Mängija liitub mängutoaga.

Payload:

```json
{
  "roomCode": "ABCD",
  "playerName": "Jaan"
}
```

---

## game:start

Mängujuht alustab mängu.

Payload:

```json
{
  "gameId": "game_123",
  "playerId": "player_1"
}
```

---

## suggestion:create

Mängija esitab hüpoteesi.

Payload:

```json
{
  "gameId": "game_123",
  "playerId": "player_1",
  "suspectId": "mari",
  "locationId": "keemialabor",
  "itemId": "malupulk"
}
```

---

## reveal:choose

Mängija valib kaardi, mida näidata.

Payload:

```json
{
  "gameId": "game_123",
  "playerId": "player_2",
  "cardId": "mari"
}
```

---

## accusation:create

Mängija teeb lõpliku süüdistuse.

Payload:

```json
{
  "gameId": "game_123",
  "playerId": "player_1",
  "suspectId": "mari",
  "locationId": "keemialabor",
  "itemId": "malupulk"
}
```

---

# Server → Client avalikud sündmused

## player:joined

Teade kõigile, et mängija liitus.

Payload:

```json
{
  "player": {
    "id": "player_2",
    "name": "Jaan"
  }
}
```

---

## game:started

Teade kõigile, et mäng algas.

Payload:

```json
{
  "gameId": "game_123",
  "status": "in_progress",
  "currentPlayerId": "player_1"
}
```

Ei tohi sisaldada salajast lahendust.

---

## turn:changed

Teade kõigile, kelle kord on.

Payload:

```json
{
  "currentPlayerId": "player_2"
}
```

---

## suggestion:created

Avalik teade hüpoteesi kohta.

Payload:

```json
{
  "askingPlayerId": "player_1",
  "suggestion": {
    "suspectId": "mari",
    "locationId": "keemialabor",
    "itemId": "malupulk"
  },
  "message": "Mängija 1 esitas hüpoteesi."
}
```

---

## reveal:public

Avalik teade, et kaart näidati.

Payload:

```json
{
  "askingPlayerId": "player_1",
  "revealingPlayerId": "player_2",
  "message": "Mängija 2 näitas Mängija 1-le ühe kaardi."
}
```

Ei tohi sisaldada kaardi nime.

---

## game:ended

Teade kõigile, et mäng lõppes.

Payload:

```json
{
  "winnerPlayerId": "player_1",
  "solution": {
    "suspectId": "mari",
    "locationId": "keemialabor",
    "itemId": "malupulk"
  }
}
```

Mängu lõpus võib lahenduse kõigile näidata.

---

# Server → Client privaatsed sündmused

## private:hand

Mängija saab oma kaardid.

Payload:

```json
{
  "playerId": "player_1",
  "hand": [
    {
      "id": "mari",
      "type": "suspect",
      "name": "Mari"
    }
  ]
}
```

Saata ainult vastavale mängijale.

---

## reveal:requested

Ühele mängijale saadetakse teade, et ta peab kaardi valima.

Payload:

```json
{
  "revealingPlayerId": "player_2",
  "askingPlayerId": "player_1",
  "matchingCards": [
    {
      "id": "mari",
      "type": "suspect",
      "name": "Mari"
    }
  ]
}
```

Saata ainult kaarti näitavale mängijale.

---

## reveal:private

Küsijale saadetakse näidatud kaart.

Payload:

```json
{
  "askingPlayerId": "player_1",
  "shownCard": {
    "id": "mari",
    "type": "suspect",
    "name": "Mari"
  }
}
```

Saata ainult hüpoteesi esitanud mängijale.

---

# Turvareegel

Ära saada kunagi kõigile:

```text
kogu kaardijaotust;
salajast lahendust enne mängu lõppu;
teiste mängijate märkmeid;
näidatud kaardi nime avalikus sündmuses.
```

---

# Reconnect

Kui mängija kaotab ühenduse, peab ta saama tagasi liituda.

Vajalik info:

```text
gameId või roomCode;
playerId;
session token.
```

Etapp 3 alguses võib reconnect olla lihtne, kuid see tuleb planeerida.
