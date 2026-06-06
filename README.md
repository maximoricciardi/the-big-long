# The Big Long — Dashboard Financiero

**Máximo Ricciardi · Asesor Financiero**

Dashboard financiero para mercado argentino construido con **Next.js**, React y Vercel.

## Stack
- Next.js 15 + React 18
- TypeScript
- Tailwind CSS
- Deploy en Vercel

## Qué hay hoy
- `Inicio` con resumen del día, KPIs, noticias y CTA de WhatsApp.
- `Mercados` con FX, riesgo país, brechas, noticias y calendario de balances.
- `Renta Fija` con LECAPs, soberanos, ONs y calculadoras.
- `Renta Variable` con CEDEARs y screener.
- `Research`, `Productos` y panel de administración oculto.
- Rutas API propias para datos live y agregación de información.

## Estructura real del proyecto
```txt
.
├── app/
│   ├── page.tsx            ← Entrada principal de la app
│   ├── layout.tsx          ← Layout global, fuentes y providers
│   └── api/                ← Route handlers de Next.js
├── components/             ← UI por secciones y componentes reutilizables
├── hooks/                  ← Hooks de datos live y estado
├── lib/                    ← Tema, constantes, utilidades y data local
├── public/
├── styles/
├── types/
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── vercel.json
```

## Nota sobre la carpeta `the-big-long/`
- Esa carpeta es una **copia/legado del proyecto anterior**.
- La app activa vive en la raíz del repo.
- Si editás el dashboard actual, trabajá sobre los archivos de la raíz.

## Desarrollo local
```bash
npm install
npm run dev
```

Luego abrir:
```txt
http://localhost:3000
```

## Scripts útiles
```bash
npm run build
npm run lint
npm run start
```

## Flujo de trabajo sugerido
1. Hacer cambios en la raíz del repo.
2. Verificar localmente con `npm run dev`.
3. Revisar build con `npm run build`.
4. Commit y push a GitHub.
5. Vercel despliega automáticamente.

## Variables y datos
- El tema visual está en `lib/theme.ts` y `lib/theme-context.tsx`.
- Las constantes generales están en `lib/constants.ts`.
- Los datos financieros específicos viven en `lib/data/` y `lib/renta-fija/`.
- Las rutas API consumen fuentes externas y normalizan la información para la UI.

## Convenciones
- La app prioriza datos live cuando están disponibles.
- Las vistas están separadas por dominio funcional.
- El estilo visual busca ser sobrio, claro y orientado a lectura rápida.
