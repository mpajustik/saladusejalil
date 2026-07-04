# Kuidas lisada uus juhtum

See juhend selgitab, kuidas luua uus mängujuhtum ja lisada see "Saladuse Jälil" mängu.

---

## Kiire ülevaade

Uue juhtumi lisamine käib kolmes sammus:

```
1. Loo JSON-fail juhtumi andmetega
2. Lisa JSON-fail registrisse (frontend + backend)
3. Kontrolli et juhtum on kehtiv
```

---

## Samm 1: Loo JSON-fail

### Frontendi jaoks

Loo uus fail:

```
src/cases/<juhtumi-id>.json
```

### Backendi jaoks

Loo sama fail:

```
backend/src/cases/<juhtumi-id>.json
```

### JSON-i struktuur

```json
{
  "id": "minu-juhtum",
  "title": "Minu Juhtumi Pealkiri",
  "description": "Lühikirjeldus, mis seletatakse mängijatele enne mängu algust.",
  "difficulty": "easy",
  "minPlayers": 3,
  "maxPlayers": 6,
  "suspects": [
    { "id": "tegelane-1", "name": "Nimi Siin", "description": "Lühikirjeldus tegelasest." },
    { "id": "tegelane-2", "name": "Teine Nimi", "description": "Mis rolli ta mängis?" },
    { "id": "tegelane-3", "name": "Kolmas Nimi", "description": "Miks ta kahtlusalune on?" },
    { "id": "tegelane-4", "name": "Neljas Nimi", "description": "Taustinfo." },
    { "id": "tegelane-5", "name": "Viies Nimi", "description": "Taustinfo." },
    { "id": "tegelane-6", "name": "Kuues Nimi", "description": "Taustinfo." }
  ],
  "locations": [
    { "id": "koht-1", "name": "Esimene Koht", "description": "Kus see koht asub ja mis seal toimus?" },
    { "id": "koht-2", "name": "Teine Koht",   "description": "Kirjeldus." },
    { "id": "koht-3", "name": "Kolmas Koht",  "description": "Kirjeldus." },
    { "id": "koht-4", "name": "Neljas Koht",  "description": "Kirjeldus." },
    { "id": "koht-5", "name": "Viies Koht",   "description": "Kirjeldus." },
    { "id": "koht-6", "name": "Kuues Koht",   "description": "Kirjeldus." }
  ],
  "items": [
    { "id": "ese-1", "name": "Esimene Ese",  "description": "Mis selle tõendiga seotud on?" },
    { "id": "ese-2", "name": "Teine Ese",    "description": "Kirjeldus." },
    { "id": "ese-3", "name": "Kolmas Ese",   "description": "Kirjeldus." },
    { "id": "ese-4", "name": "Neljas Ese",   "description": "Kirjeldus." },
    { "id": "ese-5", "name": "Viies Ese",    "description": "Kirjeldus." },
    { "id": "ese-6", "name": "Kuues Ese",    "description": "Kirjeldus." }
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

## Samm 2: Lisa registrisse

### Frontend (`src/data/caseRegistry.ts`)

```ts
import rawMinuJuhtum from '../cases/minu-juhtum.json'

export const caseRegistry: MysteryCase[] = [
  load(rawKadunud,    'kadunud-leiutis.json'),
  load(rawMuuseum,    'muuseumi-vargus.json'),
  load(rawMinuJuhtum, 'minu-juhtum.json'),   // ← lisad siia
]
```

### Backend (`backend/src/data/caseRegistry.ts`)

```ts
import rawMinuJuhtum from '../cases/minu-juhtum.json'

export const caseRegistry: MysteryCase[] = [
  load(rawKadunud,    'kadunud-leiutis.json'),
  load(rawMuuseum,    'muuseumi-vargus.json'),
  load(rawMinuJuhtum, 'minu-juhtum.json'),   // ← lisad siia
]
```

---

## Samm 3: Kontrolli kehtivust

### Automaatne kontroll käivitamisel

Kui backend käivitub, kontrollib ta kõiki juhtumeid automaatselt. Vigase juhtumi korral kuvatakse selge veateade ja server ei käivitu.

Näide vigasest käivitusest:

```
Error: Juhtum "minu-juhtum.json" on vigane:
  title on tühi või puudub
  suspects: vähemalt 3 elementi (on 1)
  rules objekt puudub
```

### Käsitsi kontroll API kaudu

Saad juhtumit kontrollida ka enne registrisse lisamist:

```bash
curl -X POST http://localhost:3001/api/cases/validate \
  -H "Content-Type: application/json" \
  -d @backend/src/cases/minu-juhtum.json
```

Kehtiv vastus:
```json
{ "ok": true, "valid": true, "errors": [] }
```

Vigane vastus:
```json
{
  "ok": false,
  "valid": false,
  "errors": [
    "title on tühi või puudub",
    "suspects: vähemalt 3 elementi (on 1)"
  ]
}
```

---

## ID-de kirjutamise reeglid

ID peab olema:

- väiketähtedes
- ilma tühikuteta
- ilma eesti täpitähtedeta
- sidekriipsuga eraldatud sõnad

| Hea | Halb |
|-----|------|
| `keemialabor` | `Keemia Labor` |
| `opetajate-tuba` | `Õpetajate tuba` |
| `malupulk` | `Mälupulk!!!` |
| `katkine-markmik` | `katkine märkmik` |

---

## Minimaalsed nõuded

| Väli | Miinimum |
|------|----------|
| `suspects` | 3 tegelast (MVP-s 6) |
| `locations` | 3 asukohta (MVP-s 6) |
| `items` | 3 eset (MVP-s 6) |
| `minPlayers` | 2 |
| `maxPlayers` | ≥ minPlayers |

Kõigil kaartidel peavad olema **unikaalsed** `id`-d — ka kategooriate vahel.

---

## difficulty valikud

| Väärtus | Tähendus |
|---------|---------|
| `easy` | Lihtne — hea algajatele |
| `medium` | Keskmine |
| `hard` | Raske — keeruline loogika |

---

## Näide: lühim kehtiv juhtum

```json
{
  "id": "mini-test",
  "title": "Mini Test",
  "description": "Testimiseks.",
  "difficulty": "easy",
  "minPlayers": 2,
  "maxPlayers": 4,
  "suspects":  [
    { "id": "a", "name": "A", "description": "" },
    { "id": "b", "name": "B", "description": "" },
    { "id": "c", "name": "C", "description": "" }
  ],
  "locations": [
    { "id": "x", "name": "X", "description": "" },
    { "id": "y", "name": "Y", "description": "" },
    { "id": "z", "name": "Z", "description": "" }
  ],
  "items": [
    { "id": "p", "name": "P", "description": "" },
    { "id": "q", "name": "Q", "description": "" },
    { "id": "r", "name": "R", "description": "" }
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

## Levinud vead

**Probleem:** `suspects: vähemalt 3 elementi (on 1)`
**Lahendus:** Lisa vähemalt 3 tegelast (MVP-s 6).

**Probleem:** `Kategooriate vahel korduvad id-d: voti`
**Lahendus:** Iga kaardi `id` peab olema ainulaadne üle kõigi kategooriate. Kasuta täpsemaid nimesid: `ukse-voti`, `sahtli-voti`.

**Probleem:** `difficulty peab olema: easy / medium / hard`
**Lahendus:** Kasuta täpselt ühte neist väärtustest.

**Probleem:** Backend ei käivitu pärast uue juhtumi lisamist
**Lahendus:** Käivita kontroll: `curl -X POST http://localhost:3001/api/cases/validate -d @backend/src/cases/minu-juhtum.json -H "Content-Type: application/json"`
