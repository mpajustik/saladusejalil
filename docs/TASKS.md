# TASKS.md

## Eesmärk

See fail on samm-sammuline tööplaan.

Ära tee kõiki ülesandeid korraga.

Tee üks väike plokk korraga.

---

# Etapp 1: ühe seadme prototüüp

## Plokk 1: projekti põhi

### Ülesanne 1.1

Loo React + TypeScript + Vite projekt.

Valmis, kui:

```text
npm run dev töötab;
avalehel on tekst "Saladuse Jälil".
```

### Ülesanne 1.2

Lisa lihtne failistruktuur:

```text
src/components
src/data
src/game
src/types
```

Valmis, kui:

```text
projekt käivitub pärast kaustade lisamist endiselt.
```

### Ülesanne 1.3

Lisa põhiline CSS.

Valmis, kui:

```text
leht on loetav;
nupud on nähtavad;
telefonis ei lähe sisu ekraanist välja.
```

---

## Plokk 2: juhtumi andmed

### Ülesanne 2.1

Loo TypeScripti tüübid:

```text
Card
CardType
MysteryCase
CaseRules
```

Valmis, kui:

```text
projekt kompileerub.
```

### Ülesanne 2.2

Loo `sampleCase.ts`.

Valmis, kui:

```text
juhtumis on 6 tegelast;
juhtumis on 6 asukohta;
juhtumis on 6 eset.
```

### Ülesanne 2.3

Kuva juhtumi andmed ekraanil.

Valmis, kui:

```text
näen kõiki kaarte brauseris.
```

---

## Plokk 3: mängu loomine

### Ülesanne 3.1

Loo mängija tüüp ja kolm testmängijat.

Valmis, kui:

```text
ekraanil on Mängija 1, Mängija 2, Mängija 3.
```

### Ülesanne 3.2

Loo funktsioon `createSolution`.

Valmis, kui:

```text
funktsioon valib ühe tegelase, ühe asukoha ja ühe eseme.
```

### Ülesanne 3.3

Loo funktsioon `dealCards`.

Valmis, kui:

```text
lahenduse kaardid eemaldatakse pakist;
ülejäänud kaardid jagatakse mängijatele.
```

### Ülesanne 3.4

Loo nupp "Alusta mängu".

Valmis, kui:

```text
nupp loob mängu;
mängijatel on kaardid;
debug-paneel näitab arendajale lahendust.
```

---

## Plokk 4: käigud

### Ülesanne 4.1

Lisa aktiivne mängija.

Valmis, kui:

```text
ekraanil on näha, kelle kord on.
```

### Ülesanne 4.2

Lisa nupp "Lõpeta kord".

Valmis, kui:

```text
kord liigub järgmisele mängijale.
```

---

## Plokk 5: hüpoteesid

### Ülesanne 5.1

Loo `SuggestionForm`.

Valmis, kui:

```text
saab valida tegelase, asukoha ja eseme.
```

### Ülesanne 5.2

Loo funktsioon `checkSuggestion`.

Valmis, kui:

```text
funktsioon leiab esimese järgmise mängija, kellel on sobiv kaart.
```

### Ülesanne 5.3

Lisa hüpoteesi tegevuste ajalugu.

Valmis, kui:

```text
hüpotees ilmub logisse.
```

---

## Plokk 6: kaardi näitamine

### Ülesanne 6.1

Lisa `PendingReveal`.

Valmis, kui:

```text
hüpoteesi järel tekib olukord, kus üks mängija peab kaarti näitama.
```

### Ülesanne 6.2

Lisa kaardi valimise vaade.

Valmis, kui:

```text
näitaja saab valida ainult sobivate kaartide hulgast.
```

### Ülesanne 6.3

Lisa privaatse kaardi näitamise vaade.

Valmis, kui:

```text
küsija näeb näidatud kaarti;
teised näevad ainult üldist teadet.
```

---

## Plokk 7: märkmed

### Ülesanne 7.1

Loo märkmete tüüp.

Valmis, kui:

```text
igal mängijal on iga kaardi kohta märge.
```

### Ülesanne 7.2

Loo `DetectiveNotes`.

Valmis, kui:

```text
mängija saab muuta iga kaardi märget.
```

### Ülesanne 7.3

Märgi mängija enda kaardid automaatselt välistatuks.

Valmis, kui:

```text
mängija kaardid on märkmetes X.
```

---

## Plokk 8: lõplik süüdistus

### Ülesanne 8.1

Loo `AccusationForm`.

Valmis, kui:

```text
saab valida tegelase, asukoha ja eseme.
```

### Ülesanne 8.2

Loo `checkAccusation`.

Valmis, kui:

```text
funktsioon tagastab true ainult õige lahenduse korral.
```

### Ülesanne 8.3

Lisa mängu lõpu vaade.

Valmis, kui:

```text
õige süüdistus lõpetab mängu.
```

---

## Plokk 9: kasutatavus

### Ülesanne 9.1

Lisa lihtne mobile-friendly kujundus.

Valmis, kui:

```text
telefonis on nupud vajutatavad ja tekst loetav.
```

### Ülesanne 9.2

Peida debug-paneel tavavaates.

Valmis, kui:

```text
kasutaja ei näe lahendust kogemata.
```

### Ülesanne 9.3

Lisa uus mängu alustamise võimalus mängu lõpus.

Valmis, kui:

```text
pärast mängu lõppu saab alustada uut mängu.
```

---

# Etappide 2–6 tööde kokkuvõte

Ära alusta neid enne, kui etapp 1 töötab.

## Etapp 2

```text
backend;
ruumikood;
liitumine;
serveripoolne mänguseis.
```

## Etapp 3

```text
WebSocket;
reaalajas sündmused;
privaatne kaardi näitamine.
```

## Etapp 4

```text
JSON juhtumid;
juhtumite valik;
valideerimine.
```

## Etapp 5

```text
admin-paneel;
juhtumite loomine;
salvestamine.
```

## Etapp 6

```text
PWA;
telefonikogemus;
installitav rakendus.
```
