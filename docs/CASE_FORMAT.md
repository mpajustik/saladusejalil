# CASE_FORMAT.md

## Eesmärk

See fail kirjeldab, kuidas mängu juhtumid peavad olema üles ehitatud.

Juhtum peab olema andmepõhine, et hiljem saaks uusi juhtumeid lisada ilma kogu mängumootorit ümber kirjutamata.

---

## Juhtumi põhimõte

Iga juhtum sisaldab vähemalt:

```text
id;
pealkiri;
kirjeldus;
tegelased;
asukohad;
esemed või tõendid;
reeglid.
```

---

## Lihtsustatud TypeScripti tüüp

```ts
export type CaseCardType = "suspect" | "location" | "item";

export type CaseCard = {
  id: string;
  name: string;
  description: string;
};

export type MysteryCase = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  minPlayers: number;
  maxPlayers: number;
  suspects: CaseCard[];
  locations: CaseCard[];
  items: CaseCard[];
  rules: {
    solutionMode: "random" | "fixed";
    allowAccusationAnytime: boolean;
    useMovement: boolean;
    noteMode: "simple" | "advanced";
  };
};
```

---

## Juhtumi JSON näidis

```json
{
  "id": "kadunud-leiutis",
  "title": "Kadunud Leiutise Juhtum",
  "description": "Kooli teadusmessilt on kadunud tähtis leiutis. Mängijad peavad välja selgitama, kes oli juhtumiga seotud, kus see toimus ja milline ese või tõend aitab tõe paljastada.",
  "difficulty": "easy",
  "minPlayers": 3,
  "maxPlayers": 6,
  "suspects": [
    {
      "id": "mari",
      "name": "Mari",
      "description": "Noor teadlane, kes esitles teadusmessil oma katset."
    },
    {
      "id": "jaan",
      "name": "Jaan",
      "description": "Robootikaringi liige, kes tundis leiutise vastu suurt huvi."
    }
  ],
  "locations": [
    {
      "id": "labor",
      "name": "Keemialabor",
      "description": "Ruum, kus toimusid viimased katsed."
    },
    {
      "id": "raamatukogu",
      "name": "Raamatukogu",
      "description": "Vaikne ruum, kus hoiti teadusmessi märkmeid."
    }
  ],
  "items": [
    {
      "id": "malupulk",
      "name": "Mälupulk",
      "description": "Võis sisaldada leiutise jooniseid."
    },
    {
      "id": "voti",
      "name": "Võti",
      "description": "Avas ukse ruumi, kuhu kõik ei pääsenud."
    }
  ],
  "rules": {
    "solutionMode": "random",
    "allowAccusationAnytime": true,
    "useMovement": false,
    "noteMode": "simple"
  }
}
```

---

## Valideerimise reeglid

Enne mängu alustamist peab süsteem kontrollima, kas juhtum on mängitav.

Juhtum peab vastama vähemalt nendele tingimustele:

```text
id ei ole tühi;
title ei ole tühi;
description ei ole tühi;
suspects massiivis on vähemalt 3 elementi;
locations massiivis on vähemalt 3 elementi;
items massiivis on vähemalt 3 elementi;
kõigil kaartidel on id;
kõigil kaartidel on name;
ühe kategooria sees ei tohi id korduda;
kategooriate vahel ei tohiks id korduda;
minPlayers on vähemalt 2;
maxPlayers on suurem või võrdne minPlayers;
rules objekt on olemas.
```

MVP-s soovitatav:

```text
vähemalt 6 tegelast;
vähemalt 6 asukohta;
vähemalt 6 eset;
3 mängijat.
```

---

## ID-de kirjutamise reeglid

ID-d võiksid olla:

```text
väiketähtedes;
ilma tühikuteta;
ilma täpitähtedeta;
sidekriipsuga eraldatud.
```

Hea:

```text
keemialabor
opetajate-tuba
malupulk
katkine-markmik
```

Halb:

```text
Keemia Labor
Õpetajate tuba
Mälupulk!!!
```

---

## Miks juhtum peab olema eraldi andmetena?

Halb lahendus:

```ts
const suspect1 = "Mari";
const suspect2 = "Jaan";
```

Sellisel juhul on mäng ühe juhtumi külge kinni kirjutatud.

Hea lahendus:

```ts
const selectedCase = cases.find(c => c.id === selectedCaseId);
```

Siis saab mängumootor töötada iga juhtumiga.

---

## Tuleviku laiendused

Hiljem võib juhtumile lisada:

```text
tegelaste pildid;
asukohtade pildid;
helid;
loo peatükid;
kindel lõpplahendus;
motiivid;
vihjekaardid;
sündmusekaardid;
ajapiirang;
raskusastme muutujad;
hariduslikud selgitused.
```

---

## Fixed solution ehk kirjutatud lahendus

Hiljem võib juhtum kasutada kindlat lahendust.

Näide:

```json
{
  "rules": {
    "solutionMode": "fixed"
  },
  "fixedSolution": {
    "suspectId": "mari",
    "locationId": "labor",
    "itemId": "malupulk"
  }
}
```

MVP-s kasuta juhuslikku lahendust.
