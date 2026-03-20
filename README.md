# The Big Long — Dashboard Financiero
**Máximo Ricciardi · Asesor Financiero**

## Stack
- React 18 + Vite
- Deploy: Vercel (gratuito)
- Actualizaciones: editar `src/App.jsx` y hacer push a GitHub

## Estructura del proyecto
```
the-big-long/
├── src/
│   ├── App.jsx        ← ARCHIVO PRINCIPAL (toda la app está acá)
│   └── main.jsx       ← Entry point (no tocar)
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Flujo de actualización diaria
1. Recibir archivo `App.jsx` actualizado de Claude
2. Reemplazar `src/App.jsx` con el nuevo archivo
3. `git add . && git commit -m "update 20 mar 2026" && git push`
4. Vercel publica automáticamente en ~1 minuto ✅

## Setup inicial (una sola vez)

### 1. Instalar Node.js
→ https://nodejs.org (descargar versión LTS)

### 2. Crear cuenta GitHub
→ https://github.com → Sign up (gratis)

### 3. Crear repo en GitHub
- Click "New repository"
- Nombre: `the-big-long`
- Privado o público (a elección)
- NO inicializar con README

### 4. Subir este proyecto
Abrir Terminal (Mac/Linux) o Command Prompt (Windows) en la carpeta del proyecto:
```bash
cd the-big-long
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/the-big-long.git
git push -u origin main
```

### 5. Deploy en Vercel
1. Ir a https://vercel.com → Sign up con GitHub
2. Click "New Project"
3. Importar el repo `the-big-long`
4. Configuración automática detecta Vite — solo hacer click en **Deploy**
5. En ~2 minutos: `https://the-big-long.vercel.app` ✅

### 6. Dominio propio (opcional)
En Vercel → Settings → Domains → agregar dominio propio

## Actualización diaria (rutina)
```bash
# 1. Reemplazar App.jsx con el nuevo de Claude
cp ~/Downloads/research-dashboard.jsx src/App.jsx

# 2. Publicar
git add src/App.jsx
git commit -m "update $(date +%d-%m-%Y)"
git push
```
Vercel detecta el push y publica solo. En 60 segundos está online.

## Desarrollo local (opcional)
```bash
npm install
npm run dev
# → http://localhost:5173
```
