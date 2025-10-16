import React, { useState, Fragment } from "react";
import { Button } from "@mui/material";
import { BeatLoader } from "react-spinners";
import EditDialog from "./EditDialog";

const EditButton = (props) => {
    const { loadingDelete, setLoadingDelete, detail, index, ...buttonProps } = props;
    const disableCreateNew = Boolean(loadingDelete.includes(index));
    const [open, setOpen] = useState(false);
    const openDialog = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button {...buttonProps} onClick={openDialog} disabled={disableCreateNew}>
                Edit
            </Button>
            <EditDialog
                onClose={handleClose}
                open={open}
                loadingDelete={loadingDelete}
                setLoadingDelete={setLoadingDelete}
                index={index}
                detail={detail}
            />
        </Fragment>
    );
};

export default EditButton;
