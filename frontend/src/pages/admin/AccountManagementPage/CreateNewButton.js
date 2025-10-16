import React, { useState, Fragment } from "react";
import { Button } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { createNewUser } from "src/redux/slices/listAccountSlice";
import { useDispatch } from "react-redux";
import CreateDialog from "./CreateDialog";

const CreateNewButton = () => {
    const [loading, setLoading] = useState(false);
    const disableCreateNew = Boolean(loading);
    const [open, setOpen] = useState(false);
    const openDialog = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button
                variant="contained"
                className="button"
                size="large"
                disabled={disableCreateNew}
                onClick={openDialog}
            >
                Create new account
            </Button>
            <CreateDialog onClose={handleClose} open={open} setLoading={setLoading} loading={loading} />
        </Fragment>
    );
};

export default CreateNewButton;
