#!/bin/bash

# 1. Professzionális HTML váz a gyökérbe
cat <<HTML > index.html
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baking Pro Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <h2>BakingApp</h2>
            <div class="control-group">
                <label>Termék</label>
                <select id="prodSelect">
                    <option value="pogacsa">Tepertős Pogácsa</option>
                    <option value="kenyer">Kovászos Kenyér</option>
                </select>
            </div>
            <div class="control-group">
                <label>Tömeg: <span id="wLabel">1000</span>g</label>
                <input type="range" id="wSlider" min="200" max="5000" step="50" value="1000">
            </div>
        </aside>

        <main class="main-content">
            <header>
                <h1 id="pName">Válassz egy receptet</h1>
            </header>
            
            <section class="stats-grid">
                <div class="stat-card">
                    <h3>Sütési Hőfok</h3>
                    <p class="value"><span id="pTemp">--</span> °C</p>
                </div>
                <div class="stat-card">
                    <h3>Sütési Idő</h3>
                    <p class="value"><span id="pTime">--</span> perc</p>
                </div>
            </section>

            <section class="ingredients">
                <h3>Számított Alapanyagok</h3>
                <ul id="ingList"></ul>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>
HTML

# 2. Modern CSS a gyökérbe
cat <<CSS > style.css
:root { --bg: #f8f9fa; --sidebar: #2d3436; --accent: #e67e22; --text: #2d3436; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); }
.dashboard { display: flex; min-height: 100vh; }
.sidebar { width: 280px; background: var(--sidebar); color: white; padding: 2rem; }
.main-content { flex: 1; padding: 3rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; }
.stat-card .value { font-size: 2.5rem; font-weight: bold; color: var(--accent); margin: 0.5rem 0; }
.control-group { margin-bottom: 1.5rem; }
input[type="range"] { width: 100%; accent-color: var(--accent); }
.ingredients { background: white; padding: 2rem; border-radius: 12px; }
ul { list-style: none; padding: 0; }
li { padding: 0.8rem 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
CSS

# 3. Fájlok szinkronizálása a public mappába (a kérésed szerint)
cp index.html public/index.html
cp style.css public/style.css

echo "✅ UI fájlok elkészültek és a public mappába másolva!"
