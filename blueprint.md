# 🏋️ 운동 마스터 (Workout Master) - Project Blueprint

A premium, AI-powered workout tracking web application that allows users to log their exercises via voice or text, automatically parsing details like reps, sets, and weight.

## 🎯 Project Overview
- **Goal:** Simplify workout logging using NLP (Natural Language Processing) through regex and voice recognition.
- **Aesthetic:** High-end Dark Mode with Gold (#D4AF37) accents.
- **Target Platform:** Mobile-responsive Web.

## ✨ Key Features
1.  **Smart Input:** 
    *   Voice recognition via Web Speech API.
    *   Natural language text parsing (e.g., "벤치프레스 80kg 8회 5세트").
2.  **Automatic Parsing:** Extract exercise name, weight, reps, and sets using pattern matching.
3.  **Workout DB:** Pre-defined database of exercises with categories and images.
4.  **Persistent Storage:** LocalStorage-based data management, organized by date (YYYY-MM-DD).
5.  **Visual Feedback:** Card-based UI showing exercise images and stats.
6.  **Analytics:** Monthly reports including total volume, category breakdown, and most frequent exercises.
7.  **Sharing:** Email reporting functionality.

## 🛠 Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Modern Baseline), JavaScript (ES6+).
- **APIs:** Web Speech API for voice-to-text.
- **Storage:** Browser LocalStorage.
- **Icons/Images:** High-quality placeholders or CDN-linked fitness imagery.

## 📂 File Structure
- `index.html`: Main UI structure and modals.
- `style.css`: Dark/Gold premium styling and responsive layouts.
- `main.js`: Core logic (Speech, Parsing, Storage, Stats).
- `blueprint.md`: This document.
