import { Add } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
    Link as MUILink,
} from "@mui/material";
import Link from "next/link";
import Layout from "../components/Layout";
import { factory } from "../ethereum";

const AllCampaigns = ({ campaigns }) => {
    const renderCampaigns = () => {
        if (campaigns.length <= 0) {
            return (
                <Typography variant="h4" textAlign={"center"}>
                    There are no Campaigns!!
                </Typography>
            );
        }
        return campaigns.map((address) => {
            return (
                <Card key={address} sx={{ mb: "2rem" }}>
                    <CardContent>
                        <Typography variant="h4">{address}</Typography>
                    </CardContent>
                    <CardActions>
                        <Link href={`/campaigns/${address}`} passHref>
                            <MUILink
                                color="inherit"
                                underline="none"
                                sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                                <Button>View Campaign</Button>
                            </MUILink>
                        </Link>
                    </CardActions>
                </Card>
            );
        });
    };

    return (
        <Layout>
            <Typography variant="h3">Open Campaigns</Typography>
            <br />
            <Grid container spacing={4}>
                <Grid item>{renderCampaigns()}</Grid>
                <Grid item>
                    <Link href="/campaigns/new" passHref>
                        <MUILink
                            color="inherit"
                            underline="none"
                            sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                            <Button variant="contained" endIcon={<Add />}>
                                Create Campaign
                            </Button>
                        </MUILink>
                    </Link>
                </Grid>
            </Grid>
        </Layout>
    );
};

export const getServerSideProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return {
        props: {
            campaigns,
        },
    };
};

export default AllCampaigns;
