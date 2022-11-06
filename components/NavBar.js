import { Add } from "@mui/icons-material";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Link as MUILink,
} from "@mui/material";
import Link from "next/link";

const NavBar = () => {
    return (
        <Box sx={{ flexGrow: 1, pb: "4rem" }}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                        }}>
                        <Link href="/" passHref>
                            <MUILink
                                color="inherit"
                                underline="none"
                                sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                                Coinbase
                            </MUILink>
                        </Link>
                    </Typography>
                    <Link href="/" passHref>
                        <MUILink
                            color="inherit"
                            underline="none"
                            sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                            <Button color="inherit">Campaigns</Button>
                        </MUILink>
                    </Link>

                    <Link href="/campaigns/new" passHref>
                        <MUILink
                            color="inherit"
                            underline="none"
                            sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                            <IconButton color="inherit">
                                <Add />
                            </IconButton>
                        </MUILink>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;
