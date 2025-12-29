const BakingApp = {
    allIngredients: {},
    products: {},
    currentWeight: 1000,
    activeProduct: null,

    async init() {
        try {
            const dataFiles = [
                'flours', 'starters', 'fats', 'liquids',
                'seeds', 'spices', 'globals', 'improvers'
            ];

            const results = await Promise.all([
                ...dataFiles.map(f => fetch(`data/${f}.json`).then(r => r.json())),
                fetch('data/products.json').then(r => r.json())
            ]);

            this.products = results.pop();
            this.allIngredients = Object.assign({}, ...results);

            this.setupEventListeners();
            this.renderProductSelector();

            console.log("Rendszer kész.");
        } catch (err) {
            console.error("Hiba az inicializálásnál:", err);
        }
    },

    setupEventListeners() {
        const select = document.getElementById('productSelect');
        const range = document.getElementById('weightRange');

        select.addEventListener('change', (e) => this.loadProduct(e.target.value));
        range.addEventListener('input', (e) => {
            this.currentWeight = e.target.value;
            const valDisplay = document.getElementById('weightValue');
            if (valDisplay) valDisplay.innerText = this.currentWeight;
            this.updateCalculations();
        });
    },

    renderProductSelector() {
        const select = document.getElementById('productSelect');
        select.innerHTML = '<option value="">Válassz...</option>' +
            Object.entries(this.products).map(([id, p]) =>
                `<option value="${id}">${p.name}</option>`).join('');
    },

    loadProduct(id) {
        if (!id) return;
        this.activeProduct = this.products[id];

        // 1. Visszaállítjuk a belső súlyt az alapértelmezett 1000-re
        this.currentWeight = 1000;

        // 2. Frissítjük a UI-t, hogy mutassa az 1000-et
        const range = document.getElementById('weightRange');
        const display = document.getElementById('weightValue');
        if (range) range.value = 1000;
        if (display) display.innerText = 1000;

        // 3. Megjelenítjük az appot és kalkulálunk
        const appElem = document.getElementById('app');
        if (appElem) appElem.classList.remove('hidden');
        this.updateCalculations();
    },

    updateCalculations() {
        if (!this.activeProduct) return;

        const container = document.getElementById('ingredientsContainer');
        container.innerHTML = '';

        // --- 1. ÖSSZETEVŐK MEGJELENÍTÉSE ---
        Object.entries(this.activeProduct.recipe).forEach(([category, items]) => {
            const section = document.createElement('div');
            section.className = 'category-block';

            const title = {
                flours: 'Lisztek', starters: 'Starterek', liquids: 'Folyadékok',
                fats: 'Zsiradékok', seeds: 'Magvak', spices: 'Fűszerek',
                globals: 'Globális anyagok', improvers: 'Állományjavítók'
            }[category] || category;

            let html = `<h3>${title}</h3><ul>`;
            items.forEach(item => {
                const info = this.allIngredients[item.id] || { name: item.id };
                const rawAmount = this.currentWeight * item.ratio;

                // SZABÁLY: Ha az arány >= 5% (0.05), akkor kerekítünk egészre.
                // Ha < 5%, akkor marad 1 tizedesjegy.
                const displayAmount = item.ratio < 0.05
                    ? rawAmount.toFixed(1)
                    : Math.round(rawAmount);

                html += `<li><strong>${info.name}:</strong> ${displayAmount}g</li>`;
            });
            html += '</ul>';
            section.innerHTML = html;
            container.appendChild(section);
        });
        // --- 2. IDŐTERV MEGJELENÍTÉSE ---
        if (this.activeProduct.times) {
            const timeSection = document.createElement('div');
            timeSection.className = 'category-block time-block';
            const t = this.activeProduct.times;
            timeSection.innerHTML = `
                <h3>Technológiai idők</h3>
                <ul>
                    <li><strong>Érés (Bulk):</strong> ${t.bulk_fermentation} perc</li>
                    <li><strong>Pihentetés:</strong> ${t.rest_after_shaping} perc</li>
                    <li><strong>Záró kelesztés:</strong> ${t.final_proof} perc</li>
                </ul>
            `;
            container.appendChild(timeSection);
        }

        // --- 3. 4 FÁZISÚ SÜTÉSI PROTOKOLL ---
        if (this.activeProduct.baking_protocol) {
            const bakeSection = document.createElement('div');
            bakeSection.className = 'category-block bake-block';
            let bakeHtml = `<h3>Sütési protokoll</h3><div class="phases-container">`;

            this.activeProduct.baking_protocol.forEach((p, index, arr) => {
                const vent = (index > 0 && arr[index - 1].steam && !p.steam) ? '<span class="vent-badge">SZELLŐZTETÉS</span>' : '';
                bakeHtml += `
                    <div class="phase-card">
                        <div class="phase-num">${p.phase}. fázis ${vent}</div>
                        <div class="phase-temp">${p.temp}°C</div>
                        <div class="phase-time">${p.time} perc</div>
                        <div class="phase-steam ${p.steam ? 'active' : ''}">${p.steam ? 'GŐZ' : 'SZÁRAZ'}</div>
                    </div>
                `;
            });
            bakeHtml += `</div>`;
            bakeSection.innerHTML = bakeHtml;
            container.appendChild(bakeSection);
        }
    }
};

BakingApp.init();