nodes_links — monorepo

This repository is a monorepo that uses Yarn workspaces. It contains three main packages:

- `server` — a Node/Express API that serves CSV-backed data.
- `client` — a React + Vite frontend (charts and UI).
- `types` — a small package that exports shared TypeScript types (`@nodes-links/types`) used by both client and server.

The project uses Yarn Workspaces to manage these packages in a single repository, share dependencies, and run workspace scripts.

## Get started

From the repository root run the following:

```bash
# install dependencies for all workspaces
yarn install

# start the development environment (types watcher, server, client)
yarn dev
```

The `yarn dev` script will run the `types` watcher and start the `server` and `client` in development mode concurrently. Open the client in your browser (Vite will print the local URL).

## Client Overview

The client is a modern React application built with the following tech stack:

- **Bundler**: [Vite](https://vitejs.dev/) - Fast development server and build tool
- **Framework**: [React](https://react.dev/) with TypeScript
- **Routing**: [React Router](https://reactrouter.com/) - Manages navigation and routing
- **UI Library**: [Mantine](https://mantine.dev/) - Component library and styling system
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) - Handles API calls, caching, and state management
- **Visualization**: [ECharts](https://echarts.apache.org/) - Powers the data visualization charts

### Project Structure

```
client/
  ├── src/
  │   ├── api/          # API calls and axios setup
  │   ├── components/   # React components including charts
  │   ├── hooks/        # Custom React hooks
  │   ├── pages/        # Route components / pages
  │   ├── routes.ts     # Route definitions
  │   └── main.tsx      # App entry point
  └── vite.config.ts    # Vite configuration
```

## Server Overview

The server is a Node.js/Express API built with TypeScript that serves data from CSV files. Key features:

- **Runtime**: [Node.js](https://nodejs.org/) with TypeScript
- **Framework**: [Express](https://expressjs.com/) - Web framework for routing and middleware
- **Data Source**: CSV files parsed and cached in memory
- **Performance**: Uses [node-cache](https://www.npmjs.com/package/node-cache) to cache processed data
- **Types**: Shares types with client via the `@nodes-links/types` package

### Project Structure

```
server/
  ├── src/
  │   ├── index.ts      # Server entry point and Express setup
  │   ├── db.ts         # CSV data loading and processing
  │   ├── cache.ts      # Caching logic
  │   └── utils.ts      # Helper functions
  ├── data/            # CSV data files
  └── tsconfig.json    # TypeScript configuration
```

### API Endpoints

- `GET /activities` - Returns activity data with properties
  - Query params: `from`, `to` (optional) - Filter activities by date range
- `GET /matrix` - Returns the adjacency matrix data
- `GET /links` - Returns all activity links data (nodes and their connections)
- `GET /activity/:id/links` - Returns links for a specific activity node
- `GET /getActiveNodes` - Returns node activity counts by date range
  - Query params: `from`, `to` - Required date range

---

See the rest of this README for workspace-specific commands and troubleshooting.
