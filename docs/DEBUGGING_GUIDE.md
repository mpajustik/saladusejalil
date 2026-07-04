# DEBUGGING_GUIDE.md

## Eesmärk

See fail aitab algajal vigadega toime tulla.

---

# Kui projekt ei käivitu

Kontrolli:

```text
kas oled õiges kaustas;
kas npm install on tehtud;
kas package.json on olemas;
kas kasutad käsku npm run dev.
```

Anna AI-le selline info:

```text
Olen kaustas: [kausta nimi]
Käivitasin käsu: npm run dev
Veateade on:
[kleebi täpne veateade]
```

---

# Kui brauseris on tühi leht

Kontrolli:

```text
ava brauseri Developer Tools;
vaata Console vaadet;
kopeeri punane veateade.
```

AI-le:

```text
Brauseris on tühi leht. Console näitab:
[kleebi viga]

Palun paranda ainult see viga.
```

---

# Kui TypeScript annab vea

Ära ehmu. TypeScripti viga aitab leida probleemi enne, kui mäng katki läheb.

Kopeeri AI-le:

```text
TypeScripti veateade:
[kleebi viga]
```

Palu:

```text
Selgita lihtsas keeles, mis tüübi vastu eksiti.
```

---

# Kui npm install annab vea

Võimalikud põhjused:

```text
Node.js versioon on vana;
internet katkeb;
package-lock on katki;
sõltuvus on vigane.
```

AI-le:

```text
npm install andis vea:
[kleebi kogu veateade]
Minu Node versioon on:
[node -v tulemus]
Minu npm versioon on:
[npm -v tulemus]
```

---

# Kui mänguloogika töötab valesti

Kirjelda täpselt samme.

Halb kirjeldus:

```text
Kaardid on valesti.
```

Hea kirjeldus:

```text
1. Alustasin uut mängu.
2. Debug-paneelis oli lahendus Mari + Labor + Mälupulk.
3. Mängija 2 kaartide hulgas oli samuti Mälupulk.
4. Lahenduse kaart ei tohiks olla mängija käes.
```

---

# Kui AI parandab liiga palju

Ütle:

```text
Peatu. Palun taasta võimalikult väike muudatus. Paranda ainult kirjeldatud viga ja ära refaktori kogu projekti.
```

---

# Kui midagi läheb väga sassi

Võimalusel kasuta Git'i.

Kasulikud käsud:

```bash
git status
git diff
git add .
git commit -m "kirjeldus"
```

Kui tegid commit'i enne viga, on lihtsam tagasi minna.

---

# Algaja kontrollküsimused AI-le

Pärast parandust küsi:

```text
1. Mis oli vea põhjus?
2. Millises failis see oli?
3. Mida muutsid?
4. Kuidas kontrollida, et viga on kadunud?
5. Kas see muudatus mõjutas mõnda muud osa?
```
