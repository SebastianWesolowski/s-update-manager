# Skrypty deweloperskie

W pliku `package.json` znajdują się różne skrypty, które można wykorzystać podczas pracy nad projektem. Poniżej przedstawiamy najważniejsze z nich:

## Uruchamianie w trybie deweloperskim

Aby uruchomić projekt w trybie deweloperskim, możesz użyć następujących komend:

- `npm run start:init` lub `yarn start:init` - uruchamia skrypt inicjalizacyjny w trybie watch
- `npm run start:update` lub `yarn start:update` - uruchamia skrypt aktualizacyjny w trybie watch
- `npm run start:build` lub `yarn start:build` - uruchamia skrypt budowania w trybie watch
- `npm run start:template` lub `yarn start:template` - uruchamia skrypt przygotowania szablonu w trybie watch

Wszystkie powyższe komendy używają `cross-env` do ustawienia zmiennej środowiskowej `SDEBUG=true` oraz `tsx watch` do uruchomienia skryptów TypeScript w trybie watch.

### Tryb debugowania (SDEBUG)

Gdy zmienna środowiskowa `SDEBUG` jest ustawiona na `true`, projekt pobiera domyślne wartości argumentów z pliku `src/feature/args/const.ts`. Oto dane, które można edytować w trybie debugowania:

- `isDebug`: ustawione na 'true'
- `projectCatalog`: ścieżka do katalogu projektu (domyślnie './mock/mockProject')
- `remoteRepository`: URL do repozytorium zdalnego z mapą szablonów
- `snpCatalog`: ścieżka do katalogu .snp (domyślnie './mock/mockProject/.snp')

Dla szablonów:

- `projectCatalog`: ścieżka do katalogu szablonu (domyślnie './template/node')

Możesz dostosować te wartości w pliku `const.ts`, aby ułatwić testowanie i debugowanie.

## Kompilacja TypeScript

- `npm run prestart:dev` lub `yarn prestart:dev` - uruchamia kompilator TypeScript w trybie watch

## Budowanie projektu

- `npm run build` lub `yarn build` - czyści katalog `lib/` i buduje projekt używając Rollup
- `npm run build:prod` lub `yarn build:prod` - czyści katalog `lib/` i buduje projekt w wersji produkcyjnej

## Lintowanie i formatowanie kodu

- `npm run lint` lub `yarn lint` - uruchamia linter i formatter dla całego projektu
- `npm run lint:fix` lub `yarn lint:fix` - automatycznie naprawia problemy z formatowaniem i lintowaniem

## Testowanie

- `npm run test:check` lub `yarn test:check` - uruchamia testy z pokryciem kodu
- `npm run test:watch` lub `yarn test:watch` - uruchamia testy w trybie watch

Pamiętaj, że przed uruchomieniem skryptów deweloperskich powinieneś zainstalować wszystkie zależności projektu, używając komendy `npm install` lub `yarn install`.
