#!/bin/bash

echo "🧹 Felesleges mentések és másolatok törlése..."
rm -rf ormezo-parking-*
rm -rf '*Copy*'

echo "🏗️ Új Namespace struktúra építése..."
mkdir -p .devcontainer .github/workflows public/assets/{icons,products,tech}

# 1. Codespace Config
cat <<JSON > .devcontainer/devcontainer.json
{
  "name": "Baking Dashboard Dev",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "forwardPorts": [5500]
}
JSON

# 2. Namespace-alapú Script.js
cat <<JS > public/script.js
const BakingApp = {
    Data: { materials: {}, tech: {}, products: {} },
    Engine: {
        calculate: (id, weight) => {
            const p = BakingApp.Data.products[id];
            const steps = Math.floor(Math.abs(weight - p.base_weight) / p.scaling.weight_step);
            return {
                temp: weight > p.base_weight ? p.base_temp - (steps * p.scaling.temp_step) : p.base_temp,
                time: weight > p.base_weight ? p.base_time + (p.base_time * p.scaling.time_factor * steps) : p.base_time
            };
        }
    },
    UI: {
        init: async function() {
            const [m, t, p] = await Promise.all([
                fetch('materials.json').then(r => r.json()),
                fetch('technologies.json').then(r => r.json()),
                fetch('products.json').then(r => r.json())
            ]);
            this.Data = { materials: m, tech: t, products: p };
            console.log("✅ BakingApp Namespace és adatok betöltve.");
        }
    }
};
window.addEventListener('DOMContentLoaded', () => BakingApp.UI.init());
JS

# 3. Dummy adatok generálása
echo '{"BL80":{"name":"Kenyérliszt","w_abs":0.65}}' > public/materials.json
echo '{"T_BAKE":{"name":"Sütés","temp":230}}' > public/technologies.json
echo '{"kenyer":{"name":"Kovászos","base_weight":1000,"base_temp":230,"base_time":45,"scaling":{"temp_step":8,"time_factor":0.5,"weight_step":500},"workflow":["T_BAKE"]}}' > public/products.json

echo "✨ Kész! A környezet tiszta, a struktúra Codespace-kész."
