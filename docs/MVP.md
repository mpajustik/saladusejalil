# MVP.md

## MVP tähendus

MVP tähendab kõige väiksemat töötavat versiooni.

See ei ole lõplik mäng. See on esimene versioon, millega saab kontrollida, kas mängu põhiloogika töötab.

---

## MVP eesmärk

Luua töötav ühe seadme prototüüp, kus saab mängida lihtsustatud deduktsioonimängu ühe valmis juhtumiga.

MVP peab sisaldama:

```text
üks juhtum;
kolm kategooriat;
salajane lahendus;
kaartide jagamine;
mängijate kord;
hüpoteesi esitamine;
salajane kaardi näitamine;
detektiivimärkmik;
lõplik süüdistus;
võidu või kaotuse kontroll.
```

---

## MVP ei sisalda

MVP-s ei ole:

```text
backendit;
andmebaasi;
kasutajakontosid;
mitme seadme reaalajas mängu;
admin-paneeli;
PWA-d;
makseid;
avalikku juhtumite kogu;
keerulist animatsiooni;
tehisintellekti;
chat'i.
```

Need tulevad hilisemates etappides.

---

## MVP mängijate arv

Esimese versiooni jaoks kasuta fikseeritud mängijate arvu.

Soovitus:

```text
3 mängijat
```

Põhjus:

- lihtne testida;
- piisavalt mängijaid kaartide jagamiseks;
- loogika on sarnane päris mitme mängijaga mängule.

Hiljem saab lisada 2–6 mängija toe.

---

## MVP esimene juhtum

Juhtum:

```text
Kadunud Leiutise Juhtum
```

Kategooriad:

```text
Tegelased
Asukohad
Esemed/tõendid
```

Igas kategoorias võiks MVP-s olla 6 kaarti.

Kokku:

```text
6 tegelast
6 asukohta
6 eset
= 18 kaarti
```

Salajasse lahendusse pannakse:

```text
1 tegelane
1 asukoht
1 ese
```

Ülejäänud 15 kaarti jagatakse mängijatele.

---

## MVP kasutajavoog

```text
1. Kasutaja avab mängu.
2. Kasutaja vajutab "Alusta uut mängu".
3. Süsteem loob salajase lahenduse.
4. Süsteem jagab ülejäänud kaardid mängijatele.
5. Kasutaja valib aktiivse mängija vaate.
6. Aktiivne mängija esitab hüpoteesi.
7. Süsteem kontrollib, kas teistel mängijatel on hüpoteesiga sobivaid kaarte.
8. Sobiv mängija saab valida ühe kaardi, mida näidata.
9. Küsija näeb salaja näidatud kaarti.
10. Mängija teeb märkmeid.
11. Kord liigub järgmisele mängijale.
12. Mängija saab teha lõpliku süüdistuse.
13. Süsteem kontrollib vastust.
14. Õige vastuse korral mäng lõpeb.
```

---

## MVP ekraanid

MVP jaoks piisab järgmistest vaadetest:

```text
Avaleht
Mängu vaade
Minu kaardid
Hüpoteesi vorm
Kaardi näitamise vaade
Detektiivimärkmik
Lõpliku süüdistuse vorm
Mängu lõpu vaade
```

Neid ei pea tegema eraldi URL-idena. Alguses võivad need olla sama lehe erinevad komponendid.

---

## MVP minimaalne disain

Disain peab olema:

- lihtne;
- loetav;
- telefonis kasutatav;
- ilma keerulise graafikata.

Esimeses versioonis ei ole vaja:

- 3D-mõisa;
- tegelaste pilte;
- animatsioone;
- keerulist lauaplaani.

---

## MVP edukriteeriumid

MVP on valmis, kui:

```text
uue mängu alustamine töötab;
salajane lahendus tekib õigesti;
kaartide jagamine töötab;
mängijad saavad kordamööda hüpoteese teha;
hüpoteesi peale leitakse sobivad kaardid;
kaarti saab näidata ainult küsijale;
mängija saab teha lõpliku süüdistuse;
õige süüdistus lõpetab mängu võiduga;
vale süüdistus annab arusaadava tagasiside;
mäng töötab nii arvutis kui telefonis brauseris.
```

---

## MVP teststsenaarium

Testi käsitsi:

```text
1. Alusta uut mängu.
2. Vaata, kas igal mängijal on kaardid.
3. Kontrolli, et salajase lahenduse kaarte ei ole mängijate käes.
4. Tee hüpotees ühe mängijana.
5. Kontrolli, kas süsteem leiab sobiva kaardi.
6. Näita kaarti.
7. Kontrolli, kas ainult küsija näeb seda.
8. Tee vale süüdistus.
9. Kontrolli, kas mäng ei lõpe valesti võiduga.
10. Tee õige süüdistus.
11. Kontrolli, kas mäng lõpeb.
```

---

## MVP lõpu kokkuvõtte nõue

Kui AI lõpetab MVP osa, peab ta kirjutama:

```text
Mis valmis sai?
Millised failid loodi?
Millised failid muudeti?
Kuidas käivitada?
Kuidas testida?
Mis on teadaolevad piirangud?
Mis on järgmine väikseim samm?
```
