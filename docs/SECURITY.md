# SECURITY.md

## Eesmärk

See fail kirjeldab turvalisuse ja ausa mängu põhimõtteid.

MVP ühe seadme prototüüp ei ole veel päriselt turvaline, aga hiljem mitme mängija versioonis on turvalisus väga oluline.

---

# Peamine risk

Deduktsioonimängus on kõige suurem risk salajase info lekkimine.

Salajane info:

```text
õige lahendus;
teiste mängijate kaardid;
teiste mängijate märkmed;
millist kaarti täpselt kellelegi näidati.
```

---

# Etapp 1 turvalisus

Etapp 1 on ühe seadme prototüüp.

Seal võib tehniliselt olla kogu info brauseris olemas.

See on lubatud, sest eesmärk on mänguloogika testimine.

Aga kasutajaliideses peab olema selgelt eristatud:

```text
tavavaade;
debug-vaade.
```

Debug-vaade võib näidata salajast lahendust ainult arendamise ajal.

Enne päris mängimist tuleb debug-vaade peita.

---

# Etapp 2 ja 3 turvalisus

Kui mäng on mitmes seadmes, peab salajane info olema serveris.

Frontend ei tohi saada:

```text
salajast lahendust;
teiste mängijate kaarte;
kogu game object'i.
```

Frontend peab saama ainult:

```text
avaliku mänguseisu;
konkreetse mängija privaatse seisu.
```

---

# Server on tõe allikas

Klient ei otsusta:

```text
kas on mängija kord;
kas hüpotees on lubatud;
kas kaart sobib näitamiseks;
kas süüdistus on õige;
kas mäng lõppes.
```

Server otsustab.

Klient ainult saadab soovi:

```text
soovin esitada hüpoteesi;
soovin näidata seda kaarti;
soovin teha süüdistuse.
```

---

# Ruumikoodid

Mängutoa kood peab olema piisavalt juhuslik.

Halb:

```text
1234
```

Parem:

```text
A7KD
K9P2
M4QX
```

Veel parem hiljem:

```text
6-kohaline kood
```

---

# Mängija identiteet

MVP-s piisab mängija nimest.

Mitme seadme versioonis peaks olema:

```text
playerId;
sessionToken;
roomCode.
```

Session token aitab mängijal katkestuse järel tagasi tulla.

---

# Sisendi valideerimine

Kõik kasutaja sisendid tuleb kontrollida.

Näited:

```text
mängija nimi ei tohi olla tühi;
mängija nimi ei tohi olla liiga pikk;
ruumikood peab olema õiges formaadis;
kaart peab päriselt olemas olema;
hüpoteesi kaardid peavad kuuluma valitud juhtumisse.
```

---

# Admin-paneeli riskid

Kui kasutaja saab ise juhtumeid lisada, tuleb vältida:

```text
liiga pikki tekste;
tühje välju;
katkiseid ID-sid;
HTML/JavaScript sisestamist tekstiväljadesse;
vigaseid juhtumeid.
```

Näita kasutaja loodud tekste alati tekstina, mitte HTML-ina.

---

# Andmebaasi riskid

Kui lisada PostgreSQL või muu andmebaas:

```text
kasuta ORM-i või parameetritega päringuid;
ära koosta SQL päringuid stringide liitmisega;
hoia paroolid .env failis;
ära pane .env faili GitHubi.
```

---

# Keskkonnamuutujad

Näited:

```text
DATABASE_URL
JWT_SECRET
SERVER_PORT
CLIENT_URL
```

Fail `.env` peab olema `.gitignore` sees.

---

# Õigused

Tulevikus on vaja rolle:

```text
mängija;
mängujuht;
admin;
juhtumi autor.
```

MVP-s pole kontosid vaja.

---

# Praktiline kontrollnimekiri

Enne mitme mängija versiooni avaldamist kontrolli:

```text
kas lahendus tuleb ainult serverist ja ainult mängu lõpus;
kas teise mängija kaarte ei saadeta minu brauserisse;
kas privaatne reveal sündmus läheb ainult õigele mängijale;
kas vale mängija ei saa käiku teha;
kas vale mängija ei saa kaarti näidata;
kas ruumikoodita ei pääse mängu;
kas katkestuse järel ei teki topeltmängijat.
```
