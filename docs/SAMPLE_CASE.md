# SAMPLE_CASE.md

## Esimene näidisjuhtum

Pealkiri:

```text
Kadunud Leiutise Juhtum
```

---

## Lühilugu

Kooli teadusmessil pidi esitletama uut nutikat leiutist. Vahetult enne esitlust avastati, et leiutise kõige olulisem osa on kadunud.

Mängijad peavad välja selgitama:

```text
kes oli kadumisega seotud;
kus see juhtus;
milline ese või tõend aitab tõe paljastada.
```

---

## Tegelased

### Mari

```text
Roll: noor teadlane
Kirjeldus: Mari esitles messil oma keemiakatset ja oli väga närvis, et kõik õnnestuks.
```

### Jaan

```text
Roll: robootikaringi liige
Kirjeldus: Jaan tundis kadunud leiutise tehnilise lahenduse vastu suurt huvi.
```

### Kati

```text
Roll: korraldaja
Kirjeldus: Kati vastutas selle eest, et kõik projektid oleksid õigel ajal õiges kohas.
```

### Rasmus

```text
Roll: fotograaf
Kirjeldus: Rasmus liikus kogu päeva ringi ja pildistas teadusmessi ettevalmistusi.
```

### Liis

```text
Roll: laboriabiline
Kirjeldus: Liis aitas õpetajal vahendeid valmis panna ja uksi lukustada.
```

### Oskar

```text
Roll: külaline teisest koolist
Kirjeldus: Oskar tuli messile oma kooli esindama ja uuris tähelepanelikult teiste töid.
```

---

## Asukohad

### Keemialabor

```text
Kirjeldus: Ruum, kus tehti viimased katsed ja hoiti osa vahendeid.
```

### Füüsikaklass

```text
Kirjeldus: Klass, kus toimus leiutise tehniline testimine.
```

### Raamatukogu

```text
Kirjeldus: Vaikne koht, kus hoiti projektide kirjeldusi ja plakateid.
```

### Aula

```text
Kirjeldus: Peamine messiala, kus pidid toimuma esitlused.
```

### Arvutiklass

```text
Kirjeldus: Ruum, kus valmistati ette esitlusi ja prinditi materjale.
```

### Koridor

```text
Kirjeldus: Kõik liikusid siit läbi, kuid keegi ei pannud kõike täpselt tähele.
```

---

## Esemed ja tõendid

### Mälupulk

```text
Kirjeldus: Võis sisaldada leiutise jooniseid ja esitlusfaile.
```

### Võti

```text
Kirjeldus: Avas ruumi, kuhu kõik õpilased ei pääsenud.
```

### Katseklaas

```text
Kirjeldus: Selle küljes oli ainejääk, mis võis viidata laborile.
```

### Märkmik

```text
Kirjeldus: Märkmikus olid kirjas leiutise katsetulemused.
```

### Kaamerapilt

```text
Kirjeldus: Foto, mille taustale võis jääda oluline detail.
```

### Kruvikeeraja

```text
Kirjeldus: Tööriist, millega sai leiutise korpust avada.
```

---

## Soovituslik JSON / TypeScript andmeobjekt

```ts
export const sampleCase = {
  id: "kadunud-leiutis",
  title: "Kadunud Leiutise Juhtum",
  description:
    "Kooli teadusmessilt on kadunud tähtis leiutis. Mängijad peavad välja selgitama, kes oli juhtumiga seotud, kus see toimus ja milline ese või tõend aitab tõe paljastada.",
  difficulty: "easy",
  minPlayers: 3,
  maxPlayers: 6,
  suspects: [
    {
      id: "mari",
      name: "Mari",
      description: "Noor teadlane, kes esitles messil oma keemiakatset."
    },
    {
      id: "jaan",
      name: "Jaan",
      description: "Robootikaringi liige, kes tundis leiutise vastu suurt huvi."
    },
    {
      id: "kati",
      name: "Kati",
      description: "Korraldaja, kes vastutas messi ajakava ja ruumide eest."
    },
    {
      id: "rasmus",
      name: "Rasmus",
      description: "Fotograaf, kes liikus kogu päeva erinevates ruumides."
    },
    {
      id: "liis",
      name: "Liis",
      description: "Laboriabiline, kes aitas vahendeid valmis panna."
    },
    {
      id: "oskar",
      name: "Oskar",
      description: "Külaline teisest koolist, kes uuris teiste projekte."
    }
  ],
  locations: [
    {
      id: "keemialabor",
      name: "Keemialabor",
      description: "Ruum, kus tehti viimased katsed."
    },
    {
      id: "fuusikaklass",
      name: "Füüsikaklass",
      description: "Klass, kus toimus tehniline testimine."
    },
    {
      id: "raamatukogu",
      name: "Raamatukogu",
      description: "Koht, kus hoiti projektide kirjeldusi."
    },
    {
      id: "aula",
      name: "Aula",
      description: "Peamine messiala."
    },
    {
      id: "arvutiklass",
      name: "Arvutiklass",
      description: "Ruum esitluste ja failide ettevalmistamiseks."
    },
    {
      id: "koridor",
      name: "Koridor",
      description: "Kõik liikusid siit läbi."
    }
  ],
  items: [
    {
      id: "malupulk",
      name: "Mälupulk",
      description: "Võis sisaldada leiutise jooniseid."
    },
    {
      id: "voti",
      name: "Võti",
      description: "Avas piiratud ligipääsuga ruumi."
    },
    {
      id: "katseklaas",
      name: "Katseklaas",
      description: "Sellel oli ainejääk."
    },
    {
      id: "markmik",
      name: "Märkmik",
      description: "Sisaldas katsetulemusi."
    },
    {
      id: "kaamerapilt",
      name: "Kaamerapilt",
      description: "Foto, mille taustal võis olla oluline detail."
    },
    {
      id: "kruvikeeraja",
      name: "Kruvikeeraja",
      description: "Tööriist korpuse avamiseks."
    }
  ],
  rules: {
    solutionMode: "random",
    allowAccusationAnytime: true,
    useMovement: false,
    noteMode: "simple"
  }
};
```

---

## Oluline märkus

See juhtum on piisavalt lihtne MVP jaoks, aga seda saab hiljem laiendada.

Näiteks saab lisada:

```text
motiivid;
lisavihjed;
pildid;
raskusastmed;
kindla lahenduse;
õpetaja kommentaarid;
ainealased küsimused.
```
