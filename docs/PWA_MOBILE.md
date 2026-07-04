# PWA_MOBILE.md

## Eesmärk

See fail kirjeldab telefoni ja PWA kogemuse põhimõtteid.

See kuulub etappi 6.

Etapp 1 peab olema juba telefonis enam-vähem kasutatav, aga PWA lisatakse hiljem.

---

# Telefonikogemuse põhimõtted

Telefonis peab mäng olema:

```text
loetav;
vajutatav;
lihtsalt navigeeritav;
ilma liiga laiade tabeliteta;
selgete tegevusnuppudega.
```

---

# Mobile-first reeglid

## 1. Nupud peavad olema suured

Halb:

```text
väike tekstilink
```

Hea:

```text
suur nupp, millel on selge tekst
```

---

## 2. Ära näita kõike korraga

Telefonis võiks info jagada sektsioonideks:

```text
Laud
Kaardid
Märkmik
Tegevus
Info
```

MVP-s võib kõik olla ühel lehel, aga pikemas plaanis on alumine navigeerimine parem.

---

## 3. Vormi valikud peavad olema lihtsad

Hüpoteesi vormis on kolm valikut:

```text
tegelane;
asukoht;
ese.
```

Telefonis võiks iga valik olla suur dropdown või kaardinuppude valik.

---

## 4. Tabelid võivad telefonis halvasti töötada

Detektiivimärkmik võib arvutis olla tabel.

Telefonis võiks olla kaardiloend:

```text
Mari
[?] [X] [!]

Jaan
[?] [X] [!]
```

---

# PWA eesmärk

PWA tähendab, et veebirakendus käitub osaliselt nagu äpp.

Kasutaja saab selle telefoni avaekraanile lisada.

---

# PWA vajalikud osad

## manifest.webmanifest

Sisaldab:

```text
rakenduse nimi;
lühinimi;
ikoonid;
algusaadress;
display mode;
teemavärv.
```

Näide:

```json
{
  "name": "Saladuse Jälil",
  "short_name": "Saladus",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1f2937",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Service worker

Service worker võimaldab staatilisi faile vahemällu salvestada.

Oluline piirang:

```text
reaalajas multiplayer ei saa täielikult offline töötada.
```

Offline võib töötada:

```text
avaleht;
reeglid;
juhtumite lugemine;
ühe seadme harjutusrežiim.
```

---

# PWA lisamise järjekord

Ära lisa PWA-d enne, kui mäng töötab.

Õige järjekord:

```text
1. mänguloogika töötab;
2. UI töötab telefonis;
3. build töötab;
4. lisatakse manifest;
5. lisatakse ikoonid;
6. lisatakse service worker;
7. testitakse Lighthouse'iga.
```

---

# Telefonivaate testimine

Kontrolli:

```text
kas avaleht mahub ekraanile;
kas nuppe saab pöidlaga vajutada;
kas tekst on loetav;
kas hüpoteesi vormi saab kasutada;
kas märkmeid saab muuta;
kas mängu lõpu vaade on selge.
```

---

# Tuleviku mobile UX

Hiljem võiks telefonivaade olla selline:

```text
Alumine menüü:
- Mäng
- Kaardid
- Märkmed
- Hüpotees
- Süüdistus
```

Aktiivse mängija telefonis võiks põhiekraan näidata ainult järgmist kõige olulisemat tegevust.

---

# Reaalajas ühenduse olek

Mitme mängija telefoniversioonis peab kasutaja nägema:

```text
ühendatud;
ühendus katkes;
taasühendamine;
mänguga tagasi liidetud.
```

See vähendab segadust, kui telefon läheb lukku või internet katkeb.
