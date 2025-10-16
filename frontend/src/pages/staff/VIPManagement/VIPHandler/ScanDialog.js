import React from "react";
import { Box } from "@mui/material";
import QrScan from "react-qr-reader";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const ScanDialog = ({ setCode, closeDialog, setFiveChar }) => {
    const { enqueueSnackbar: eq } = useSnackbar();
    const handleScan = (data) => {
        if (data) {
            setCode(data);
            setFiveChar("");
            eq("QR Scan OK", SUCCESS_TOP_CENTER);
            closeDialog();
        }
    };
    const handleError = (err) => {
        console.error(err);
        eq(err, ERR_TOP_CENTER);
        closeDialog();
    };

    return (
        <Box>
            <QrScan delay={300} onError={handleError} onScan={handleScan} style={{ minWidth: 360, minHeight: 240 }} />
        </Box>
    );
};

export default ScanDialog;
