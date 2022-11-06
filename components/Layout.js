import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <Container>{children}</Container>
        </>
    );
};

export default Layout;
