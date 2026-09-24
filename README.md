# ГРАНАТ. Запас прочности

Одностраничная презентация концепции выездной встречи клуба подрядчиков ТЕХНОНИКОЛЬ.

## Локальный просмотр

В этом окружении используется bundled Python:

```powershell
& 'C:\Users\usrr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173 --directory dist
```

В обычном окружении:

```powershell
python -m http.server 4173 --directory dist
```

Откройте http://localhost:4173.

## Проверка

```powershell
node scripts/check-site.mjs
node --check dist/content.js
node --check dist/main.js
```

## Навигация

- `#screen-1` through `#screen-9` — основная презентация.
- `#venue/<slug>` — подробная страница одной площадки; `← К площадкам` возвращает к `#screen-9`.

## Источники

ТЗ, лукбук и клиентский бриф находятся в соседней папке `Granat club`. Они используются только как исходные материалы и не изменяются этим проектом.
