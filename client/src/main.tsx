import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core";
import routes from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createBrowserRouter(routes)

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </MantineProvider>
  </QueryClientProvider>
)
