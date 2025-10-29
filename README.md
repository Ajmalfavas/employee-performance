# employee-performance
Create a modular Angular application for displaying and managing employee performance metrics using charts and forms.

## Prerequisites
- Node.js 18+ and npm
- Angular CLI (optional for global usage):
  - npm i -g @angular/cli

## Install
1) Install dependencies
   - npm install

2) Install charting library (Apache ECharts)
   - npm install echarts

## Run the app (dev)
- npm start
- Open http://localhost:4200

## Run tests
- npm test

## Build for production
- npm run build

## Notes
- Charts use Apache ECharts via the standalone `app-chart` component.
- Routes are lazy-loaded for features like Dashboard, Reports, and Settings.