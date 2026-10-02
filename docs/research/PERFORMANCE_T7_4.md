# T7.4 — Nginx performance proof

## Итог

Оба проверяемых маршрута проходят обязательные мобильные пороги после T0.9 и T7.1:

- LCP не более 2,5 с;
- CLS не более 0,1.

| Маршрут | Baseline LCP | Итоговый LCP | Изменение | Baseline CLS | Итоговый CLS | Вердикт |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 4,258 с | 2,242 с | −47,3% | 0 | 0 | PASS |
| `/impuls/` | 3,930 с | 1,958 с | −50,2% | 0 | 0 | PASS |

## Сравниваемые состояния

- Baseline: `9944ec2be0bc288e369d986dc6371901c9457b06` — состояние непосредственно перед T0.9 и T7.1.
- Итог: `ffedde6a781168d1f405d1353963f5e2d38ffd29` — `main` после T0.9 и T7.1.

Baseline намеренно зафиксирован до обеих оптимизаций. Это позволяет проверить их совокупный наблюдаемый эффект без подмены исходного состояния.

## Методика

1. Для каждого SHA выполнен статический production build.
2. Каталог `out/` обслуживался через репозиторный Nginx template и snippets с production-equivalent security/cache/compression headers.
3. Для итогового состояния перед измерением выполнен `pnpm generate:precompressed`, поэтому Nginx мог отдавать подготовленные Brotli/Gzip-файлы так же, как в release-контуре.
4. Lighthouse 13.0.1 запускался в закреплённом Playwright-контейнере: mobile, simulated throttling, viewport 390×844, DPR 3.
5. Для обоих состояний использованы одинаковые pinned Docker images и команда `scripts/run-lighthouse-proof.mjs`.

Полные Lighthouse JSON и краткие summaries сохранены в `docs/research/performance-t7-4-artifacts/`.

## Наблюдения

- LCP-элемент в обоих состояниях и на обоих маршрутах — вводный абзац hero-секции.
- Размер переданных ресурсов снизился с 696 763 до 330 454 байт на `/` и с 686 821 до 346 907 байт на `/impuls/`.
- Итоговый `/` имеет TBT 1 352,5 мс в одном лабораторном прогоне. Это не нарушает acceptance T7.4, но общий performance score не следует трактовать как доказательство полного отсутствия иных performance-задач.
- Это лабораторное сравнение в локальном Nginx parity fixture, а не production RUM. Production не запускался и не изменялся.

## Воспроизведение

После build и генерации precompressed assets:

```powershell
node scripts/run-lighthouse-proof.mjs `
  --checkout (Get-Location).Path `
  --label local-check `
  --output-dir (Join-Path (Get-Location) 'tmp/lighthouse')
```

Требования: работающий Docker Desktop и готовый `out/` в указанном checkout.
