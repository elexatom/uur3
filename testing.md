# Testovací scénáře Správa MHD Plze
Tato aplikace slouží k řízení a plánování veřejné dopravy v Plzni.

**URL:** `http://192.168.127.12:8080/`

**Výchozí heslo:** `uur2026`

---

### Tvorba nové trasy
1. V navigaci klikněte na **"Editor tras"**
2. V pravém panelu vidíte pole pro novou trasu
3. Na mapě vpravo klikněte na jednu zastávku - tato zastávka se přidá jako první bod
4. **Ověřit:** Vpravo se objeví seznam zastávek s první zvolenou zastávkou
5. Klikněte na další zastávku
6. **Ověřit:** Druhá zastávka se přidá do seznam a mezi body se nakreslí trasa
7. Přidejte minimálně ještě jeden bod (celkem 3 body)
8. **Ověřit:** Mapa zobrazuje natrasu cestu mezi všemi body
9. Trasu uložte a zkontrolujte že se objeví v seznamu linek (na stránce síť MHD)


### Vytvoření příkazu k posílení
1. V navigaci klikněte na **"Krizové situace"**
2. V panelu zvolte **"Posilová doprava"**
3. Vyplňte nějaké údaje
4. Po vyplnění údajů klikněte na finální tlačítko **"Potvrdit"**
5. **Ověřit:** Nový příkaz se objeví v tabulce napravo

### Spuštění simulace
1. V navigaci klikněte na **"Simulace"**
2. Projďete asistentem pro nastavení a spusťte
3. **Ověřit:** Simulace se spustí - na mapě se začne animovat heat mapa
4. Přidejte novou poruchu
5. **Ověřit:** Simulace reaguje na poruchu a kliknutím na ní na mapě nastavte závažnost
6. Simulace reaguje na nový stav

