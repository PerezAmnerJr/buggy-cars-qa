# Pruebas de Buggy Cars Rating con Playwright

Ejercicio III Serie - Aseguramiento de la Calidad del Software
Universidad Mariano Gálvez de Guatemala

**Estudiante:** Amner Alberto Pérez Marroquín · Carné 1790-22-7230
**Sitio bajo prueba:** https://buggy.justtestit.org/
**Navegador utilizado:** Chromium (Playwright) para los casos automatizados y Google Chrome sobre Windows 11 para los casos manuales.

## Requisitos

- Node.js 18 o superior
- Git

## Instalación

```bash
git clone https://github.com/PerezAmnerJr/buggy-cars-qa.git
cd buggy-cars-qa
npm install
npx playwright install chromium
```

El archivo `.npmrc` contiene `ignore-scripts=true`, por eso el navegador se instala de forma explícita con `npx playwright install chromium`.

## Ejecución de los tests

```bash
npx playwright test                # ejecuta los 3 casos automatizados
npx playwright show-report         # abre el reporte HTML
```

Los tests se ejecutan en serie (`workers: 1`) y sin reintentos, porque el Caso 3 usa el usuario que crea el Caso 1 y el sitio es compartido: cada ejecución crea un solo usuario y vota una sola vez.

## Casos de prueba

| Caso | Tipo | Historia | Descripción | Resultado |
|---|---|---|---|---|
| 1 | Automatizado | HU-1 C1, C2 | Registrar un usuario nuevo con datos válidos | OK |
| 2 | Automatizado | HU-1 C2 | Registro con clave de 7 caracteres debe ser rechazado | OK |
| 3 | Automatizado | HU-3 C1, C2, C4 | Votar por el primer auto de Overall Rating con comentario | FALLO (BUG-001) |
| 4 | Manual | HU-2 C1 | Actualizar el perfil y verificar que los datos se conservan | OK |
| 5 | Manual | HU-2 C3 | Guardar el perfil con una edad que contiene letras | FALLO (BUG-002) |

La tabla completa está en `documentacion/Casos_de_prueba_Buggy_Cars.xlsx`.

## Defectos encontrados

| ID | Defecto | Prioridad |
|---|---|---|
| BUG-001 | La tabla de comentarios del auto no muestra el autor (columna "Author" vacía) | Media |
| BUG-002 | Al guardar el perfil con letras en Age se muestra "Get a candy ;)" en lugar de un mensaje de validación | Media |

El reporte completo está en `documentacion/Reporte_de_errores_Buggy_Cars.docx`.

## Estructura del repositorio

```
buggy-cars-qa/
├── tests/
│   └── buggy-cars.spec.ts        # 3 casos automatizados
├── documentacion/
│   ├── Casos_de_prueba_Buggy_Cars.xlsx
│   └── Reporte_de_errores_Buggy_Cars.docx
├── evidencias/                   # capturas de los casos manuales y defectos
├── playwright.config.ts
├── .npmrc
├── .gitignore
└── README.md
```
