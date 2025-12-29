const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Kiszolgálja a 'public' mappát (index, script, style)
app.use(express.static(path.join(__dirname, 'public')));

// Kiszolgálja a 'data' mappát a JSON fájlokkal
app.use('/data', express.static(path.join(__dirname, 'data')));

// Alapértelmezett útvonal az index.html-hez
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('------------------------------------------');
    console.log('Pékség Dashboard Szerver elindult!');
    console.log('Port: ' + PORT);
    console.log('------------------------------------------');
});
