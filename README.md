# Saladuse Jälil

**Saladuse Jälil** on Cluedo-st inspireeritud, kuid oma nime, maailma ja sisuga deduktsioonimängu veebirakendus.

Mängijad peavad välja selgitama:

1. **Kes** oli juhtumiga seotud?
2. **Kus** juhtum toimus?
3. **Milline ese või tõend** oli juhtumiga seotud?

Oluline: see projekt ei tohi kopeerida Cluedo nime, tegelasi, ruume, tekste, kujundust ega kaubamärki. Me teeme oma originaalse mängu, mille põhimehhanism on deduktsioon ja välistamine.

---

## Projekti eesmärk

Luua töötav veebimängu MVP, mida saab mängida arvutis ja telefonis.

Esimese suurema eesmärgina peab valmima:

- ühe seadme prototüüp;
- üks valmis juhtum;
- kolm kategooriat: tegelased, asukohad, esemed/tõendid;
- salajane lahendus;
- kaartide jagamine mängijatele;
- hüpoteeside esitamine;
- salajane kaardi näitamine;
- lõplik süüdistus;
- lihtne detektiivimärkmik;
- hiljem võimalus lisada uusi juhtumeid.

---

## Algaja jaoks oluline põhimõte

Ära lase AI-arendajal kogu mängu korraga valmis teha.

Töö peab käima väikeste etappidena:

1. tee üks väike osa valmis;
2. käivita projekt;
3. kontrolli brauseris;
4. paranda vead;
5. kirjuta lühike kokkuvõte, mida tehti;
6. alles siis liigu järgmise osa juurde.

---

## Soovituslik tehnoloogiapakk

Esialgne soovitus:

- Frontend: React + Vite + TypeScript
- Stiil: tavaline CSS
- Andmed: alguses JSON või TypeScripti objektid
- Salvestus: alguses brauseri state, hiljem localStorage
- Hiljem mitme mängija jaoks: Node.js backend + Socket.IO + PostgreSQL

MVP algab lihtsamalt: **ilma backendita ühe seadme prototüübina**.

---

## Arendusetapid

Projekt on jaotatud kuueks suureks etapiks:

1. Ühe seadme prototüüp
2. Mitme mängija ruumikoodiga versioon
3. Reaalajas WebSocket versioon
4. Juhtumite lisamine JSON-failidest
5. Admin-paneel juhtumite loomiseks
6. PWA ja telefonikogemus

Kõik etapid on kirjeldatud failis:

`docs/DEVELOPMENT_STAGES.md`

---

## Failide kasutamine Claude Code’i või Codexiga

Soovituslik esimene käsk AI-arendajale:

```text
Loe kõik projekti juurkaustas ja docs kaustas olevad .md failid läbi. Ära kirjuta veel koodi. Tee kõigepealt lühike kokkuvõte, mida projektiga ehitame, mis on MVP, millised on arendusetapid ja milline on esimene kõige väiksem tehniline samm. Seejärel küsi minult kinnitust enne koodi kirjutamist.
```

Kui AI on kokkuvõtte teinud, anna järgmine käsk:

```text
Alusta ainult etapiga 1. Tee ühe seadme prototüübi kõige esimene töötav versioon. Ära lisa backendit, kontosid, WebSocketit, andmebaasi ega PWA-d. Loo ainult minimaalne React + TypeScript + Vite rakendus, kus saab alustada uut mängu ühe näidisjuhtumiga ja näha mängijaid, kaarte ning salajase lahenduse loogikat arendaja vaates. Pärast muudatusi kirjuta täpselt, millised failid lõid või muutsid ja kuidas ma saan seda käivitada.
```

---

## Kuidas kontrollida, et AI ei läheks liiga suureks?

Kui AI hakkab korraga lisama backendit, kontosid, admin-paneeli, PWA-d või keerulist kujundust, peata ta ja ütle:

```text
Peatu. Tee ainult see üks väike samm, mis oli etapis kirjeldatud. Ära lisa järgmiste etappide funktsioone.
```

---

## Projekti dokumendid

Olulisemad dokumendid:

- `docs/PROJECT_OVERVIEW.md` — projekti üldkirjeldus
- `docs/MVP.md` — esimese töötava versiooni täpne piir
- `docs/DEVELOPMENT_STAGES.md` — 6 arendusetappi
- `docs/GAME_RULES.md` — mängureeglid
- `docs/CASE_FORMAT.md` — juhtumite lisamise formaat
- `docs/SAMPLE_CASE.md` — esimese juhtumi näidis
- `docs/UI_FLOW.md` — ekraanide ja kasutajateekonna kirjeldus
- `docs/GAME_STATE_MACHINE.md` — mängu olekud
- `docs/TASKS.md` — samm-sammuline tööplaan
- `docs/AI_PROMPTS.md` — valmis promptid Claude Code’i või Codexi jaoks

---

## Lühike visioon

Esimene versioon on lihtne digimäng.

Hiljem võib sellest saada platvorm, kus õpetaja, mängujuht või kasutaja saab ise uusi müsteeriume luua ja mängijad saavad neid telefonis või arvutis mängida.
