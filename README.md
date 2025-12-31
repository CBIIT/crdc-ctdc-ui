# Introduction

The CTDC UI is the front-end repository of NCI's Clinical and Translational Data Commons (CTDC) project, built on FNLCR's Bento Framework. It is a React application utilizing JavaScript, CSS, MUI, Babel, Jest, and Apollo Client, among other dependencies.

[![Coverage Status](https://coveralls.io/repos/github/CBIIT/crdc-ctdc-ui/badge.svg)](https://coveralls.io/github/CBIIT/crdc-ctdc-ui)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/249be7203f084fa9bb7482e7ddcb626a)](https://app.codacy.com/gh/CBIIT/crdc-ctdc-ui/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

---

**Prerequisites:**
- Node.js 16.17.1
- npm 8.15.0

---

## Installation

To run the CTDC UI project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/CBIIT/crdc-ctdc-ui.git
    cd crdc-ctdc-ui
    ```
2. **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```
3. **Start the development server:**
    ```bash
    npm start
    ```
4. **Open your browser and visit [http://localhost:3000](http://localhost:3000)** to access the application.

To update backend or other service API, edit the configuration in [`public/injectEnv.js`](public/injectEnv.js).

---

## Scripts

- `npm start` – Run the app in development mode at [http://localhost:3000](http://localhost:3000)
- `npm test` – Run tests in watch mode (Jest & React Testing Library)
- `npm run build` – Build the app for production to the `build` folder

