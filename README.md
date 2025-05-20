# Mappa Meteo Lo Gullo

Benvenuto nella mappa meteo interattiva di Lo Gullo!  
Questo progetto visualizza le condizioni meteo attuali di diverse stazioni in Calabria e zone limitrofe, usando dati in tempo reale da:

- [Open-Meteo API](https://open-meteo.com/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

---

## Link diretto al sito

**[Visita la mappa meteo live](https://meteologullo.github.io/Mappa-meteo/)**

---

## Funzionalità

- Mappa interattiva con **Leaflet**
- Visualizzazione di:
  - **Temperature attuali**
  - **Estremi giornalieri (min/max)**
  - **Umidità relativa**
  - **Raffiche di vento**
  - **Precipitazioni**
- Interfaccia leggera, responsive e navigabile da mobile

---

## Come funziona

- I dati meteo per la stazione “CATCENTRO” vengono recuperati da Open-Meteo.
- Gli estremi (min/max) e altri dati vengono letti da un database Firestore pubblico.
- L'interfaccia è ottimizzata per performance e caricamento veloce, anche da dispositivi mobili.

---

## Come pubblicarlo su GitHub Pages

1. Carica nel tuo repository i 3 file:
   - `index.html`
   - `script.js`
   - `stile.css`
2. Vai in **Settings > Pages**
3. Imposta la pubblicazione da branch `main` e cartella `/root`
4. Accedi al sito all'indirizzo:
