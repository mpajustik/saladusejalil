# GAME_RULES.md

## Mängu nimi

**Saladuse Jälil**

---

## Mängu eesmärk

Mängijate eesmärk on esimesena õigesti välja selgitada:

```text
Kes oli juhtumiga seotud?
Kus juhtum toimus?
Milline ese või tõend oli juhtumiga seotud?
```

---

## Mängu kategooriad

Mängus on kolm põhikategooriat:

```text
Tegelased
Asukohad
Esemed või tõendid
```

Igas mängus valitakse salaja üks kaart igast kategooriast. Need kolm kaarti moodustavad lahenduse.

---

## Näide lahendusest

```text
Tegelane: Mari
Asukoht: Keemialabor
Ese/tõend: Mälupulk
```

See tähendab, et õige vastus oleks:

```text
Mari oli seotud juhtumiga keemialaboris ja oluline tõend oli mälupulk.
```

---

## Mängu ettevalmistus

1. Valitakse juhtum.
2. Süsteem võtab juhtumist kõik tegelased, asukohad ja esemed.
3. Süsteem valib juhuslikult:
   - ühe tegelase;
   - ühe asukoha;
   - ühe eseme.
4. Need kolm kaarti pannakse salajasse lahendusse.
5. Ülejäänud kaardid segatakse.
6. Ülejäänud kaardid jagatakse mängijatele.
7. Algab esimese mängija kord.

---

## Mängija kord

Oma käigul saab mängija teha ühe või mitu tegevust sõltuvalt mängu etapist.

MVP-s on põhitegevused:

```text
esita hüpotees;
vaata oma kaarte;
tee märkmeid;
tee lõplik süüdistus;
lõpeta kord.
```

Esimeses MVP-s ei pea veel olema täringut ega keerulist liikumist.

---

## Hüpotees

Hüpotees on oletus, mis koosneb kolmest osast:

```text
tegelane + asukoht + ese
```

Näide:

```text
Kas juhtumiga oli seotud Jaan, see toimus raamatukogus ja tõendiks oli võti?
```

---

## Hüpoteesi kontrollimine

Kui mängija esitab hüpoteesi, kontrollib süsteem järgmisi mängijaid järjekorras.

Näide mängijate järjekorrast:

```text
Mängija 1
Mängija 2
Mängija 3
```

Kui Mängija 1 esitab hüpoteesi, siis süsteem kontrollib:

```text
kõigepealt Mängija 2 kaarte;
seejärel Mängija 3 kaarte.
```

Kui mõnel mängijal on vähemalt üks hüpoteesis nimetatud kaart, saab ta näidata ühe sobiva kaardi.

---

## Kaardi näitamine

Kaardi näitamise reeglid:

```text
kaarti näidatakse ainult hüpoteesi esitanud mängijale;
teised mängijad näevad ainult seda, et kaart näidati;
kui mängijal on mitu sobivat kaarti, valib ta ühe;
kui kellelgi pole sobivat kaarti, saab hüpoteesi esitaja teada, et keegi ei saanud hüpoteesi ümber lükata.
```

---

## Detektiivimärkmik

Igal mängijal on oma märkmed.

Mängija saab iga kaardi kohta märkida näiteks:

```text
teadmata;
välistatud;
võimalik lahendus;
kindlasti mitte;
nähtud.
```

MVP-s võib kasutada lihtsamat varianti:

```text
? = teadmata
X = välistatud
! = võimalik lahendus
```

---

## Lõplik süüdistus

Kui mängija arvab, et ta teab lahendust, saab ta teha lõpliku süüdistuse.

Süüdistus koosneb kolmest valikust:

```text
tegelane;
asukoht;
ese.
```

Süsteem võrdleb süüdistust salajase lahendusega.

---

## Võit

Mängija võidab, kui kõik kolm osa on õiged.

```text
õige tegelane;
õige asukoht;
õige ese.
```

---

## Vale süüdistus

MVP-s on kaks võimalikku varianti.

### Lihtsam variant alguses

Vale süüdistus annab teate:

```text
See süüdistus oli vale. Mäng jätkub.
```

Mängija ei lange välja.

### Rangem variant hiljem

Vale süüdistuse teinud mängija ei saa enam võita, aga peab teiste küsimustele vastama.

MVP-s kasuta lihtsamat varianti, et testimine oleks lihtsam.

---

## Mängu lõpp

Mäng lõpeb, kui üks mängija teeb õige lõpliku süüdistuse.

Lõpus kuvatakse:

```text
võitja nimi;
õige lahendus;
mängu tegevuste lühikokkuvõte.
```

---

## Liikumise reegel MVP-s

Esimeses prototüübis ei kasutata täringut ega ruudustikku.

Aktiivne mängija saab hüpoteesis valida ükskõik millise asukoha.

Hiljem saab lisada:

```text
asukohtade võrgu;
liikumise ainult naaberruumidesse;
salakäigud;
täringu;
tegevuspunktid.
```

---

## Mängudisaini põhjendus

MVP keskendub mitte liikumisele, vaid deduktsioonile.

Oluline on saada tööle:

```text
salajane lahendus;
osaline info;
kaartide välistamine;
hüpoteeside kontroll;
lõplik süüdistus.
```

Kui need töötavad, saab hiljem lisada keerulisema mängulaua.
