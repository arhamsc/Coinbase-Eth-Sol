import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
    Stack,
    Link as MUILink,
    Button,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";
import { campaign } from "../../../../ethereum";

const ViewRequests = ({ address, requests, approversCount, requestCount }) => {
    const renderRows = () => {
        return requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    approversCount={approversCount}
                />
            );
        });
    };
    return (
        <Layout>
            <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems={"center"}>
                <Link href={`/campaigns/${address}`} passHref>
                    <MUILink
                        color="inherit"
                        underline="none"
                        sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                        <Button variant="contained" startIcon={<ArrowBack />}>
                            Back
                        </Button>
                    </MUILink>
                </Link>
                <h1>List of requests</h1>
                <Link href={`/campaigns/${address}/requests/new`} passHref>
                    <MUILink
                        color="inherit"
                        underline="none"
                        sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                        <Button variant="contained" endIcon={<ArrowForward />}>
                            Add Request
                        </Button>
                    </MUILink>
                </Link>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount(ether)</TableCell>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Approval Count</TableCell>
                        <TableCell>Approve</TableCell>
                        <TableCell>Finalize</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderRows()}</TableBody>
            </Table>
            <Typography mt="2rem">Found {requestCount} requests </Typography>
        </Layout>
    );
};

export const getServerSideProps = async ({ query: { address } }) => {
    const campaignInstance = campaign(address);
    const requestCount = await campaignInstance.methods
        .getRequestsCount()
        .call();
    const approversCount = await campaignInstance.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((ele, index) => {
                return campaignInstance.methods.requests(index).call();
            }),
    );

    return {
        props: {
            address,
            requests: JSON.parse(JSON.stringify(requests)),
            requestCount,
            approversCount: approversCount,
        },
    };
};

export default ViewRequests;
