# PROJECT_BRIEF_FOR_AI.md

## Lühike lähteülesanne AI-arendajale

Loo veebimäng nimega **Saladuse Jälil**.

See on Cluedo-st inspireeritud, kuid originaalse sisu, nime ja maailmaga deduktsioonimäng.

Mängijad peavad välja selgitama:

```text
kes oli juhtumiga seotud;
kus juhtum toimus;
milline ese või tõend oli oluline.
```

---

## MVP

Esimene töötav versioon peab olema ühe seadme prototüüp.

MVP peab sisaldama:

```text
üks näidisjuhtum;
kolm kategooriat;
salajane lahendus;
kaartide jagamine mängijatele;
hüpoteesi esitamine;
hüpoteesi kontrollimine;
salajane kaardi näitamine;
lihtne detektiivimärkmik;
lõplik süüdistus;
mängu lõpp.
```

---

## Arendaja peab arvestama

Kasutaja on algaja.

Seetõttu:

```text
selgita lihtsalt;
tee väikseid samme;
ära lisa mitut suurt asja korraga;
iga sammu lõpus ütle, mida tehti;
iga sammu lõpus anna testimisjuhis.
```

---

## Esimeses etapis ei tohi teha

```text
backendit;
andmebaasi;
WebSocketit;
kontosid;
admin-paneeli;
PWA-d;
makseid;
keerulist animatsiooni;
3D-graafikat.
```

---

## Kõige esimene arendussamm

Kõige esimene samm on ainult projekti käivituv alus.

See tähendab:

```text
React + TypeScript + Vite projekt;
avalehel mängu nimi;
lühikirjeldus;
nupp "Alusta mängu";
lihtne CSS.
```

Mänguloogikat ei lisata veel esimeses mikrosammus.

---

## Edukriteerium

Projekt liigub õigesti, kui kasutaja saab pärast iga väikest sammu brauseris midagi kontrollida.
