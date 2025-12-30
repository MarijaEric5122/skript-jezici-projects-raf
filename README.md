# Skript Jezici — University Projects (RAF)

This repository contains a collection of projects completed as part of the **Skript Jezici** course at RAF.
The projects were implemented progressively through several development phases — from basic web apps,
to Vue applications with authentication, gallery features, JWT handling and collaborative drawing.

The goal of these projects was to practice:
- JavaScript & frontend application architecture
- working with public REST APIs
- Vue ecosystem (Pinia, Router, components, state)
- authentication & authorization (JWT)
- gallery management and CRUD operations
- backend integration and validation
- collaborative real-time drawing features

---

## 📁 Project structure

Each project phase is located in a separate folder:

### 🟢 Projekat 1 — Museum API Website  
`projekat1-museum-api`

Vanilla JS web application that consumes  
**The Metropolitan Museum of Art public API**.

Features include:
- browsing departments
- search with query parameters
- paginated results (10 per page)
- artwork detail page with metadata
- shared navbar and navigation elements

Technologies:  
HTML, CSS, JavaScript, Fetch API

---

### 🔵 Projekat 2 — Pixel Draw App (KT1)  
`projekat2-pixel-draw-kt1`

Vue application setup and base drawing page.

Includes:
- Vue + TypeScript + Pinia + Router
- navigation pages (Home, Gallery, Login, Register…)
- drawing page with:
  - canvas grid
  - color picker
  - pencil tool

Canvas is implemented as a pixel-matrix grid built from HTML elements.

Technologies:  
Vue, TypeScript, Pinia, Router

---

### 🟣 Projekat 3 — Pixel Draw App (KT2)  
`projekat3-pixel-draw-kt2`

Extends previous version with:
- authentication (Login / Register)
- JWT token storage via Pinia + localStorage
- gallery view with pagination
- filtering by author
- creating & saving drawings
- editing existing drawings (only if author)
- delete confirmation dialog
- eraser tool
- canvas resize with value constraints

Technologies:  
Vue, TypeScript, Pinia, REST API, JWT

---

### 🔴 Projekat 4 — Pixel Draw App — Collaborative Mode (KT3)  
`projekat4-pixel-draw-kt3`

Adds backend integration and collaborative drawing.

Key features:
- multiple users drawing on the same canvas
- visible user cursors & usernames
- only author can permanently save changes
- backend validation & entity permissions
- error handling based on API error codes

Focus was on:
- API specification compliance
- backend communication
- integration-testing compatibility

Technologies:  
Vue, TypeScript, REST API, JWT, backend integration

---

## 👩‍💻 Author

Marija Erić  
Final-year Computer Engineering student — RAF Belgrade

More projects coming soon 🙂
