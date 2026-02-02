# Solana Wallet Tracker - Frontend

A modern Next.js dashboard for tracking Solana wallet activities.

## Features

- 🔍 Search wallet by address
- 📊 Interactive charts showing transaction activity
- 📈 Statistics cards (total received, sent, fees, transaction count)
- 📋 Detailed transaction table with filters
- 🔗 Direct links to Solana Explorer
- ⚡ Real-time data from your Rust backend

## Prerequisites

- Node.js 18+ installed
- Your Rust backend server running on `http://localhost:3000`

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create `.env.local` file (already created) and verify the API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Usage

1. Enter a valid Solana wallet address in the search bar
2. Click "Search" to fetch wallet activities
3. View statistics, charts, and detailed transaction history
4. Click on "View" to see transactions on Solana Explorer

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── WalletInput.tsx     # Search input component
│   ├── ActivityTable.tsx   # Transaction table
│   ├── ActivityChart.tsx   # Chart visualization
│   └── StatsCard.tsx       # Statistics cards
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
└── types/
    └── wallet.ts           # TypeScript types
```

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Data Fetching**: SWR (optional, can be added)

## Customization

### Change API URL

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Modify Number of Transactions

In `lib/api.ts`, the backend controls the limit. You can also add query parameters to request more/less transactions.

### Styling

All components use Tailwind CSS. Modify the classes in components or update `tailwind.config.ts` for theme changes.

## Troubleshooting

**Error: "Failed to fetch wallet activities"**

- Ensure your Rust backend is running on port 3000
- Check CORS settings in your backend
- Verify the wallet address is valid

**Port 3000 already in use**

- Your backend is using 3000, so Next.js will auto-assign 3001
- Or change the backend to use a different port

**Dependencies installation fails**

- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you have Node.js 18+

## License

MIT
