import {
    FormControl,
    FormGroup,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import Layout from "../../components/Layout";
import { factory, web3 } from "../../ethereum";
import { useRouter } from "next/router";

const NewCampaign = () => {
    const [minContribution, setMinContribution] = useState("");
    const [formError, setFormError] = useState({
        error: false,
        errorMessage: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setFormError({ error: false, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minContribution).send({
                from: accounts[0],
            });
            router.replace("/");
        } catch (error) {
            setFormError({
                error: true,
                errorMessage: error.message,
            });
        }
        setIsLoading(false);
    };
    return (
        <Layout>
            <h2>Create a new Campaign</h2>
            <form>
                <FormGroup sx={{ pb: "2rem" }}>
                    <FormControl error={formError.error}>
                        <Typography variant="h6" component={"label"}>
                            Minimum Contribution
                        </Typography>
                        <OutlinedInput
                            value={minContribution}
                            error={formError.error}
                            onChange={(event) =>
                                setMinContribution(event.target.value)
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    wei
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
                    Create!
                </LoadingButton>
            </form>
        </Layout>
    );
};

export default NewCampaign;
