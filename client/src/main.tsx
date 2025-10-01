import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core";
import routes from './routes';

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <RouterProvider router={router} />
  </MantineProvider>
)
