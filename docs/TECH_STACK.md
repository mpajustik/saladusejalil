# TECH_STACK.md

## Eesmärk

See fail kirjeldab, milliseid tehnoloogiaid projektis kasutada ja miks.

Algaja jaoks on oluline, et tehnoloogiaid ei oleks liiga palju korraga.

---

# Etapp 1 tehnoloogiad

Etapp 1 on ühe seadme prototüüp.

Kasuta:

```text
React
TypeScript
Vite
CSS
brauseri state
```

Ära kasuta veel:

```text
backendit;
andmebaasi;
WebSocketit;
kontosid;
PWA-d.
```

---

## Frontend

### React

React sobib kasutajaliidese komponentide tegemiseks.

Mängus saab teha näiteks komponendid:

```text
App
StartScreen
GameScreen
PlayerPanel
CardsView
SuggestionForm
RevealCardPanel
DetectiveNotes
AccusationForm
GameOverScreen
```

---

### TypeScript

TypeScript aitab kirjeldada andmetüüpe.

Näiteks:

```ts
type CardType = "suspect" | "location" | "item";

type Card = {
  id: string;
  type: CardType;
  name: string;
  description: string;
};
```

See aitab vältida vigu, kus näiteks tegelase kaarti kasutatakse kogemata asukohana.

---

### Vite

Vite sobib Reacti projekti kiireks käivitamiseks.

Tüüpilised käsud:

```bash
npm install
npm run dev
npm run build
```

---

### CSS

MVP-s kasuta tavalist CSS-i.

Ära lisa kohe keerulist UI raamistikku.

Hea failistruktuur:

```text
src/
  App.tsx
  main.tsx
  styles.css
  components/
  data/
  game/
  types/
```

---

# Etapp 2 tehnoloogiad

Etapp 2 lisab backendile aluse.

Soovitus:

```text
Node.js
Express või Fastify
TypeScript
```

Backend vastutab:

```text
mängutoa loomise eest;
mängijate liitumise eest;
mänguseisu hoidmise eest;
privaatsuse kontrollimise eest.
```

---

# Etapp 3 tehnoloogiad

Etapp 3 lisab reaalajas mängu.

Soovitus:

```text
Socket.IO
```

Socket.IO aitab:

```text
saata sündmusi mängutoas;
uuendada mänguseisu kõigil klientidel;
saata privaatseid sündmusi ainult ühele mängijale;
tegeleda katkestuste ja taasühendumisega.
```

---

# Etapp 4 tehnoloogiad

Etapp 4 lisab juhtumid JSON-failidest.

Soovitus:

```text
JSON-failid või TypeScripti objektid
Zod või käsitsi valideerimine
```

Alguses võib valideerimise teha ise lihtsate funktsioonidega.

Hiljem võib kasutada Zod-i.

---

# Etapp 5 tehnoloogiad

Etapp 5 lisab admin-paneeli.

Alguses:

```text
React vormid
localStorage
juhtumi eelvaade
valideerimine
```

Hiljem:

```text
PostgreSQL
Prisma
kasutajakontod
õigused
```

---

# Etapp 6 tehnoloogiad

Etapp 6 lisab PWA ja telefoni parema kogemuse.

Vajalikud osad:

```text
manifest.webmanifest
service worker
ikoonid
responsive CSS
mobile navigation
```

---

## Soovituslik failistruktuur etapiks 1

```text
saladuse-jalil/
  README.md
  package.json
  index.html
  src/
    main.tsx
    App.tsx
    styles.css
    types/
      game.ts
      case.ts
    data/
      sampleCase.ts
    game/
      createGame.ts
      dealCards.ts
      checkSuggestion.ts
      checkAccusation.ts
    components/
      StartScreen.tsx
      GameScreen.tsx
      PlayerPanel.tsx
      CardsView.tsx
      SuggestionForm.tsx
      DetectiveNotes.tsx
      AccusationForm.tsx
      GameLog.tsx
```

---

## Miks mitte kohe andmebaas?

Andmebaas on vajalik hiljem, aga mitte esimese prototüübi jaoks.

MVP eesmärk on kontrollida mänguloogikat.

Kui lisada kohe andmebaas, siis tekib liiga palju korraga:

```text
andmemudel;
migratsioonid;
päringud;
server;
turvalisus;
keskkonnamuutujad;
deploy.
```

See aeglustab algajat.

---

## Miks mitte kohe multiplayer?

Mitme mängija reaalajas versioon on tehniliselt palju raskem.

Kõigepealt peab töötama:

```text
salajane lahendus;
kaardijagamine;
hüpotees;
kaardi näitamine;
süüdistus.
```

Kui need töötavad ühe seadme peal, on hiljem lihtsam serverisse viia.

---

## Soovituslik arendusfilosoofia

```text
Tee esmalt mängumootor.
Siis tee kasutajaliides.
Siis tee andmed paindlikuks.
Siis tee multiplayer.
Siis tee admin.
Siis tee PWA.
```

Mitte vastupidi.
