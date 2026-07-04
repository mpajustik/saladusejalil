# BEGINNER_GUIDE.md

## Kellele see fail on mõeldud?

See fail on mõeldud algajale arendajale, kes kasutab Claude Code’i või Codexit ja tahab mängu samm-sammult valmis teha.

Eesmärk ei ole kõike korraga mõista. Eesmärk on liikuda väikeste sammudega.

---

## Kõige tähtsam reegel

Ära tee korraga liiga palju.

Iga arendussamm peab vastama kolmele küsimusele:

```text
1. Mida me täpselt teeme?
2. Kuidas ma saan kontrollida, et see töötab?
3. Mida ei tohi selles sammus veel teha?
```

---

## Kuidas AI-arendajaga töötada?

Kasuta seda tööstiili:

```text
1. Anna AI-le üks väike ülesanne.
2. Palu tal enne koodi kirjutamist öelda plaan.
3. Kui plaan on liiga suur, lase väiksemaks teha.
4. Luba tal kood kirjutada.
5. Käivita projekt ise.
6. Kopeeri veateade AI-le.
7. Paranda ainult see viga.
8. Kui töötab, palu kokkuvõtet.
9. Alles siis liigu edasi.
```

---

## Mida teha, kui tekib viga?

Ära kirjuta lihtsalt:

```text
Ei tööta.
```

Kirjuta parem:

```text
Käivitasin käsu npm run dev.
Brauseris avaneb aadress http://localhost:5173.
Ekraanile tuleb tühi leht.
Terminalis on selline veateade:
[kleebi siia täpne veateade]

Palun selgita lihtsas keeles, mida see tähendab, ja paranda ainult see viga.
```

---

## Mida teha, kui AI teeb liiga palju?

Kasuta seda lauset:

```text
Peatu. See on liiga suur muudatus. Tee ainult järgmine väike samm. Ära lisa uusi tehnoloogiaid ega järgmise etapi funktsioone.
```

---

## Mida iga etapi lõpus AI-lt küsida?

Pärast iga arendusetappi küsi:

```text
Tee lühike kokkuvõte:
1. Mis valmis sai?
2. Milliseid faile muudeti?
3. Kuidas ma saan seda testida?
4. Mis jäi tegemata?
5. Mis on järgmine kõige väiksem samm?
```

---

## Hea arendussamm on selline

Hea samm:

```text
Lisa mängijate nimekirja kuvamine.
```

Liiga suur samm:

```text
Tee kogu multiplayer mäng valmis koos backendiga.
```

Hea samm:

```text
Lisa üks näidisjuhtum TypeScripti objektina.
```

Liiga suur samm:

```text
Tee admin-paneel, andmebaas ja juhtumite avaldamise süsteem.
```

---

## Kuidas aru saada, et MVP liigub õigesti?

MVP liigub õigesti, kui iga paari sammu järel saad brauseris midagi proovida.

Näiteks:

- näen avalehte;
- saan alustada mängu;
- näen mängijaid;
- näen oma kaarte;
- saan hüpoteesi valida;
- näen, kas keegi saab kaarti näidata;
- saan teha lõpliku süüdistuse.

Kui mitu päeva läheb nii, et midagi brauseris proovida ei saa, on sammud liiga suured.

---

## Algaja töövoog

Soovituslik töövoog:

```text
1. Ava projekt kaustas.
2. Ava terminal.
3. Käivita npm install.
4. Käivita npm run dev.
5. Ava brauseris localhosti aadress.
6. Tee üks väike muudatus.
7. Salvesta failid.
8. Kontrolli brauseris.
9. Tee git commit.
```

Kui Git on alguses keeruline, võib selle hiljem lisada, aga soovituslik on õppida vähemalt:

```text
git status
git add .
git commit -m "kirjeldus"
```

---

## Algaja jaoks soovitatav esimene eesmärk

Ära mõtle kohe kogu mängu peale.

Esimene eesmärk:

```text
Ekraanil on nupp "Alusta mängu".
Kui vajutan nuppu, luuakse üks salajane lahendus ja jagatakse kaardid kolmele mängijale.
Ekraanil kuvatakse mängijad ja ühe valitud mängija kaardid.
```

Kui see töötab, on projekti alus olemas.
