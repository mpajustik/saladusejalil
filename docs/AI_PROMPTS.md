# AI_PROMPTS.md

## Eesmärk

See fail sisaldab valmis käske, mida saab anda Claude Code’ile või Codexile.

Kasuta neid ükshaaval, mitte kõiki korraga.

---

# Esimene käsk kogu projekti alustamiseks

```text
Loe läbi kõik README.md ja docs kaustas olevad .md failid. Ära kirjuta veel koodi.

Tee kõigepealt lühike kokkuvõte:
1. mis mängu me loome;
2. mis on MVP;
3. millised on 6 arendusetappi;
4. milline on esimene kõige väiksem tehniline samm;
5. mida me kindlasti esimeses etapis ei tee.

Pärast kokkuvõtet küsi minult kinnitust enne koodi kirjutamist.
```

---

# Käsk projekti tehnilise põhja loomiseks

```text
Alusta ainult etapiga 1 ja ainult esimese väikese sammuga.

Loo React + TypeScript + Vite projekti põhi mängule "Saladuse Jälil".

Tee ainult:
1. projekt käivitub;
2. avalehel on mängu nimi;
3. avalehel on lühike kirjeldus;
4. on nupp "Alusta mängu", mis ei pea veel midagi tegema;
5. lisa lihtne CSS, et leht oleks loetav ka telefonis.

Ära lisa veel:
- mänguloogikat;
- kaardijagamist;
- backendit;
- WebSocketit;
- andmebaasi;
- PWA-d.

Pärast töö lõppu kirjuta:
1. millised failid lõid või muutsid;
2. kuidas käivitada;
3. kuidas testida;
4. mis on järgmine väikseim samm.
```

---

# Käsk näidisjuhtumi lisamiseks

```text
Lisa projekti esimene näidisjuhtum "Kadunud Leiutise Juhtum".

Tee ainult:
1. loo vajalikud TypeScripti tüübid;
2. loo sampleCase andmefail;
3. lisa 6 tegelast, 6 asukohta ja 6 eset;
4. kuva need ajutiselt avalehel või eraldi komponendis.

Ära lisa veel:
- salajast lahendust;
- kaardijagamist;
- hüpoteese;
- süüdistusi.

Pärast töö lõppu selgita lihtsas keeles, kuhu andmed lisati ja kuidas ma näen, et need töötavad.
```

---

# Käsk mängu alustamise loogikaks

```text
Lisa uue mängu alustamise loogika.

Tee ainult:
1. loo createSolution funktsioon;
2. loo dealCards funktsioon;
3. loo kolm testmängijat;
4. nupu "Alusta mängu" vajutamisel vali salajane lahendus;
5. jaga ülejäänud kaardid mängijatele;
6. kuva arendaja debug-vaates lahendus ja mängijate kaardid.

Ära lisa veel:
- hüpoteese;
- kaardi näitamist;
- märkmeid;
- lõplikku süüdistust.

Pärast töö lõppu anna täpne testimisjuhis.
```

---

# Käsk mängija käigu lisamiseks

```text
Lisa aktiivse mängija kord.

Tee ainult:
1. lisa currentPlayerIndex;
2. kuva, kelle kord on;
3. lisa nupp "Lõpeta kord";
4. nupu vajutamisel liigub kord järgmisele mängijale;
5. pärast viimast mängijat läheb kord tagasi esimesele.

Ära lisa veel hüpoteese ega süüdistusi.
```

---

# Käsk hüpoteesi vormiks

```text
Lisa hüpoteesi esitamise vorm.

Tee ainult:
1. aktiivne mängija saab valida tegelase, asukoha ja eseme;
2. nupu vajutamisel luuakse hüpotees;
3. hüpotees lisatakse tegevuste ajalukku;
4. hüpoteesi tekst kuvatakse ekraanil.

Ära lisa veel kaardi näitamise valikut. See tuleb järgmises sammus.
```

---

# Käsk kaardi näitamise loogikaks

```text
Lisa hüpoteesi kontrollimise ja kaardi näitamise loogika.

Tee ainult:
1. pärast hüpoteesi kontrolli järgmisi mängijaid järjekorras;
2. leia esimene mängija, kellel on vähemalt üks hüpoteesis nimetatud kaart;
3. kui sobivaid kaarte on mitu, lase tal üks valida;
4. näita valitud kaarti ainult hüpoteesi esitanud mängijale;
5. lisa avalikku logisse ainult info, et kaart näidati, aga mitte kaardi nime.

Ära lisa veel WebSocketit ega backendit.
```

---

# Käsk detektiivimärkmikuks

```text
Lisa lihtne detektiivimärkmik.

Tee ainult:
1. igal mängijal on oma märkmed;
2. iga kaart saab märkeks ?, X või !;
3. mängija saab märkeid muuta;
4. mängija enda kaardid märgitakse automaatselt X;
5. märkmed kuvatakse aktiivse mängija vaates.

Ära tee veel automaatset deduktsiooni.
```

---

# Käsk lõpliku süüdistuse lisamiseks

```text
Lisa lõpliku süüdistuse vorm.

Tee ainult:
1. aktiivne mängija saab valida tegelase, asukoha ja eseme;
2. süsteem võrdleb valikut salajase lahendusega;
3. õige vastus lõpetab mängu;
4. vale vastus annab tagasiside ja mäng jätkub;
5. mängu lõpus kuvatakse võitja ja õige lahendus.

Ära lisa veel multiplayerit.
```

---

# Käsk etapp 1 lõpetamiseks

```text
Vaata üle kogu etapp 1.

Kontrolli:
1. kas uus mäng algab;
2. kas lahendus tekib;
3. kas kaardid jagatakse õigesti;
4. kas kord liigub;
5. kas hüpoteesid töötavad;
6. kas kaardi näitamine töötab;
7. kas märkmed töötavad;
8. kas lõplik süüdistus töötab;
9. kas telefonivaade on kasutatav.

Paranda ainult etapp 1 vead. Ära lisa etapp 2 funktsioone.

Lõpus kirjuta täpne kokkuvõte:
- mis valmis sai;
- kuidas käivitada;
- kuidas testida;
- millised piirangud jäid;
- mis on etapp 2 esimene väike samm.
```

---

# Käsk, kui AI hakkab liiga palju tegema

```text
Peatu. Sa lisasid liiga palju korraga. Palun tee ainult praegu kirjeldatud väike samm. Ära lisa järgmiste etappide funktsioone.
```

---

# Käsk vea parandamiseks

```text
Mul tekkis selline viga:

[kleebi veateade siia]

Palun:
1. selgita lihtsas keeles, mida see viga tähendab;
2. ütle, millises failis probleem tõenäoliselt on;
3. paranda ainult see viga;
4. ära tee muid muudatusi;
5. anna pärast parandust testimisjuhis.
```
