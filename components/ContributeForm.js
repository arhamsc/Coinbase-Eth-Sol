import { LoadingButton } from "@mui/lab";
import {
    FormControl,
    FormGroup,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { campaign, web3 } from "../ethereum";

const ContributeForm = ({ address }) => {
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
            await campaign(address)
                .methods.contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(minContribution, "ether"),
                });
            router.replace(`campaigns/${address}`);
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
        <>
            <h4>Contribute to this Campaign</h4>
            <form>
                <FormGroup sx={{ pb: "2rem" }}>
                    <FormControl error={formError.error}>
                        <OutlinedInput
                            value={minContribution}
                            error={formError.error}
                            onChange={(event) =>
                                setMinContribution(event.target.value)
                            }
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
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    onClick={onSubmit}>
                    Contribute
                </LoadingButton>
            </form>
        </>
    );
};

export default ContributeForm;
