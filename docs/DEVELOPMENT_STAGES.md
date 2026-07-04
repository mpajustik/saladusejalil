# DEVELOPMENT_STAGES.md

## Ülevaade

Projekt on jagatud kuueks etapiks.

Iga etapp peab olema väikesteks alamülesanneteks jaotatud. Ühtegi etappi ei tohi teha ühe suure käsuna.

---

# Etapp 1: ühe seadme prototüüp

## Eesmärk

Luua kõige lihtsam töötav versioon, mida saab mängida ühes brauseriaknas.

## Sisaldab

```text
React + TypeScript + Vite projekt
üks näidisjuhtum
mängijate loomine
salajase lahenduse genereerimine
kaartide jagamine
mängijate kord
hüpoteesi esitamine
kaardi näitamise loogika
lõplik süüdistus
lihtne märkmete süsteem
```

## Ei sisalda

```text
backendit
WebSocketit
andmebaasi
kontosid
PWA-d
admin-paneeli
```

## Väikesed sammud

### Samm 1.1: projekti loomine

Teha:

```text
loo React + TypeScript + Vite projekt;
käivita projekt;
kuva avalehel mängu nimi.
```

Kontroll:

```text
npm run dev töötab;
brauseris on näha "Saladuse Jälil".
```

Etapi lõpus AI kirjutab:

```text
Loodi projekti tehniline põhi. Rakendus käivitub ja avaleht kuvatakse.
```

---

### Samm 1.2: näidisjuhtumi andmed

Teha:

```text
loo üks näidisjuhtum;
lisa tegelased, asukohad ja esemed;
kuva need arendaja vaates ekraanil.
```

Kontroll:

```text
ekraanil on näha kõik tegelased, asukohad ja esemed.
```

---

### Samm 1.3: uue mängu alustamine

Teha:

```text
lisa nupp "Alusta mängu";
nupu vajutamisel luuakse salajane lahendus;
lahendus võetakse ühest tegelasest, ühest asukohast ja ühest esemest.
```

Kontroll:

```text
iga uus mäng loob lahenduse;
lahenduses on täpselt 3 kaarti.
```

Alguses võib arendaja vaates lahendust näidata, et testimine oleks lihtne. Hiljem peidetakse see ära.

---

### Samm 1.4: kaartide jagamine

Teha:

```text
eemalda lahenduse kaardid pakist;
jaga ülejäänud kaardid mängijatele;
kuva iga mängija kaardid testvaates.
```

Kontroll:

```text
lahenduse kaarte ei ole ühegi mängija käes;
kõik ülejäänud kaardid on jagatud.
```

---

### Samm 1.5: mängija kord

Teha:

```text
lisa aktiivse mängija mõiste;
kuva, kelle kord on;
lisa nupp "Lõpeta kord".
```

Kontroll:

```text
kord liigub mängijalt 1 mängijale 2 ja siis edasi.
```

---

### Samm 1.6: hüpoteesi esitamine

Teha:

```text
aktiivne mängija saab valida tegelase, asukoha ja eseme;
süsteem loob hüpoteesi;
hüpotees salvestatakse tegevuste ajalukku.
```

Kontroll:

```text
hüpotees kuvatakse ekraanil;
tegevuste ajalugu näitab tehtud hüpoteesi.
```

---

### Samm 1.7: kaardi näitamise loogika

Teha:

```text
süsteem kontrollib järjekorras järgmisi mängijaid;
leiab esimese mängija, kellel on vähemalt üks hüpoteesis nimetatud kaart;
kui sobivaid kaarte on mitu, saab see mängija valida ühe;
valitud kaart näidatakse ainult küsijale.
```

Kontroll:

```text
küsija näeb näidatud kaarti;
teised mängijad ei näe kaarti;
kui kellelgi pole kaarti, kuvatakse "keegi ei saanud ümber lükata".
```

---

### Samm 1.8: detektiivimärkmik

Teha:

```text
lisa iga mängija jaoks märkmete tabel;
mängija saab märkida kaarte staatusega: teadmata, välistatud, võimalik;
mängija enda kaardid märgitakse automaatselt välistatuks.
```

Kontroll:

```text
märkmeid saab muuta;
märkmed püsivad mängu ajal.
```

---

### Samm 1.9: lõplik süüdistus

Teha:

```text
aktiivne mängija saab valida lõpliku süüdistuse;
süsteem võrdleb süüdistust salajase lahendusega;
õige vastus lõpetab mängu;
vale vastus annab tagasiside.
```

Kontroll:

```text
õige vastus annab võidu;
vale vastus ei anna võitu.
```

---

### Samm 1.10: telefoni jaoks lihtne kujundus

Teha:

```text
muuda kujundus kitsal ekraanil kasutatavaks;
kasuta suuri nuppe;
väldi liiga laiu tabeleid;
lisa lihtsad vahekaardid või sektsioonid.
```

Kontroll:

```text
mäng on telefonibrauseris kasutatav.
```

---

# Etapp 2: mitme mängija ruumikoodiga versioon

## Eesmärk

Mängijad saavad liituda mängutoaga eraldi seadmetest, aga reaalajas keerukus võib alguses olla minimaalne.

## Sisaldab

```text
backend;
mängutoa loomine;
ruumikood;
mängijate liitumine;
mänguseisu hoidmine serveris;
iga mängija näeb ainult oma infot.
```

## Väikesed sammud

```text
2.1 Loo lihtne Node.js backend.
2.2 Loo API mängutoa loomiseks.
2.3 Loo API mänguga liitumiseks.
2.4 Loo mänguseisu küsimise API.
2.5 Loo mängija privaatse seisu API.
2.6 Ühenda frontend backendiga.
2.7 Lisa võimalus katkestuse järel tagasi liituda.
```

## Etapi lõpu kontroll

```text
üks mängija loob ruumi;
teine mängija liitub ruumikoodiga;
mõlemad näevad mängu avalikku seisu;
iga mängija näeb ainult oma kaarte.
```

---

# Etapp 3: reaalajas WebSocket versioon

## Eesmärk

Kõik mängijad näevad mänguseisu muutusi kohe ilma lehte värskendamata.

## Sisaldab

```text
Socket.IO või WebSocket;
mängutoa kanalid;
käigu alguse teated;
hüpoteesi teated;
kaardi näitamise privaatsed teated;
mängu lõpu teated.
```

## Väikesed sammud

```text
3.1 Lisa Socket.IO serverisse.
3.2 Ühenda frontend Socket.IO kliendiga.
3.3 Saada mängijate liitumise sündmus.
3.4 Saada käigu muutumise sündmus.
3.5 Saada hüpoteesi sündmus.
3.6 Saada privaatne kaardi näitamise sündmus ainult õigele mängijale.
3.7 Lisa reconnect-loogika.
```

## Etapi lõpu kontroll

```text
mänguseis uueneb kõigil seadmetel;
privaatsed kaardid ei leki teistele;
katkestuse järel saab mängija tagasi liituda.
```

---

# Etapp 4: juhtumite lisamine JSON-failidest

## Eesmärk

Mängumootor ei sõltu ühest juhtumist. Uusi juhtumeid saab lisada andmefailidena.

## Sisaldab

```text
case JSON formaat;
mitme juhtumi laadimine;
juhtumi valimine;
juhtumi valideerimine;
veateated vigase juhtumi korral.
```

## Väikesed sammud

```text
4.1 Defineeri juhtumi TypeScripti tüüp.
4.2 Loo esimene case JSON.
4.3 Loo teine testjuhtum.
4.4 Lisa juhtumite nimekiri.
4.5 Lisa juhtumi valimine enne mängu algust.
4.6 Lisa valideerimine.
4.7 Kirjuta juhend uue juhtumi lisamiseks.
```

## Etapi lõpu kontroll

```text
saab valida vähemalt kahe juhtumi vahel;
mäng töötab mõlema juhtumiga;
vigane juhtum annab arusaadava veateate.
```

---

# Etapp 5: admin-paneel juhtumite loomiseks

## Eesmärk

Kasutaja saab veebis uusi juhtumeid luua ja muuta.

## Sisaldab

```text
admin-vaade;
tegelaste lisamine;
asukohtade lisamine;
esemete lisamine;
juhtumi eelvaade;
valideerimine;
salvestamine.
```

## Väikesed sammud

```text
5.1 Loo admin avaleht.
5.2 Loo juhtumi üldandmete vorm.
5.3 Loo tegelaste lisamise vorm.
5.4 Loo asukohtade lisamise vorm.
5.5 Loo esemete lisamise vorm.
5.6 Lisa juhtumi valideerimine.
5.7 Lisa salvestamine localStorage'isse.
5.8 Hiljem lisa salvestamine andmebaasi.
```

## Etapi lõpu kontroll

```text
kasutaja saab luua uue juhtumi;
juhtum läbib kontrolli;
juhtumit saab mängus valida.
```

---

# Etapp 6: PWA ja telefonikogemus

## Eesmärk

Mäng töötab telefonis mugavalt ja seda saab lisada avaekraanile.

## Sisaldab

```text
responsive UI;
mobile-first kujundus;
PWA manifest;
service worker;
ikoonid;
offline staatiliste failide vahemälu;
installimise juhis.
```

## Väikesed sammud

```text
6.1 Paranda telefoni põhivaadet.
6.2 Lisa alumine navigeerimine: Laud, Kaardid, Märkmik, Tegevus.
6.3 Lisa PWA manifest.
6.4 Lisa rakenduse ikoonid.
6.5 Lisa service worker.
6.6 Testi Lighthouse'iga.
6.7 Kirjuta kasutajajuhend telefoni avaekraanile lisamiseks.
```

## Etapi lõpu kontroll

```text
telefonis on mugav mängida;
nupud on piisavalt suured;
rakendus on installitav;
staatilised failid laetakse kiiresti;
reaalajas mängu puhul on selgelt näha, kui ühendus katkeb.
```
