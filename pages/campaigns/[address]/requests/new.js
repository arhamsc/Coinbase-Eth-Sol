import Layout from "../../../../components/Layout";
import { LoadingButton } from "@mui/lab";
import {
    FormControl,
    FormGroup,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Link as MUILink,
    Button
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { campaign, web3 } from "../../../../ethereum";
import { ArrowBack, Person } from "@mui/icons-material";
import Link from "next/link";

const NewRequest = () => {
    const {
        query: { address },
        replace
    } = useRouter();
    const [formState, setFormState] = useState({
        description: "",
        amount: "",
        recipient: "",
    });
    const [formError, setFormError] = useState({
        error: false,
        errorMessage: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event) => {
        setFormState((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setFormError({ error: false, errorMessage: "" });
        try {
            const { description, amount, recipient } = formState;
            const accounts = await web3.eth.getAccounts();
            await campaign(address)
                .methods.createRequest(
                    description,
                    web3.utils.toWei(amount, "ether"),
                    recipient,
                )
                .send({
                    from: accounts[0],
                });

            replace(`/campaigns/${address}/requests`);
        } catch (error) {
            setFormError({
                error: true,
                errorMessage: error.message,
            });
            setIsLoading(false);
            return;
        }
        setFormError({ error: false, errorMessage: "" });
        setIsLoading(false);
    };
    return (
        <Layout>
            <Link href={`/campaigns/${address}/requests`} passHref>
                <MUILink
                    color="inherit"
                    underline="none"
                    sx={{ ["&:hover"]: { cursor: "pointer" } }}>
                    <Button variant="contained" startIcon={<ArrowBack/>}>Back</Button>
                </MUILink>
            </Link>
            <h1>Create a Request</h1>
            <form>
                <FormGroup sx={{ pb: "2rem" }}>
                    <FormControl error={formError.error}>
                        <label>Description</label>
                        <OutlinedInput
                            value={formState.description}
                            error={formError.error}
                            onChange={onChange}
                            name="description"
                        />
                        {formError.error ? (
                            <FormHelperText>
                                {formError.errorMessage}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                </FormGroup>
                <FormGroup sx={{ pb: "2rem" }}>
                    <FormControl error={formError.error}>
                        <label>Amount</label>
                        <OutlinedInput
                            value={formState.amount}
                            error={formError.error}
                            onChange={onChange}
                            name="amount"
                            endAdornment={
                                <InputAdornment position="end">
                                    ether
                                </InputAdornment>
                            }
                        />
                        {formError.error ? (
                            <FormHelperText>
                                {formError.errorMessage}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                </FormGroup>
                <FormGroup sx={{ pb: "2rem" }}>
                    <FormControl error={formError.error}>
                        <label>Recipient</label>
                        <OutlinedInput
                            value={formState.recipient}
                            error={formError.error}
                            onChange={onChange}
                            name="recipient"
                            endAdornment={
                                <InputAdornment position="end">
                                    <Person />
                                </InputAdornment>
                            }
                        />
                        {formError.error ? (
                            <FormHelperText>
                                {formError.errorMessage}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                </FormGroup>

                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    onClick={onSubmit}>
                    Create
                </LoadingButton>
            </form>
        </Layout>
    );
};

export default NewRequest;
