import { AppShell, Burger, Flex } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Outlet } from "react-router"

const Layout = () => {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            padding={"md"}
            header={{ height: 60 }}
            navbar={{
                width: 250,
                breakpoint: "sm",
                collapsed: { mobile: !opened, desktop: !opened },
            }}
        >
            <AppShell.Header px={5} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Flex align={"center"} gap={"md"}>
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    Hi Links of Nodes
                </Flex>
            </AppShell.Header>
            <AppShell.Navbar>
                Navbar
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
export default Layout