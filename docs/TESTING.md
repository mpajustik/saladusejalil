# TESTING.md

## Eesmärk

See fail kirjeldab, kuidas mängu testida.

Alguses piisab käsitsi testimisest. Hiljem saab lisada automaattestid.

---

# Käsitsi testimise põhimõte

Pärast iga väikest arendussammu kontrolli brauseris, kas asi töötab.

Ära tee viit suurt muudatust ja alles siis testi.

---

# Etapp 1 testid

## Test 1: rakendus käivitub

Sammud:

```text
1. Käivita npm install.
2. Käivita npm run dev.
3. Ava brauseris localhosti aadress.
```

Oodatav tulemus:

```text
näed avalehte;
lehel on nimi "Saladuse Jälil";
konsoolis ei ole punaseid vigu.
```

---

## Test 2: juhtumi andmed kuvatakse

Sammud:

```text
1. Ava avaleht.
2. Vaata näidisjuhtumi infot.
```

Oodatav tulemus:

```text
näed juhtumi pealkirja;
näed tegelasi;
näed asukohti;
näed esemeid.
```

---

## Test 3: uus mäng loob lahenduse

Sammud:

```text
1. Vajuta "Alusta mängu".
2. Vaata arendaja debug-paneeli.
```

Oodatav tulemus:

```text
lahenduses on üks tegelane;
lahenduses on üks asukoht;
lahenduses on üks ese.
```

---

## Test 4: kaardid jagatakse õigesti

Sammud:

```text
1. Alusta mäng.
2. Vaata mängijate kaarte.
3. Vaata debug-paneelist lahendust.
```

Oodatav tulemus:

```text
lahenduse kaarte ei ole ühegi mängija käes;
kõik ülejäänud kaardid on jagatud;
ükski kaart ei kordu mitme mängija käes.
```

---

## Test 5: mängija kord liigub

Sammud:

```text
1. Alusta mäng.
2. Vajuta "Lõpeta kord".
3. Vajuta uuesti.
```

Oodatav tulemus:

```text
aktiivne mängija muutub õiges järjekorras.
```

---

## Test 6: hüpoteesi saab esitada

Sammud:

```text
1. Vali tegelane.
2. Vali asukoht.
3. Vali ese.
4. Vajuta "Esita hüpotees".
```

Oodatav tulemus:

```text
hüpotees ilmub tegevuste ajalukku;
süsteem kontrollib teiste mängijate kaarte.
```

---

## Test 7: sobiv kaart leitakse

Sammud:

```text
1. Tee hüpotees, mis sisaldab mõne teise mängija kaarti.
```

Oodatav tulemus:

```text
süsteem leiab mängija, kes saab kaarti näidata;
kuvatakse sobivad kaardid.
```

---

## Test 8: kaart näidatakse ainult küsijale

Sammud:

```text
1. Esita hüpotees.
2. Vali näidatav kaart.
3. Vaata tulemust.
```

Oodatav tulemus:

```text
küsija näeb kaardi nime;
tegevuste ajalugu ütleb teistele ainult, et kaart näidati;
teised ei näe kaardi nime.
```

---

## Test 9: märkmeid saab teha

Sammud:

```text
1. Ava detektiivimärkmik.
2. Muuda mõne kaardi märget.
```

Oodatav tulemus:

```text
märge muutub;
märge ei kao kohe ära.
```

---

## Test 10: vale süüdistus

Sammud:

```text
1. Tee teadlikult vale süüdistus.
```

Oodatav tulemus:

```text
mäng ütleb, et süüdistus oli vale;
mäng ei anna võitu.
```

---

## Test 11: õige süüdistus

Sammud:

```text
1. Vaata debug-paneelist õiget lahendust.
2. Tee sama süüdistus.
```

Oodatav tulemus:

```text
mäng lõpeb;
kuvatakse võitja;
kuvatakse õige lahendus.
```

---

# Automaatsete testide ideed

Hiljem saab testida mänguloogikat automaatselt.

## createSolution test

Kontrollib:

```text
lahenduses on üks kaart igast kategooriast;
lahendus ei ole tühi.
```

## dealCards test

Kontrollib:

```text
lahenduse kaarte ei jagata mängijatele;
kõik ülejäänud kaardid jagatakse;
kaart ei kordu.
```

## checkSuggestion test

Kontrollib:

```text
leitakse õige mängija, kes saab kaarti näidata;
sobivad kaardid on õiged;
kui kellelgi pole kaarti, tagastatakse null.
```

## checkAccusation test

Kontrollib:

```text
õige süüdistus tagastab true;
vale süüdistus tagastab false.
```

---

# Testimise reegel AI-le

Pärast iga muudatust peab AI kirjutama:

```text
Kuidas testida:
1. käivita ...
2. ava ...
3. vajuta ...
4. oodatav tulemus on ...
```

Kui AI seda ei kirjuta, küsi eraldi.
