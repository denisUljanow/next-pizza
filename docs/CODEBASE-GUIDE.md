# Next Pizza: Codebase-Handbuch

Stand: 21. Juni 2026

Dieses Dokument erklärt die aktuelle Anwendung so, wie sie im Repository implementiert ist. Es ist kein allgemeines Next.js-Tutorial. Es soll dir nach einer längeren Pause helfen, das mentale Modell, die wichtigsten Dateien, die Datenflüsse und den unfertigen Stand des Projekts wiederherzustellen.

## 1. Was die Anwendung macht

Next Pizza ist der Entwurf eines Pizza-Onlineshops. Der aktuell implementierte Kern umfasst:

- eine Produktübersicht nach Kategorien,
- Filter nach Preis, Größe, Teigart und Zutaten,
- eine debouncte Produktsuche,
- Produktdetails als Modal,
- konfigurierbare Pizzen mit Größe, Teigart und zusätzlichen Zutaten,
- einen anonymen, per Cookie identifizierten Warenkorb,
- PostgreSQL-Persistenz über Prisma.

Im Datenmodell sind außerdem Benutzer, Bestellungen, Verifizierungscodes und Story-Inhalte vorbereitet. Login, Checkout, Zahlung und Story-Anzeige sind im UI aber noch nicht fertig implementiert.

## 2. Das mentale Gesamtmodell

Die Anwendung besteht aus vier Schichten:

```text
Browser / React UI
        |
        | URL-Navigation oder HTTP mit Axios
        v
Next.js App Router
  - Server Components
  - Route Handlers unter /api
        |
        | Prisma Client
        v
PostgreSQL: next_pizza
```

Daneben gibt es clientseitigen Zustand:

- React State für lokalen Zustand einer Komponente,
- URL-Query-Parameter für dauerhaft sichtbare Filter,
- Zustand Stores für Warenkorb und aktive Kategorie,
- ein HTTP-only Cookie namens `cartToken` als Identität des anonymen Warenkorbs.

Die wichtigste Trennung lautet:

- **Server-Code** darf direkt Prisma und PostgreSQL verwenden.
- **Client-Code** läuft im Browser und greift über `/api/...` auf Server-Code zu.
- Dateien mit `'use client'` sind Client Components.
- Dateien ohne `'use client'` sind im App Router standardmäßig Server Components.

## 3. Verwendete Technologien

| Technologie | Aufgabe im Projekt |
| --- | --- |
| Next.js 16 | Routing, Server Rendering, Route Handlers, Layouts und Modals über parallele Routen |
| React 19 | Komponenten, Props, State, Effects und Event Handling |
| TypeScript | Typprüfung für Komponenten, DTOs und Datenflüsse |
| PostgreSQL | persistente Speicherung aller Shop-Daten |
| Prisma 6.19.3 | Schema, typisierter Datenbankzugriff und Seed-Skript |
| Zustand | kleiner globaler Client Store für Warenkorb und aktive Kategorie |
| Axios | Browserzugriffe auf die internen API-Endpunkte |
| Tailwind CSS 4 | Utility-Klassen und Design-Tokens |
| Radix UI | barriereärmere UI-Primitiven wie Dialog, Checkbox und Select |
| shadcn-artige Komponenten | lokale Wrapper um Radix unter `shared/components/ui` |
| react-use | `useSet`, `useDebounce` und `useClickAway` |
| react-hot-toast | Erfolgs- und Fehlermeldungen beim Hinzufügen zum Warenkorb |
| Lucide React | Icons |
| qs | Serialisierung der Filter in die URL |
| bcrypt | Hashing der Seed-Passwörter |

## 4. Projekt starten

Die aktuelle Datenbankverbindung steht in `.env`:

```env
DATABASE_URL=postgresql://root:root@localhost:5432/next_pizza
```

Typischer lokaler Ablauf:

```bash
# PostgreSQL-Container starten
sudo docker start next-pizza-postgres

# Abhängigkeiten installieren
npm install

# Schema in PostgreSQL übertragen
npm run prisma:push

# Beispieldaten einspielen
npm run prisma:seed

# Entwicklungsserver starten
npm run dev
```

Danach ist die Anwendung unter `http://localhost:3000` erreichbar.

Weitere Befehle:

```bash
npm run prisma:studio   # Daten mit einer grafischen Oberfläche ansehen
npm run lint            # ESLint ausführen
npm run build           # Production Build erstellen
npm exec prisma generate # Prisma Client neu generieren
```

Wichtig: Das Projekt verwendet derzeit `prisma db push`, aber keine versionierten Migrationen. `db push` gleicht das aktuelle Schema direkt mit der Datenbank ab. Für ein produktives Projekt sollten später Prisma-Migrationen eingeführt werden.

## 5. Verzeichnisstruktur

```text
app/
  layout.tsx                 globales HTML-Layout und Header
  page.tsx                   Startseite und serverseitige Produktabfrage
  globals.css                Tailwind, Farbtokens und globale Styles
  api/                       HTTP-Endpunkte des Backends
  store/                     Zustand Stores
  (root)/                    Route Group für Produktseiten und Modal-Slot

shared/
  components/ui/             allgemeine UI-Bausteine
  components/shared/         fachliche Shop-Komponenten
  hooks/                     Filter- und Daten-Hooks
  lib/                       fachliche Hilfsfunktionen
  services/                  Axios-Client und Browser-API-Funktionen
  constants/                 Pizza-Größen und Teigarten
  types/                     ergänzende TypeScript-Typen

libs/
  prisma.ts                  Prisma-Singleton
  calc-total-pizza-price.ts  Preis einer konfigurierten Pizza

prisma/
  schema.prisma              vollständiges relationales Datenmodell
  constants.js               Seed-Produkte, Kategorien und Zutaten
  seed.js                    Datenbank leeren und Beispieldaten anlegen

public/
  img/                       statisch ausgelieferte Produktbilder
  logo.png                   Logo
```

`@/` ist durch `tsconfig.json` ein Alias für das Projektverzeichnis. Beispiel:

```ts
import { prisma } from '@/libs/prisma';
```

Das ist dasselbe wie ein passender langer relativer Import, aber stabiler bei Datei-Verschiebungen.

## 6. Next.js App Router

### 6.1 Root Layout

`app/layout.tsx` umschließt jede Seite. Es:

- lädt die Nunito-Schrift über `next/font`,
- bindet `app/globals.css` ein,
- zeigt auf jeder Seite den `Header`,
- stellt den Toast-Container bereit,
- definiert globale Metadaten.

`children` ist die gerade aktive Seite. Der Header wird deshalb nicht in jeder Seite wiederholt.

### 6.2 Route Group `(root)`

Ordner in runden Klammern sind **Route Groups**. `(root)` strukturiert den Code, erscheint aber nicht in der URL.

Deshalb wird:

```text
app/(root)/product/[id]/page.tsx
```

zu:

```text
/product/123
```

### 6.3 Dynamische Segmente

`[id]` ist ein dynamischer URL-Teil. In Next.js 16 wird er hier als Promise gelesen:

```ts
const { id } = await params;
```

Die ID kommt aus der URL und wird mit `Number(id)` in eine Zahl für Prisma umgewandelt. Existiert das Produkt nicht, ruft die Seite `notFound()` auf.

### 6.4 Server und Client Components

`app/page.tsx` ist eine Server Component. Sie darf `findPizzas()` aufrufen, das wiederum direkt Prisma verwendet.

`Filters`, `SearchInput`, `CartDrawer` und andere interaktive Komponenten haben `'use client'`. Sie dürfen Browser-Hooks wie `useState`, `useEffect`, `useRouter` und Zustand verwenden, aber nicht direkt auf Prisma zugreifen.

Faustregel:

```text
DB-Abfrage und initiale Daten       -> Server Component
Klicks, Eingaben, Effects, Stores  -> Client Component
Browser -> Datenbank               -> über /api Route Handler
```

## 7. Ablauf der Startseite

Der wichtigste Einstiegspunkt ist `app/page.tsx`.

```text
Request auf /
  -> Next.js übergibt searchParams
  -> findPizzas(searchParams)
  -> Prisma liest Kategorien, Produkte, Varianten und Zutaten
  -> Decimal-Preise werden in number konvertiert
  -> Server rendert Kategorien, Filter und Produktgruppen
  -> Browser hydratisiert die interaktiven Client Components
```

### 7.1 `findPizzas`

`shared/lib/find-pizzas.ts` übersetzt URL-Parameter in Prisma-Filter:

- `sizes=20,30` filtert `ProductItem.size`,
- `types=1,2` filtert `ProductItem.pizzaType`,
- `ingredients=1,4` sucht Produkte mit mindestens einer passenden Zutat,
- `fromPrice` und `toPrice` begrenzen Variantenpreise.

Die Abfrage beginnt bei `Category` und lädt verschachtelt:

```text
Category
  -> products
      -> ingredients
      -> items (Produktvarianten)
```

Das Ergebnis enthält alle Kategorien. Kategorien ohne passende Produkte bleiben im Ergebnis, aber `ProductsGroupList` rendert bei leerer Produktliste nichts.

### 7.2 Warum Prisma Decimal konvertiert wird

PostgreSQL-Geldwerte sind im Schema `Decimal(10, 2)`. Prisma liefert dafür `Prisma.Decimal`, kein normales JavaScript-`number`.

Client Components sollten nur gut serialisierbare Daten erhalten. Deshalb konvertiert `app/page.tsx` Preise vor dem Übergang:

```ts
price: Number(item.price.toDecimalPlaces(2).toString())
```

Dasselbe passiert auf der Modal-Seite in `plainProduct`.

### 7.3 Produktgruppen

`ProductsGroupList`:

- zeigt alle Produkte einer Kategorie,
- rendert pro Produkt eine `ProductCard`,
- beobachtet die Gruppe mit `IntersectionObserver`,
- aktualisiert beim Scrollen die aktive Kategorie im Zustand Store.

`Categories` liest diesen Store und markiert den aktiven Tab. Beim Klick wird die normale Link-Navigation verhindert und stattdessen per `scrollIntoView` zur Kategorie gescrollt.

## 8. Filtersystem

Das Filtersystem verteilt Verantwortung auf drei Hooks:

### 8.1 `useFilters`

`shared/hooks/use-filters.ts` hält die aktuelle Auswahl:

- Zutaten als `Set<string>`,
- Größen als `Set<string>`,
- Teigarten als `Set<string>`,
- Preise als React State.

Ein `Set` verhindert Duplikate und eignet sich gut zum Umschalten von Checkbox-Werten. `react-use` liefert mit `useSet` fertige `toggle`-Operationen.

Die initialen Werte werden aus `useSearchParams()` gelesen. Ein Seitenaufruf mit Query-Parametern stellt die Filterauswahl dadurch wieder her.

### 8.2 `useIngredients`

Dieser Hook lädt alle Zutaten über:

```text
GET /api/ingredients
```

Währenddessen zeigt `CheckboxFiltersGroup` Skeleton-Platzhalter. Die API-Antwort wird in `{ text, value }`-Optionen für Checkboxen umgebaut.

### 8.3 `useQueryFilters`

Bei jeder Filteränderung:

1. werden Sets in sortierte Arrays umgewandelt,
2. serialisiert `qs` die Werte in eine Query-Zeichenkette,
3. führt `router.push` eine Navigation ohne Scroll-Reset aus,
4. rendert die Server Component `app/page.tsx` mit neuen `searchParams`,
5. führt Prisma die gefilterte Abfrage aus.

Beispiel-URL:

```text
/?fromPrice=7&toPrice=14&ingredients=1,4&sizes=30&types=1
```

Die URL ist damit ein Teil des Zustands. Vorteile: Filter sind bookmarkbar, teilbar und nach Reload erhalten.

## 9. Produktsuche

`SearchInput` ist eine Client Component im Header.

```text
Benutzer tippt
  -> searchQuery ändert sich
  -> useDebounce wartet 500 ms
  -> Api.products.search(query)
  -> Axios: GET /api/products/search?query=...
  -> Prisma: name contains query, case-insensitive
  -> Dropdown rendert Treffer
```

`useClickAway` schließt das Dropdown bei einem Klick außerhalb. Während der Suche wird ein dunkles Overlay angezeigt.

Der Debounce verhindert einen HTTP-Request bei jedem einzelnen Tastendruck in schneller Folge.

## 10. Produktdetail und Modal-Routing

Das Projekt nutzt eine fortgeschrittene App-Router-Funktion: **Parallel Routes** plus **Intercepting Routes**.

### 10.1 Normaler Direktaufruf

Ein direkter Aufruf von `/product/5` verwendet:

```text
app/(root)/product/[id]/page.tsx
```

Diese Seite ist derzeit nur ein einfacher, unfertiger Produktdetail-Prototyp.

### 10.2 Navigation von der Produktliste

Klickt man in der Anwendung auf ein Produkt, fängt diese Route die Navigation ab:

```text
app/(root)/@modal/(.)product/[id]/page.tsx
```

Bedeutung:

- `@modal` ist ein benannter paralleler Slot,
- `(.)product` interceptet die `product`-Route auf derselben Ebene,
- die URL wird `/product/5`,
- die aktuelle Startseite bleibt im Hintergrund,
- das Produkt erscheint als Dialog darüber.

`app/(root)/layout.tsx` rendert dafür sowohl `children` als auch `modal`.

`default.tsx` und `[...catchAll]/page.tsx` liefern `null`, wenn im Modal-Slot nichts angezeigt werden soll.

## 11. Produktkonfiguration

Die abgefangene Produktseite lädt das Produkt inklusive:

- `items`: kaufbare Varianten,
- `ingredients`: auswählbare Zutaten.

Danach entscheidet `ChooseProductModal`:

```ts
const isPizzaType = product.items.some(
  (item) => item.pizzaType !== null && item.pizzaType !== undefined
);
```

- Pizza: `ChoosePizzaForm`
- anderes Produkt: `ChooseProductForm`

### 11.1 Pizza-Varianten

`ProductItem` repräsentiert eine tatsächlich kaufbare Variante, zum Beispiel:

```text
Produkt: Cheesy
Größe: 30 cm
Teigart: 2 (dünn)
Preis: 12.00
```

`shared/constants/pizza.ts` übersetzt technische Werte:

```text
20 -> Klein
30 -> Mittel
40 -> Groß

1 -> Normaler Teig
2 -> Dünner Teig
```

`ChoosePizzaForm` hält Größe, Teigart und ausgewählte Zutaten lokal im React State. Kombinationen, für die kein `ProductItem` existiert, werden deaktiviert. Beim Wechsel der Teigart wählt ein Effect die erste verfügbare Größe, falls die bisherige Kombination nicht existiert.

### 11.2 Preisberechnung

`totalPizzaPrice` berechnet:

```text
Preis der gewählten ProductItem-Variante
+ Summe der gewählten Zutatenpreise
= angezeigter Gesamtpreis
```

Beim Absenden werden nicht Name, Größe und Preis übertragen, sondern:

```ts
{
  productItemId: 123,
  ingredients: [1, 4, 7]
}
```

Der Server kann dadurch die autoritativen Preise aus der Datenbank lesen. Der Browser darf den endgültigen Preis nicht selbst bestimmen.

## 12. Warenkorb: Gesamtfluss

Der Warenkorb verbindet Client Store, API, Cookie und Datenbank.

```text
UI-Komponente
  -> Zustand Action
  -> Api.cart Funktion
  -> Axios Request
  -> /api/cart Route Handler
  -> Prisma / PostgreSQL
  -> vollständiger CartDTO
  -> getCartDetails Transformation
  -> Zustand Store
  -> UI rendert neu
```

### 12.1 Anonymer Warenkorb per Cookie

Es gibt noch kein fertiges Login. Darum identifiziert `cartToken` einen Browser-Warenkorb.

Beim ersten `POST /api/cart`:

1. sucht der Server das Cookie,
2. erzeugt andernfalls `crypto.randomUUID()`,
3. findet oder erstellt `findOrCreateCart(token)` einen `Cart`,
4. setzt die Antwort ein HTTP-only Cookie für 30 Tage.

`httpOnly` bedeutet: Browser-JavaScript kann den Token nicht mit `document.cookie` lesen. Der Browser sendet ihn bei Requests automatisch mit. `sameSite: 'lax'` reduziert bestimmte Cross-Site-Angriffe. Für Produktion müsste `secure` unter HTTPS auf `true` gesetzt werden.

### 12.2 Zustand Store

`app/store/cart.ts` enthält:

- `items`,
- `totalAmount`,
- `loading`,
- `error`,
- `fetchCartItems`,
- `addCartItem`,
- `updateItemQuantity`,
- `removeCartItem`.

Die Actions rufen die Service-Schicht auf und ersetzen den Store anschließend mit der transformierten Server-Antwort. Der Server bleibt damit die Quelle der Wahrheit.

### 12.3 API-Endpunkte

| Methode | Route | Zweck |
| --- | --- | --- |
| GET | `/api/cart` | aktuellen Warenkorb anhand des Cookies laden |
| POST | `/api/cart` | Variante mit optionalen Zutaten hinzufügen |
| PATCH | `/api/cart/:id` | Menge eines CartItems ändern |
| DELETE | `/api/cart/:id` | CartItem entfernen |

### 12.4 DTO und Transformation

`CartDTO` beschreibt die verschachtelte API-Antwort:

```text
Cart
  -> items[]
      -> productItem
          -> product
      -> ingredients[]
```

`getCartDetails` transformiert diese Daten in ein UI-freundliches Format. Prisma-Decimals werden zu Zahlen, verschachtelte Namen und Bilder werden nach oben gezogen, und der Einzelpostenpreis wird berechnet.

### 12.5 Gesamtpreis

`calcCartItemTotalPrice` berechnet pro Posten:

```text
(Variantenpreis + Summe Zutatenpreise) * Menge
```

`updateCartTotalAmount`:

1. lädt den vollständigen Warenkorb,
2. summiert alle Posten mit `Prisma.Decimal`,
3. speichert `Cart.totalAmount`,
4. gibt den aktualisierten vollständigen Warenkorb zurück.

Die Decimal-Rechnung vermeidet typische Gleitkommafehler bei Geldbeträgen.

### 12.6 Warenkorb-UI

`CartButton` zeigt Gesamtbetrag und Anzahl unterschiedlicher CartItems. `CartDrawer` öffnet eine Radix-`Sheet`-Seitenleiste und lädt beim Mounten den Warenkorb.

Jedes `CartDrawerItem` enthält:

- Bild und Name,
- Größe, Teigart und Zutaten,
- Mengensteuerung,
- berechneten Postenpreis,
- Löschaktion.

## 13. API- und Service-Schicht

Client Components importieren nicht überall Axios direkt. Stattdessen gibt es:

```text
shared/services/instances.ts   gemeinsamer Axios-Client
shared/services/products.ts    Produktsuche
shared/services/ingredients.ts Zutatenabfrage
shared/services/cart.ts        Warenkorboperationen
shared/services/api-client.ts  fasst alles als Api zusammen
```

Beispiel:

```ts
Api.cart.addCartItem(values)
Api.ingredients.getAll()
Api.products.search(query)
```

Die korrespondierenden Server-Endpunkte liegen unter `app/api`. Eine Datei `app/api/ingredients/route.ts` definiert dadurch automatisch `/api/ingredients`.

## 14. Prisma und Datenmodell

`prisma/schema.prisma` ist die zentrale Definition der PostgreSQL-Struktur.

### 14.1 Produktbereich

```text
Category 1 --- n Product 1 --- n ProductItem
                       n --- m Ingredient
```

- `Category`: Pizzas, Combo, Vorspeisen usw.
- `Product`: fachliches Produkt mit Name und Bild.
- `ProductItem`: konkrete kaufbare Variante mit Preis, optionaler Größe und Teigart.
- `Ingredient`: Zutat mit eigenem Preis und Bild.

Warum `Product` und `ProductItem` getrennt sind: Eine Pizza hat einen Namen und ein Bild, aber mehrere Größen-/Teigkombinationen mit eigenen Preisen. Ein Getränk hat meistens nur ein `ProductItem` ohne Größe und Teigart.

### 14.2 Warenkorb

```text
User 0..1 --- 0..1 Cart 1 --- n CartItem n --- 1 ProductItem
                                      n --- m Ingredient
```

Ein CartItem verweist auf genau eine kaufbare Variante und beliebig viele Zusatzzutaten. Die Menge steht am CartItem.

`Cart.userId` ist optional, weil anonyme Warenkörbe nur über `token` funktionieren.

### 14.3 Benutzer und Bestellung

- `User` enthält E-Mail, Passwort-Hash, Rolle und optionale Provider-Felder.
- `VerificationCode` ist für E-Mail-Verifizierung vorbereitet.
- `Order` speichert Kontakt-/Lieferdaten, Status, Payment-ID und die bestellten Positionen als JSON-Snapshot.

Diese Modelle werden vom aktuellen UI noch nicht vollständig verwendet.

### 14.4 Stories

`Story` und `StoryItem` bilden eine Story mit Vorschau und mehreren Medien ab. Seed-Daten existieren, aber es gibt derzeit keine anzeigende Komponente.

### 14.5 Prisma-Singleton

`libs/prisma.ts` erzeugt in Entwicklung nicht bei jedem Hot Reload einen neuen Datenbank-Client:

```ts
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
```

Ohne dieses Muster könnte Next.js im Entwicklungsmodus zu viele PostgreSQL-Verbindungen öffnen.

## 15. Seed-Daten

`prisma/constants.js` enthält statische Kategorien, Zutaten und Nicht-Pizza-Produkte. `prisma/seed.js`:

1. leert relevante Tabellen mit `TRUNCATE ... CASCADE`,
2. legt zwei Testbenutzer an,
3. legt Kategorien und Zutaten an,
4. legt normale Produkte an,
5. legt drei Pizzen samt Varianten an,
6. legt Beispiel-Warenkörbe an,
7. legt Story-Daten an.

Testbenutzer aus dem Seed:

```text
user@test.ru  / 111111
admin@test.ru / 111111
```

Das Seed-Skript ist destruktiv für die darin genannten Tabellen. Es ist für Entwicklungsdaten gedacht, nicht für eine Produktionsdatenbank.

## 16. Bilder und statische Dateien

Alles unter `public/` wird vom Web-Root ausgeliefert.

```text
Datei: public/img/pizza1.webp
URL:   /img/pizza1.webp
```

Deshalb speichern Seed-Datensätze beispielsweise:

```js
imageUrl: '/img/pizza1.webp'
```

Die Produktkarten können diesen Wert direkt als `<img src={imageUrl}>` verwenden. `next/image` wird aktuell nur für das Logo eingesetzt.

Wenn Bilder fehlen, prüfe in dieser Reihenfolge:

1. Gibt es überhaupt Produkte in Prisma Studio?
2. Beginnt `imageUrl` mit genau einem `/`?
3. Existiert die Datei mit exakt gleicher Groß-/Kleinschreibung unter `public/`?
4. Liefert der Browser-Network-Tab für die Bild-URL 200 oder 404?

## 17. Styling und UI-Komponenten

`app/globals.css` importiert Tailwind CSS und `tw-animate-css`. CSS-Variablen wie `--primary` und `--secondary` bilden die Farbpalette.

`cn()` in `shared/lib/utils.ts` kombiniert zwei Werkzeuge:

- `clsx` baut bedingte Klassenlisten,
- `tailwind-merge` entfernt widersprüchliche Tailwind-Klassen.

Beispiel:

```ts
cn('px-4', active && 'bg-white', className)
```

Unter `shared/components/ui` liegen generische Komponenten wie `Button`, `Dialog`, `Sheet`, `Checkbox` und `Slider`. Unter `shared/components/shared` liegen Shop-spezifische Komponenten wie `ProductCard`, `Filters` oder `CartDrawer`.

Diese Trennung bedeutet:

```text
ui/      kennt die Pizza-Domäne nicht
shared/  verbindet UI mit Shop-Fachlogik
```

## 18. React-Konzepte im konkreten Projekt

### Props

Props sind Eingaben einer Komponente. `ProductCard` erhält beispielsweise `name`, `price`, `imageUrl` und `ingredients` von der Elternkomponente.

### State

State sind veränderliche Werte. In `ChoosePizzaForm` sind Größe, Teigart und Zutaten lokaler State, weil sie nur dieses Modal betreffen.

### Effect

Ein Effect synchronisiert React mit etwas außerhalb des reinen Renderns:

- `useQueryFilters` synchronisiert Filter mit der URL,
- `CartDrawer` lädt den Warenkorb,
- `ProductsGroupList` registriert einen `IntersectionObserver`.

### Controlled Input

Die Preisfelder erhalten `value` und `onChange`. React State ist damit die Quelle des angezeigten Eingabewerts.

### Globaler Store

Zustand wird verwendet, wenn mehrere voneinander entfernte Komponenten denselben veränderlichen Zustand benötigen. Der Warenkorfbetrag wird beispielsweise im Header angezeigt, während Änderungen im Modal und Drawer stattfinden.

### Server Rendering und Hydration

Die Startseite wird zuerst auf dem Server mit Daten gerendert. Danach lädt der Browser JavaScript und macht Client Components interaktiv. Dieser zweite Schritt heißt Hydration.

## 19. Aktueller Implementierungsstand und bekannte Probleme

Dieser Abschnitt beschreibt bewusst den aktuellen Code, nicht ein ideales Zielbild.

### Hohe Priorität

1. **Der TypeScript-Check ist nicht sauber.** `libs/calc-total-pizza-price.ts` importiert aus dem nicht vorhandenen Pfad `@/app/@types/prisma`. Gemeint ist sehr wahrscheinlich `@/shared/types/prisma`.

2. **Der Slider-Export ist inkonsistent.** `shared/components/ui/index.ts` exportiert `Slider`, die Datei stellt aber den Namen `RangeSlider` bereit.

3. **Das alte Verzeichnis `node_modules.prisma7-backup` liegt noch im Projekt.** Es ist ignoriert, wird aber durch das breite `tsconfig`-Include trotzdem vom TypeScript-Compiler erfasst und verursacht zahlreiche fremde Fehler. Es muss mit passenden Dateirechten entfernt oder explizit ausgeschlossen werden.

4. **Teigfilterwerte passen nicht zum Serverfilter.** Die UI sendet derzeit `normal` und `dünn`; `findPizzas` erwartet Zahlen und verwirft diese Werte als `NaN`. Die Werte müssten `1` und `2` sein.

5. **Die Duplikaterkennung im Warenkorb prüft Zutaten nicht exakt.** Prisma `every: { id: { in: ... } }` kann auch einen Posten mit einer Teilmenge oder in Sonderfällen unerwartet matchen. Für dieselbe Konfiguration müssen beide Zutatenmengen exakt verglichen werden.

### Mittlere Priorität

6. `PATCH /api/cart/:id` validiert nicht, ob `quantity` eine positive ganze Zahl ist. Menge `0`, negative oder ungeeignete Werte sollten abgefangen werden.

7. Zustand Actions fangen Fehler intern ab, werfen sie aber nicht erneut. Das Modal kann deshalb trotz fehlgeschlagenem Request anschließend einen Erfolgs-Toast zeigen.

8. `ChooseProductModal` setzt voraus, dass jedes Produkt mindestens ein `ProductItem` hat. Bei fehlerhaften Daten wäre `firstItem` undefiniert.

9. Die direkte Produktseite `/product/[id]` ist ein Prototyp mit Lorem-Text und statischen Varianten; das Modal ist funktionaler als die Vollseite.

10. Der Checkout-Link zeigt auf `/checkout`, aber eine Checkout-Seite ist nicht vorhanden.

11. Login ist nur ein Button. Authentifizierung, Registrierung und Verifizierung sind nicht implementiert, obwohl Modelle vorbereitet sind.

12. `SortPopup` ist nur Darstellung; eine Sortierlogik ist noch nicht mit URL oder Prisma verbunden.

13. `query` und `sortBy` stehen in `GetSearchParams`, werden in `findPizzas` aber nicht verwendet.

14. Mehrere `console.log`-Debugausgaben und unbenutzte Imports sind noch vorhanden.

### Projektpflege

15. `@prisma/client` steht aktuell in `devDependencies`, wird aber zur Laufzeit gebraucht und sollte in `dependencies` liegen.

16. `eslint-config-next` ist Version 15.5.4, während Next.js 16.1.1 verwendet wird. Diese Hauptversionen sollten abgestimmt werden.

17. `README.md` enthält noch den alten Datenbanknamen `next-pizza`; aktiv ist `next_pizza`.

18. Root-Metadaten und `<html lang="en">` stammen teilweise noch aus dem Create-Next-App-Template. Für die deutsche Anwendung wäre `lang="de"` passend.

19. Es gibt aktuell keine automatisierten Unit-, Integrations- oder End-to-End-Tests.

## 20. Sinnvolle Reihenfolge zum Wiedereinstieg

### Phase 1: Nur verstehen

Lies in dieser Reihenfolge:

1. `prisma/schema.prisma`
2. `app/page.tsx`
3. `shared/lib/find-pizzas.ts`
4. `shared/components/shared/product-group-list.tsx`
5. `shared/components/shared/product-card.tsx`
6. `shared/components/shared/filters.tsx`
7. die drei Filter-Hooks
8. die Modal-Route und `ChooseProductModal`
9. `ChoosePizzaForm`
10. `app/store/cart.ts`
11. `app/api/cart/route.ts`
12. `shared/lib/updateCartTotalAmount.ts`

### Phase 2: Projekt stabilisieren

Empfohlene Reihenfolge:

1. altes `node_modules.prisma7-backup` entfernen,
2. TypeScript-Import und Slider-Export korrigieren,
3. Abhängigkeitsversionen und Dependency-Gruppen bereinigen,
4. Teigfilter reparieren,
5. Warenkorb-Validierung und Fehlerweitergabe reparieren,
6. Debugausgaben und unbenutzte Imports entfernen,
7. einen sauberen `npm run build` herstellen.

### Phase 3: Features fertigstellen

Danach bieten sich an:

1. echte Produktdetailseite,
2. Checkout,
3. Authentifizierung,
4. Bestellanlage und Payment,
5. Sortierung,
6. Stories,
7. Tests.

## 21. Debugging-Checkliste

### Seite zeigt keine Produkte

```bash
npm run prisma:studio
npm run prisma:seed
```

Prüfe außerdem, ob der Dev-Server dieselbe `.env` und Datenbank verwendet.

### Prisma kann PostgreSQL nicht erreichen

```bash
sudo docker start next-pizza-postgres
```

Prüfe Port `5432`, Benutzer `root`, Passwort `root` und Datenbank `next_pizza`.

### Prisma-Schema geändert

```bash
npm run prisma:push
npm exec prisma generate
```

Bei produktionsnaher Weiterentwicklung stattdessen Migrationen einführen.

### Client zeigt alte Daten

- Browser neu laden,
- Network-Tab prüfen,
- API-Antwort unter `/api/...` prüfen,
- Zustand Store und Cookie `cartToken` prüfen,
- Server-Konsole auf Prisma- oder Route-Fehler prüfen.

### Bild fehlt

Rufe die gespeicherte URL direkt auf, zum Beispiel:

```text
http://localhost:3000/img/pizza1.webp
```

### Warenkorb verhält sich unerwartet

- Cookie `cartToken` kontrollieren,
- `Cart`, `CartItem` und Join-Tabellen in Prisma Studio ansehen,
- Antwort von `/api/cart` prüfen,
- `updateCartTotalAmount` und `getCartDetails` verfolgen.

## 22. Begriffe kurz erklärt

| Begriff | Bedeutung hier |
| --- | --- |
| App Router | dateibasiertes Routing-System unter `app/` |
| Server Component | auf dem Server gerenderte React-Komponente mit direktem DB-Zugriff |
| Client Component | Browser-Komponente mit State, Effects und Events |
| Route Handler | Backend-Endpunkt in einer `route.ts`-Datei |
| Hydration | Aktivierung des serverseitigen HTML durch Browser-JavaScript |
| ORM | Abbildung von Datenbanktabellen auf Code-Objekte; hier Prisma |
| DTO | definierte Form der Daten zwischen API und Client |
| Relation | Verbindung zwischen Datenbankmodellen |
| Many-to-many | viele Produkte haben viele Zutaten und umgekehrt |
| Zustand Store | globaler clientseitiger Zustand außerhalb einzelner Komponenten |
| Debounce | Aktion erst ausführen, wenn Eingaben kurz aufgehört haben |
| Intercepting Route | Navigation als Modal abfangen, obwohl die URL wechselt |
| Parallel Route | zusätzlicher gleichzeitig gerenderter Layout-Slot wie `@modal` |
| Controlled Input | Eingabefeld, dessen Wert aus React State stammt |
| Source of Truth | maßgebliche Datenquelle; beim Warenkorb ist das der Server |

## 23. Ein vollständiges Beispiel

Ein Benutzer öffnet die Startseite, filtert nach einer 30-cm-Pizza, wählt eine Pizza und fügt Mozzarella hinzu:

1. `Filters` setzt Größe `30`.
2. `useQueryFilters` navigiert zu `/?sizes=30`.
3. `app/page.tsx` erhält neue `searchParams`.
4. `findPizzas` sucht Produkte mit einer `ProductItem`-Variante der Größe 30.
5. Die Startseite rendert die passenden Karten.
6. Der Klick auf eine Karte navigiert zu `/product/:id`.
7. Die Intercepting Route zeigt `ChooseProductModal` über der Startseite.
8. `ChoosePizzaForm` findet die passende Variante für Größe und Teigart.
9. Der Benutzer toggelt die Mozzarella-ID in `selectedIngredients`.
10. `totalPizzaPrice` aktualisiert den angezeigten Preis.
11. Absenden ruft `useCartStore.addCartItem` auf.
12. Axios sendet `POST /api/cart` mit `productItemId` und Zutaten-IDs.
13. Der Server erstellt Token und Cart, falls noch nicht vorhanden.
14. Prisma erstellt oder erhöht das CartItem.
15. `updateCartTotalAmount` berechnet und speichert die Summe.
16. Die API setzt `cartToken` und sendet den vollständigen Warenkorb zurück.
17. `getCartDetails` transformiert die Antwort.
18. Zustand aktualisiert Store, Header und Drawer.
19. Der Toast bestätigt die Aktion und `router.back()` schließt das Modal.

Wenn du diesen Ablauf im Code vollständig nachvollziehen kannst, hast du den wichtigsten Teil der Architektur wieder verstanden.
