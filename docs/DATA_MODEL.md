# DATA_MODEL.md

## Eesmärk

See fail kirjeldab mängu põhilisi andmestruktuure.

Etapp 1 kasutab neid TypeScripti tüüpidena frontend-is.

Etappides 2–5 saab samad mõisted viia backendisse ja andmebaasi.

---

## Põhimõisted

Mängus on järgmised tähtsad mõisted:

```text
Case ehk juhtum
Card ehk kaart
Player ehk mängija
Game ehk mäng
Solution ehk salajane lahendus
Suggestion ehk hüpotees
Accusation ehk lõplik süüdistus
Note ehk mängija märge
GameLogEntry ehk tegevuste ajalugu
```

---

## CardType

```ts
export type CardType = "suspect" | "location" | "item";
```

Tähendus:

```text
suspect = tegelane
location = asukoht
item = ese või tõend
```

---

## Card

```ts
export type Card = {
  id: string;
  type: CardType;
  name: string;
  description: string;
};
```

Näide:

```ts
{
  id: "malupulk",
  type: "item",
  name: "Mälupulk",
  description: "Võis sisaldada leiutise jooniseid."
}
```

---

## MysteryCase

```ts
export type MysteryCase = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  minPlayers: number;
  maxPlayers: number;
  suspects: Card[];
  locations: Card[];
  items: Card[];
  rules: CaseRules;
};
```

---

## CaseRules

```ts
export type CaseRules = {
  solutionMode: "random" | "fixed";
  allowAccusationAnytime: boolean;
  useMovement: boolean;
  noteMode: "simple" | "advanced";
};
```

MVP-s kasuta:

```ts
{
  solutionMode: "random",
  allowAccusationAnytime: true,
  useMovement: false,
  noteMode: "simple"
}
```

---

## Player

```ts
export type Player = {
  id: string;
  name: string;
  hand: Card[];
  notes: PlayerNotes;
  isEliminated: boolean;
};
```

MVP-s võib mängijad luua automaatselt:

```text
Mängija 1
Mängija 2
Mängija 3
```

---

## Solution

```ts
export type Solution = {
  suspectId: string;
  locationId: string;
  itemId: string;
};
```

Salajane lahendus ei tohiks olla nähtav mängijatele tavavaates.

Arenduse alguses võib seda testimiseks näidata eraldi debug-paneelis.

---

## Suggestion

```ts
export type Suggestion = {
  suspectId: string;
  locationId: string;
  itemId: string;
};
```

Hüpotees ja süüdistus võivad olla sama struktuuriga.

---

## Accusation

```ts
export type Accusation = {
  suspectId: string;
  locationId: string;
  itemId: string;
};
```

---

## PlayerNotes

Lihtne variant:

```ts
export type NoteValue = "unknown" | "excluded" | "possible";

export type PlayerNotes = Record<string, NoteValue>;
```

Näide:

```ts
{
  "mari": "excluded",
  "jaan": "unknown",
  "malupulk": "possible"
}
```

---

## GameStatus

```ts
export type GameStatus =
  | "not_started"
  | "in_progress"
  | "waiting_for_reveal"
  | "game_over";
```

Hiljem saab lisada rohkem olekuid.

---

## Game

```ts
export type Game = {
  id: string;
  caseId: string;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  solution: Solution;
  lastSuggestion?: Suggestion;
  pendingReveal?: PendingReveal;
  log: GameLogEntry[];
  winnerPlayerId?: string;
};
```

---

## PendingReveal

```ts
export type PendingReveal = {
  askingPlayerId: string;
  revealingPlayerId: string;
  matchingCards: Card[];
  suggestion: Suggestion;
};
```

Seda kasutatakse siis, kui üks mängija peab valima, millist kaarti näidata.

---

## GameLogEntry

```ts
export type GameLogEntry = {
  id: string;
  message: string;
  createdAt: string;
  isPrivate?: boolean;
  visibleToPlayerId?: string;
};
```

MVP-s võib privaatsust hoida lihtsamalt kasutajaliidese tasemel.

Multiplayer-etapis peab privaatsust kontrollima server.

---

# Tuleviku andmebaasimudel

Etappides 2–5 võib vaja minna andmebaasi.

Võimalikud tabelid:

```text
users
cases
case_cards
games
game_players
game_cards
game_actions
```

---

## users

```text
id
name
email
password_hash
created_at
```

MVP-s pole vajalik.

---

## cases

```text
id
title
description
difficulty
min_players
max_players
created_by
is_public
created_at
updated_at
```

---

## case_cards

```text
id
case_id
type
name
description
image_url
sort_order
```

---

## games

```text
id
case_id
room_code
status
current_player_id
solution_suspect_card_id
solution_location_card_id
solution_item_card_id
created_at
updated_at
```

---

## game_players

```text
id
game_id
user_id
display_name
turn_order
is_eliminated
last_seen_at
```

---

## game_cards

```text
id
game_id
card_id
owner_player_id
is_solution_card
```

---

## game_actions

```text
id
game_id
player_id
action_type
payload_json
created_at
```

---

## Oluline turvareegel

Multiplayer-etapis ei tohi frontendile saata:

```text
salajast lahendust;
teiste mängijate kaarte;
teiste mängijate privaatseid märkmeid.
```

Server peab looma iga mängija jaoks eraldi privaatse vaate.
