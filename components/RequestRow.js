import {
    Button,
    CircularProgress,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { campaign, web3 } from "../ethereum";

const RequestRow = ({ address, request, id, approversCount }) => {
    const readyToFinalize = request.approvalCount > approversCount / 2;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { reload } = useRouter();
    const onApprove = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const campaignInstance = campaign(address);
            const accounts = await web3.eth.getAccounts();
            await campaignInstance.methods.approveRequest(id).send({
                from: accounts[0],
            });
        } catch (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        reload();
    };

    const onFinalize = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const campaignInstance = campaign(address);
            const accounts = await web3.eth.getAccounts();
            await campaignInstance.methods.finalizeRequest(id).send({
                from: accounts[0],
            });
        } catch (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        reload();
    };
    //Did not handle the set Error Message inside the component
    return (
        <TableRow
            bgColor={readyToFinalize && !request.complete ? "#f2ffe6" : null}>
            <TableCell>{id}</TableCell>
            <TableCell>{request.description}</TableCell>
            <TableCell>{web3.utils.fromWei(request.value, "ether")}</TableCell>
            <TableCell>{request.recipient}</TableCell>
            <TableCell>
                {request.approvalCount}/{approversCount}
            </TableCell>
            <TableCell>
                {request.complete ? (
                    <Button disabled>Finalized</Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={onApprove}>
                        {isLoading ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            "Approve"
                        )}
                    </Button>
                )}
            </TableCell>
            <TableCell>
                {request.complete ? (
                    <Button disabled>Finalized</Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onFinalize}>
                        {isLoading ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            "Finalize"
                        )}
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
};

export default RequestRow;
