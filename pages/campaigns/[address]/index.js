import {
    Card,
    CardContent,
    Grid,
    Typography,
    Link as MUILink,
    Button,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import ContributeForm from "../../../components/ContributeForm";
import Layout from "../../../components/Layout";
import { campaign as FetchCampaign, web3 } from "../../../ethereum";

const Campaign = ({
    address,
    manager,
    balance,
    requestsCount,
    approversCount,
    minimumContribution,
}) => {
    const renderCards = () => {
        const transformedArray = [
            {
                name: "Current Campaign Balance (ether)",
                qty: web3.utils.fromWei(balance, "ether"),
            },
            {
                name: "Minimum Contribution (wei)",
                qty: minimumContribution,
            },
            {
                name: "Requests",
                qty: requestsCount,
            },
            {
                name: "Contributors",
                qty: approversCount,
            },
        ];
        return transformedArray.map((ele, i) => (
            <Grid item xs={6} key={i}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography
                            pb="1rem"
                            fontWeight={"bold"}
                            fontSize="2rem">
                            {ele.qty}
                        </Typography>
                        <Typography variant="h6">{ele.name}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        ));
    };

    return (
        <Layout>
            <Typography variant="h4">Campaign: {address}</Typography>
            <br />
            <Typography variant="h4">Managed By: {manager}</Typography>
            <Grid container spacing={4} mt="2rem">
                <Grid item spacing={2} container xs={8}>
                    {renderCards()}
                </Grid>
                <Grid item xs={4}>
                    <ContributeForm address={address} />
                </Grid>
            </Grid>
            <br />
            <Link href={`/campaigns/${address}/requests`} passHref>
                <MUILink
                    color="inherit"
                    underline="none"
                    sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                    <Button variant="contained">View Requests</Button>
                </MUILink>
            </Link>
        </Layout>
    );
};

export const getServerSideProps = async ({ query: { address } }) => {
    const campaign = FetchCampaign(address);
    const summary = await campaign.methods.getSummary().call();

    return {
        props: {
            address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        },
    };
};

export default Campaign;
