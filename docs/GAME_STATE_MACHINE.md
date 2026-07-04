# GAME_STATE_MACHINE.md

## Eesmärk

See fail kirjeldab mängu olekuid.

Mängu olekumasin aitab vältida olukorda, kus kasutaja saab vajutada valesid nuppe valel ajal.

---

## Lihtne MVP olekumasin

MVP jaoks piisab neist olekutest:

```text
not_started
setup
in_progress
waiting_for_reveal
showing_revealed_card
game_over
```

---

## not_started

Tähendus:

```text
mängu ei ole veel alustatud.
```

Lubatud tegevused:

```text
alusta uut mängu;
vali juhtum.
```

Keelatud tegevused:

```text
hüpoteesi esitamine;
süüdistuse tegemine;
kaardi näitamine.
```

---

## setup

Tähendus:

```text
mäng valmistatakse ette.
```

Selles olekus:

```text
luuakse mängijad;
valitakse salajane lahendus;
jagatakse kaardid;
luuakse märkmed.
```

Pärast seda liigub mäng olekusse:

```text
in_progress
```

---

## in_progress

Tähendus:

```text
mäng käib ja aktiivne mängija saab tegutseda.
```

Lubatud tegevused:

```text
hüpoteesi esitamine;
lõpliku süüdistuse tegemine;
märkmete muutmine;
käigu lõpetamine.
```

Kui mängija esitab hüpoteesi ja keegi saab kaarti näidata, liigub mäng olekusse:

```text
waiting_for_reveal
```

Kui mängija teeb õige süüdistuse, liigub mäng olekusse:

```text
game_over
```

---

## waiting_for_reveal

Tähendus:

```text
süsteem ootab, et üks mängija valiks kaardi, mida küsijale näidata.
```

Lubatud tegevused:

```text
kaardi valimine sobivate kaartide hulgast.
```

Keelatud tegevused:

```text
uus hüpotees;
käigu lõpetamine;
uus süüdistus.
```

Kui kaart valitakse, liigub mäng olekusse:

```text
showing_revealed_card
```

---

## showing_revealed_card

Tähendus:

```text
hüpoteesi esitanud mängija näeb talle näidatud kaarti.
```

Lubatud tegevused:

```text
peida kaart ja jätka;
tee märkmeid.
```

Pärast jätkamist liigub mäng tagasi olekusse:

```text
in_progress
```

Võib ka kohe lõpetada aktiivse mängija käigu, kui reeglid nii määravad.

---

## game_over

Tähendus:

```text
mäng on lõppenud.
```

Lubatud tegevused:

```text
vaata õiget lahendust;
alusta uut mängu.
```

Keelatud tegevused:

```text
hüpoteesi esitamine;
kaardi näitamine;
märkmete muutmine, kui mäng on lõppenud.
```

---

# Olekute liikumine

Lihtsustatud voog:

```text
not_started
  ↓
setup
  ↓
in_progress
  ↓
waiting_for_reveal
  ↓
showing_revealed_card
  ↓
in_progress
  ↓
game_over
```

Süüdistuse korral:

```text
in_progress
  ↓
game_over
```

Kui süüdistus on vale ja MVP-s mäng jätkub:

```text
in_progress
  ↓
in_progress
```

---

# Kontrollreeglid

Koodis peaksid olema kontrollid:

```text
hüpoteesi saab esitada ainult in_progress olekus;
kaarti saab näidata ainult waiting_for_reveal olekus;
lõplikku süüdistust saab teha ainult in_progress olekus;
uut mängu saab alustada not_started või game_over olekus.
```

---

# Hilisem keerulisem olekumasin

Mitme mängija ja backendiga võib vaja minna rohkem olekuid:

```text
lobby
case_selection
dealing_cards
turn_start
choose_location
make_suggestion
resolve_suggestion
private_reveal
turn_end
accusation
game_over
player_disconnected
paused
```

MVP-s ei ole neid kõiki vaja.

---

# Algaja jaoks soovitus

Ära ehita kohe keerulist olekumasina teeki.

Kasuta alguses lihtsat stringi:

```ts
const [status, setStatus] = useState<GameStatus>("not_started");
```

Hiljem saab vajadusel kasutada keerukamat lahendust.
