const BakingApp = {
    Data: { materials: {}, tech: {}, products: {} },

    Engine: {
        calculate: function (prodId, weight) {
            const p = BakingApp.Data.products[prodId];
            if (!p) return null;

            const weightDiff = weight - p.base_weight;
            const steps = Math.floor(Math.abs(weightDiff) / p.scaling.weight_step);

            let adjTemp = p.base_temp;
            let adjTime = p.base_time;

            if (weightDiff > 0) {
                adjTemp -= (p.scaling.temp_step * steps);
                adjTime += (p.base_time * p.scaling.time_factor * steps);
            } else if (weightDiff < 0) {
                adjTemp += (p.scaling.temp_step * steps);
                adjTime -= (p.base_time * 0.2 * steps);
            }

            return { temp: adjTemp, time: Math.round(adjTime) };
        }
    },

    UI: {
        init: async function () {
            try {
                const [m, t, p] = await Promise.all([
                    fetch('materials.json').then(r => r.json()),
                    fetch('technologies.json').then(r => r.json()),
                    fetch('products.json').then(r => r.json())
                ]);
                BakingApp.Data.materials = m;
                BakingApp.Data.tech = t;
                BakingApp.Data.products = p;

                this.bindEvents();
                this.render();
                console.log("🚀 BakingApp Online");
            } catch (e) { console.error("Hiba:", e); }
        },

        bindEvents: function () {
            document.getElementById('prodSelect').addEventListener('change', () => this.render());
            document.getElementById('wSlider').addEventListener('input', (e) => {
                document.getElementById('wLabel').innerText = e.target.value;
                this.render();
            });
        },

        render: function () {
            const id = document.getElementById('prodSelect').value;
            const weight = parseInt(document.getElementById('wSlider').value);
            const product = BakingApp.Data.products[id];

            if (!product) return;

            // Engine hívása
            const results = BakingApp.Engine.calculate(id, weight);

            // UI frissítése
            document.getElementById('pName').innerText = product.name;
            document.getElementById('pTemp').innerText = results.temp;
            document.getElementById('pTime').innerText = results.time;

            // Alapanyag lista
            const list = document.getElementById('ingList');
            list.innerHTML = product.ingredients.map(ing => {
                const mat = BakingApp.Data.materials[ing.id];
                const amount = Math.round(weight * ing.ratio);
                return `<li><span>${mat.icon} ${mat.name}</span> <strong>${amount}g</strong></li>`;
            }).join('');
        }
    }
};

window.addEventListener('DOMContentLoaded', () => BakingApp.UI.init());
