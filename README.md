# Automotive Retail Website

A modern automotive retail website built with Vite, React, TypeScript, and Shopify Polaris components. Includes Google Tag Manager integration with Automotive Standards Council event specifications.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Google Tag Manager:

- Replace `GTM-XXXXXX` in `src/App.tsx` with your actual GTM container ID
- Set up the following data layer events in your GTM container:
  - `test_drive_request`
  - `contact_dealer`

3. Run the development server:

```bash
npm run dev
```

## Features

- Modern UI components using Shopify Polaris
- TypeScript for type safety
- GTM integration with automotive industry standard events
- CTA tracking for test drives and dealer contact

## Event Specifications

### Test Drive Request

```javascript
{
  event: 'test_drive_request',
  vehicle: {
    make: string,
    model: string,
    year: string,
    trim: string
  },
  dealer: {
    id: string,
    name: string
  }
}
```

### Contact Dealer

```javascript
{
  event: 'contact_dealer',
  contact_type: string,
  dealer: {
    id: string,
    name: string
  }
}
```
