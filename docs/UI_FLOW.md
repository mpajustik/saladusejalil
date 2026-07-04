# UI_FLOW.md

## Eesmärk

See fail kirjeldab, milliseid ekraane ja komponente mäng vajab.

Alguses võib kõik olla ühel lehel. Hiljem saab jagada eraldi vaadeteks.

---

# MVP põhivaated

## 1. Avaleht

Eesmärk:

```text
tutvustada mängu;
anda nupp uue mängu alustamiseks.
```

Sisu:

```text
mängu nimi;
lühikirjeldus;
nupp "Alusta uut mängu";
hiljem nupp "Liitu mänguga";
hiljem nupp "Juhtumid".
```

MVP-s piisab:

```text
Saladuse Jälil
Alusta uut mängu
```

---

## 2. Mängu ettevalmistuse vaade

Eesmärk:

```text
näidata valitud juhtumit;
näidata mängijaid;
lubada mängu alustamist.
```

MVP-s võib mängijaid olla fikseeritult kolm.

Sisu:

```text
juhtumi pealkiri;
juhtumi kirjeldus;
mängijate nimekiri;
nupp "Jaga kaardid ja alusta".
```

---

## 3. Mängu põhivaade

Eesmärk:

```text
anda ülevaade mängu seisust.
```

Sisu:

```text
kelle kord on;
mängijate nimekiri;
aktiivse mängija tegevused;
viimased sündmused;
nupp "Lõpeta kord".
```

---

## 4. Aktiivse mängija vaade

Eesmärk:

```text
aktiivne mängija saab tegutseda.
```

Sisu:

```text
aktiivse mängija nimi;
tema kaardid;
hüpoteesi vorm;
lõpliku süüdistuse vorm;
detektiivimärkmik.
```

Ühe seadme MVP-s peab olema selge hoiatus:

```text
Näita seda vaadet ainult aktiivsele mängijale.
```

Hiljem, mitme seadme versioonis, näeb iga mängija oma telefonis ainult enda infot.

---

## 5. Minu kaardid

Eesmärk:

```text
näidata mängijale tema käes olevaid kaarte.
```

Kaardid jaotatakse kategooriatesse:

```text
Tegelased
Asukohad
Esemed/tõendid
```

Kaardi peal võiks olla:

```text
nimi;
tüüp;
lühikirjeldus.
```

---

## 6. Hüpoteesi vorm

Eesmärk:

```text
mängija saab teha oletuse.
```

Vormis on kolm valikut:

```text
tegelane;
asukoht;
ese/tõend.
```

Nupp:

```text
Esita hüpotees
```

Pärast hüpoteesi esitamist kuvatakse:

```text
kes peab kaarti näitama;
või teade, et keegi ei saanud hüpoteesi ümber lükata.
```

---

## 7. Kaardi näitamise vaade

Eesmärk:

```text
üks mängija valib, millist kaarti küsijale näidata.
```

Sisu:

```text
hüpoteesi tekst;
sobivad kaardid;
nupp iga sobiva kaardi juures;
kinnitus, et kaart näidati.
```

Näide:

```text
Mängija 1 küsis:
Mari + Keemialabor + Mälupulk

Mängija 2 saab näidata:
Mari
Mälupulk
```

---

## 8. Salajase näidatud kaardi vaade

Eesmärk:

```text
küsija näeb, millist kaarti talle näidati.
```

Sisu:

```text
Sulle näidati kaart:
Mälupulk
```

Oluline:

```text
teised mängijad ei tohiks seda näha.
```

Ühe seadme prototüübis saab kasutada nuppu:

```text
Peida kaart ja jätka
```

---

## 9. Detektiivimärkmik

Eesmärk:

```text
mängija saab jälgida, millised kaardid on välistatud.
```

Lihtne tabel:

```text
Kaart | Tüüp | Märge
```

Märge:

```text
? teadmata
X välistatud
! võimalik
```

Telefonis võib tabeli asemel kasutada kaardiloendit.

---

## 10. Lõpliku süüdistuse vorm

Eesmärk:

```text
mängija saab pakkuda lõpliku lahenduse.
```

Vorm:

```text
tegelane;
asukoht;
ese/tõend;
nupp "Tee lõplik süüdistus".
```

Pärast vajutamist:

```text
kui õige, mäng lõpeb;
kui vale, näita tagasisidet.
```

---

## 11. Mängu lõpu vaade

Eesmärk:

```text
näidata võitjat ja õiget lahendust.
```

Sisu:

```text
võitja nimi;
õige tegelane;
õige asukoht;
õige ese;
nupp "Alusta uus mäng".
```

---

# Telefonivaate põhimõtted

Telefonis ei tohi kõike korraga näidata.

Soovituslik alumine menüü hiljem:

```text
Laud
Kaardid
Märkmik
Tegevus
Info
```

MVP-s piisab sellest, et sektsioonid on üksteise all ja nupud suured.

---

# Arvutivaate põhimõtted

Arvutis saab kasutada kahe veeru paigutust:

```text
vasakul: mängu seis ja tegevused;
paremal: kaardid ja märkmed.
```

---

# UI prioriteedid

Olulisuse järjekord:

```text
1. arusaadavus;
2. mänguloogika nähtavus;
3. telefonis kasutatavus;
4. ilus kujundus;
5. animatsioonid.
```

Animatsioonid ei ole MVP jaoks vajalikud.
