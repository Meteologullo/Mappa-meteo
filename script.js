import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config (lettura pubblica OK)
const firebaseConfig = {
  // Se usi funzionalità private, reinserisci qui la tua chiave API:
  // apiKey: "INSERISCI_LA_TUA_API_KEY",
  authDomain: "meteo-estremami.firebaseapp.com",
  projectId: "meteo-estremami",
  storageBucket: "meteo-estremami.firebasestorage.app",
  messagingSenderId: "469441159034",
  appId: "1:469441159034:web:b687adef4a7a742499c0c3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const stazioni = [
  { stationId: "ICOSEN11", lat: 39.32, lon: 16.26 },
  { stationId: "IAMANT6", lat: 39.13, lon: 16.07 },
  { stationId: "ICELIC1", lat: 39.33, lon: 16.4 },
  { stationId: "ICOSEN20", lat: 39.31, lon: 16.23 },
  { stationId: "IMENDI13", lat: 39.28, lon: 16.2 },
  { stationId: "ICASAL40", lat: 39.28, lon: 16.29 },
  { stationId: "CATCENTRO", lat: 38.91, lon: 16.59, openMeteo: true }
];

const datiTabella = [];
const markersById = {};

function getColor(val) {
  if (val <= 0) return "#0033cc";
  if (val <= 10) return "#3366ff";
  if (val <= 20) return "#66ccff";
  if (val <= 30) return "#ff9933";
  return "#ff3300";
}

function getColorUmidita(val) {
  if (val <= 20) return "#ff5500";
  if (val <= 40) return "#ffaa00";
  if (val <= 60) return "#88cc44";
  if (val <= 80) return "#44aaff";
  return "#0055ff";
}

function getColorVento(val) {
  const r = Math.min(255, Math.round(val * 5));
  const g = Math.max(0, 255 - Math.round(val * 3));
  return `rgb(${r},${g},60)`;
}

function getTextColorForBackground(bg) {
  return "#fff";
}

window.visualizzaAttuali = function () {
  datiTabella.forEach((d) => {
    const marker = markersById[d.stationId];
    if (!isNaN(d.tempVal) && marker) {
      const el = marker.getElement();
      if (el) {
        const colore = getColor(d.tempVal);
        el.innerHTML = `<span style='color:${getTextColorForBackground(colore)};'>${d.temp}°</span>`;
        el.style.backgroundColor = colore;
      }
    }
  });
};

window.visualizzaEstremi = function (tipo) {
  datiTabella.forEach((d) => {
    const valore = tipo === "max" ? d.max : d.min;
    const marker = markersById[d.stationId];
    if (typeof valore !== 'undefined' && marker) {
      const colore = getColor(valore);
      const el = marker.getElement();
      if (el) {
        el.innerHTML = `<span style='color:${getTextColorForBackground(colore)};'>${valore.toFixed(1)}°</span>`;
        el.style.backgroundColor = colore;
      }
    }
  });
};

window.visualizzaUmidita = function () {
  datiTabella.forEach((d) => {
    const marker = markersById[d.stationId];
    if (typeof d.umidita !== 'undefined' && marker) {
      const el = marker.getElement();
      if (el) {
        const colore = getColorUmidita(d.umidita);
        el.innerHTML = `<span style='color:${getTextColorForBackground(colore)};'>${d.umidita}%</span>`;
        el.style.backgroundColor = colore;
      }
    }
  });
};

window.visualizzaRaffiche = function () {
  datiTabella.forEach((d) => {
    const marker = markersById[d.stationId];
    if (typeof d.raffica !== 'undefined' && marker) {
      const el = marker.getElement();
      if (el) {
        const colore = getColorVento(d.raffica);
        el.innerHTML = `<span style='color:${getTextColorForBackground(colore)};'>${d.raffica}</span>`;
        el.style.backgroundColor = colore;
      }
    }
  });
};

window.visualizzaPioggia = function () {
  datiTabella.forEach((d) => {
    const marker = markersById[d.stationId];
    if (typeof d.pioggia !== 'undefined' && marker) {
      const el = marker.getElement();
      if (el) {
        const colore = d.pioggia > 5 ? "#003366" : "#3399ff";
        el.innerHTML = `<span style='color:white;'>${d.pioggia.toFixed(1)} mm</span>`;
        el.style.backgroundColor = colore;
      }
    }
  });
};

async function caricaDatiOpenMeteo() {
  const richieste = stazioni.filter(s => s.openMeteo).map(async (s) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&current=temperature_2m,precipitation`);
      const data = await res.json();
      datiTabella.push({
        stationId: s.stationId,
        temp: data.current.temperature_2m,
        tempVal: data.current.temperature_2m,
        pioggia: data.current.precipitation,
        umidita: 55,
        raffica: 32,
        min: 10,
        max: 29
      });
    } catch (e) {
      console.error("Errore OpenMeteo", s.stationId, e);
    }
  });
  await Promise.all(richieste);
}

document.addEventListener("DOMContentLoaded", async () => {
  const map = L.map('map', { gestureHandling: true }).setView([39.3, 16.3], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  stazioni.forEach((s) => {
    const div = L.divIcon({ className: 'temperature-label', html: '?' });
    const marker = L.marker([s.lat, s.lon], { icon: div }).addTo(map);
    markersById[s.stationId] = marker;
  });

  await caricaDatiOpenMeteo();
  visualizzaAttuali();
});
