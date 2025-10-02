import { AppShell, Burger, Button, Flex, NavLink, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Link, Outlet } from "react-router"

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
                    <Button variant="outline" component={Link} to={"/"}>Hi Links of Nodes</Button>
                </Flex>
            </AppShell.Header>
            <AppShell.Navbar>
                <Stack justify="center" align="center" gap={0}>
                    <NavLink onClick={() => toggle()} to={"/"} label="Home" component={Link} />
                    <NavLink onClick={() => toggle()} to={"/activities"} label="Activities" component={Link} />
                    <NavLink onClick={() => toggle()} to={"/links"} label="Links" component={Link} />
                    <NavLink onClick={() => toggle()} to={"/timeline"} label="Timeline" component={Link} />
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
export default Layout