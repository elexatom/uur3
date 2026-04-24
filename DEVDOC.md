# Pilsen Pulse – Vývojářská dokumentace

Tento dokument slouží pro vývojový tým jako průvodce architekturou a lokálním spouštěním dispečerské aplikace pro plzeňskou MHD (Pilsen Pulse).

## Technologie a rámec (Stack)

*   **React 18 + Vite `v5`**: Vzhledem k verzi Node.js, která je k dispozici, pracujeme s Vite 5.
*   **TypeScript**: Veškerý kód je striktně typován. Typy najdete ve složce `src/types/`.
*   **Zustand**: Použito pro globální správu stavu, rozděleno na `appStore` (UI stav, nastavení, trasy, atd.) a `fleetStore` (simulovaná data vozidel v reálném čase).
*   **Tailwind CSS (v4)**: Používáno pro ostré stylování, integrace barev z design systému skrze CSS Custom Properties v `src/index.css`.
*   **Material UI (MUI v5)**: Používáno selektivně pro komplexní UI komponenty, např. DataGrid (`FleetTable`), TreeView (`NetworkTree`) a některé formulářové prvky.
*   **React Leaflet**: Použito pro plnohodnotné zobrazení GeoJSON dat v `/components/map/...`.
*   **Recharts**: Pro grafy přepravní kapacity a analytiky (`RouteAnalyticsPage.tsx`).

## Adresářová struktura

```text
/public/data/           # Statické lokální API: .geojson struktury sítě + vygenerované jízdní řády
/scripts/               # Node.js skripty např. pro generování schedules
/src/
  /components/
    /layout/            # AppShell, TopNav, SideNav, ...
    /map/               # LeafletMap, zobrazení mapových prvků (Zastávky, Spoje)
    /tree/              # Hierarchické zobrazení sítě (MUI TreeView)
  /pages/               # Jednotlivé screeny dostupné v aplikaci
  /store/               # appStore.ts, fleetStore.ts (Zustand moduly)
  /types/               # geojson.ts, transit.ts typování domén
```

## Lokální spuštění

1. Pro spuštění aplikace běžte do kořene projektu a zavolejte `npm run dev`. Vývojový server naslouchá na obvyklém portu (5173).
2. Přihlašovací jméno se nevyžaduje. Heslo pro demonstrativní účely je ve `.env` promenné `VITE_DEMO_PASSWORD`. Výchozí heslo je `dispatcher2024`.

## Generování dat

Pro zobrazení mockovacích dat o jízdních řádech, je připraven Node.js script.
Slouží k prvotnímu naplnění `./public/data/schedules.json` po klonování repozitáře.

**Použití:**
```bash
npx tsx scripts/generateSchedules.ts
```

## Stavové manažery (Zustand)

Aplikace používá primárně dva storages:

1.  **`appStore.ts`**:
    *   Udržuje stav vizuálního přepínání vrstev (`toggleLayer`).
    *   Ukládá a načítá barevné schéma do/z `localStorage`.
    *   Poslední "ViewState" a mapové souřadnice/výběry uzlů (`selectStopId`, `mapCenter`).
    *   Persistovaná nastavení (`SettingsPage`).
2.  **`fleetStore.ts`**:
    *   Inicializuje desítku fiktivních aut posádek MHD (Tram, Bus, Trol) s defaultními hodnotami.
    *   Obsahuje tikací funkci `tickLive()`, kterou `NetworkMapPage` a `FleetStatusPage` zavolají pro aktualizaci lokace +/- náhodný spread.

## Práce s mapovými daty

Soubory `.geojson` (`mhdzastavky.geojson`, `mhduseky.geojson`, `mhd_oznac.geojson`) se načítají plošně v `LeafletMap.tsx`. Protože `mhdzastavky.geojson` používají polygonovanou geometrii, je pro vizualizaci na Leafletu vytažen čistě bod z plošného středu bounding boxu. Trasy udržují svou originální `LineString` geometrii.

Barvy jednotlivých linek, či ikon zastávek korespondují s globálním barevným formátem:
*   Tramvaje: `var(--color-primary)` → #fb8a00
*   Autobusy: `var(--color-secondary)` → #10a4ff
*   Trolejbusy: `var(--color-tertiary)` → #22c55e

## OSRM a Route Editor

Směrovač je volán do OSRM veřejného cloudu (`https://router.project-osrm.org`). Trasa definovaná body (kliknutím) napadá stav `routeConfig` v `appStore`, kam se zapisují markery. Při renderu `RouteEditorPage` posílá API call s vybranými souřadnicemi do OSRM a načítá result pro překreslení dráhy na mapě přes `Polyline`. Validace UI nepovolí potvrzení deploy routy v případě, že jméno je příliš krátké, nebo čistě číselné.
