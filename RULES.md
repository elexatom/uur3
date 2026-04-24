Použij více agentů. Striktně dodržuj tyto pravidla.

# Zadání
Cílem semestrální práce je vývoj interaktivního vizualizačního a plánovacího nástroje pro plzeňskou městskou hromadnou dopravu, postaveného na reálných datech o poloze zastávek. Aplikace poslouží dispečerům k zobrazení dopravní sítě na mapovém podkladu a nabídne ucelené pracovní workflow pro správu linek. Uživatel bude moci v přehledném rozhraní hierarchicky procházet existující linky a zastávky, sledovat časy odjezdů v navázaných jízdních řádech a přímo v mapě interaktivně navrhovat nové trasy či plánovat objížďky, jak je uvedeno v designu. Součástí rozhraní bude také analytický režim pro simulaci dopravních uzávěr a zpoždění, jehož dopad se bude dynamicky a vizuálně propisovat napříč celou aplikací - od barevného zvýraznění na mapě až po přehledové tabulky a informační grafy.

Jako data použij GEOJSON ve složce ./data

# Technologie
React
Zustand
Tailwind
Material UI
React Leaflet - OpenStreetMap
  - jsou k dispozici data GEOJSON = linky, zastávky
Snaž se o přehlednost, dobré návrhové vzory a co nejkratší kód. (ne za cenu funkcionality, ale bez zbytečných obalů a složitostí).
Vše důkladně dekomponuj, komponenty budou mít maximálně 5 stavů, jinak se rozdělí.
Typy budou ve složce types.

# Design
STRIKTNĚ A PRECIZNĚ dodržuj návrhy ve složce ./design
- dodržuj design z DESIGN.md
- je tam přiložený obrázek a případně kód, replikuj je do našeho projektu

Na mapě musí být zobrazeny zastávky a trasy. Ke všemu je filtr jak zobrazeno v návrhu, nastavení zobrazení. Doprava a zastávky rozdělena na tramvaje/autobusy/trolejbusy.
Všechna data nutná k zobrazení, která nejsou uvedeny v GEOJSON, si vygeneruj/vytvoř mockovací skript ve vlastní složce.
Data pro simulaci uzavírek jsou mockovaná, přidej nějaký systém vyhovující designu. Uzavírka se projeví gradientem dle úrovně uzavírky barvou silnic.
Použij OSRM API pro plánování tras, a při zvolení trasy v menu, bude visualizována na mapě také pomocí OSRM API. Zvýrazněná trasa bude barevně odlišena.
Jízdní řády vygeneruj, s dopravními špičkami kolem 8 a 15. Live data generuj, nebo použij nějakou mokovací techniku. Live location simuluj co nejjednodušeji.
Máš 10 let zkušeností s UI a UX návrhem. Přidej spíše více funkcí než méně ale přehledně.

# Vypracování
1) Netriviální struktura GUI
  GUI musí tvořit ucelený pracovní celek, nikoliv jen náhodná sada formulářů a tlačítek. Rozhraní má být navrženo tak, aby:
    - podporovalo jeden nebo více reálných uživatelských workflow (např.: konfigurace → zadání dat → jejich úprava → přehled → vizualizace),
    
2) Komplexní komponenty GUI
  Použij alespoň dvě z následujících komponent:
    - tabulka (Data Grid),
    - stromová struktura (Tree View),
    - vlastní vykreslovaná komponenta (např. graf, editor, panel složený z grafických primitiv).

Funkčnost aplikace

Není nutné implementovat plně funkční aplikaci. Stačí:
    implementovat GUI a minimální logiku nutnou k jeho demonstraci,
    data mohou být simulována (statická, mockovaná),
    není povinná komunikace s databází nebo serverem.

Abychom splnili kritéria (strom, tabulka, více režimů, propojení komponent), UI bylo vytvořeno, proto udělej jeho nejvěrnější a nejpřesnější kopii.

Příklad akce:
        Akce A: Uživatel klikne na zastávku v seznamu. Zobrazí se mapa, automaticky vycentruje (animovaný přelet) na danou zastávku a zvýrazní ji.
        Akce B: Uživatel klikne na bod na mapě (Leaflet). V TreeView se rozbalí strom a vybere se odpovídající uzel.

    Kontrola vstupů:
    Pomocí MUI formulářů (např. TextField) v postranním panelu dáš uživateli možnost upravovat parametry zastávky (např. přejmenovat, změnit zónu). Zde použiješ kontrolu vstupů (zobrazení červeného textu "Neplatný název", pokud zadá třeba jen čísla).


Příklad jednoduchého toku dat
    Komponenta <App> načte GEOJSON.
    Uloží ho do stavu.
    Předá stav do <MapView stops={stops} /> a zároveň do <TreeView stops={stops} />.
    Obě komponenty "pozorují" (Observer) stejná data.