import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Typography,
    FormControl,
    Button,
    TextField,
} from "@mui/material";
import React from "react";
import { styled, useTheme } from "@mui/system";
import Close from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import Slide from "@mui/material/Slide";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { editUser } from "src/redux/slices/listAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const CustomStyle = styled(Box)((theme) => ({
    ".background": {
        backgroundColor: theme.theme.palette.background.header.main,
        overflow: "hidden",
    },
    ".font": {
        color: theme.theme.palette.primary.main,
    },
    ".fontsmall": {
        color: theme.theme.palette.secondary.main,
    },
    ".closeButton": {
        display: "flex",
        justifyContent: "flex-end",
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const EditDialog = ({ onClose, open, loadingDelete, setLoadingDelete, index, detail }) => {
    const theme = useTheme();
    const { enqueueSnackbar: eq } = useSnackbar();
    const auth = useSelector((state) => state.authSlice);
    const validate = (values) => {
        const errors = {};
        if (values.password === "") {
            errors.password = "Please enter password";
        } else if (values.password.length < 8) {
            errors.password = "Password must have at least 8 characters";
        }
        if (values.adminPassword === "") {
            errors.adminPassword = "Please enter admin password";
        } else if (values.adminPassword.length < 8) {
            errors.adminPassword = "Admin Password must have at least 8 characters";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            userName: detail.loginName,
            password: "",
            adminPassword: "",
        },
        validate,
        onSubmit: () => {
            handleEdit();
        },
    });
    const dp = useDispatch();

    const close = () => {
        formik.resetForm();
        onClose();
    };

    const handleEdit = async () => {
        setLoadingDelete([...loadingDelete, index]);
        const data = {
            password: formik.values.password,
            adminPassword: formik.values.adminPassword,
            id: detail.id,
            adminName: auth.accountData.loginName,
        };
        const response = await dp(editUser(data));
        if (response.error) {
            console.log(response.error);
            eq("Error occured!!", ERR_TOP_CENTER);
            setLoadingDelete(loadingDelete.filter((item) => item != index));
            return;
        }
        eq(`Account password changed to ${formik.values.password}`, SUCCESS_TOP_CENTER);
        close();
        setLoadingDelete(loadingDelete.filter((item) => item != index));
        return;
    };
    const onClickLogin = () => {
        formik.submitForm();
    };

    const handleKeyDown = (e) => {
        if (e.key == "Enter") formik.submitForm();
    };

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth={"xs"} TransitionComponent={Transition} keepMounted>
            <CustomStyle>
                <DialogTitle className="background">
                    <Box className="closeButton">
                        <IconButton aria-label="close" onClick={close}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                            fontWeight: "600",
                            fontSize: "40px",
                        }}
                        className="font"
                    >
                        Edit account
                    </Typography>
                </DialogTitle>
                <DialogContent className="background">
                    <Typography style={{ margin: "6px 0px", fontSize: "16px" }}>Username</Typography>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            defaultValue={formik.values.userName}
                            name="userName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBoxIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                            onKeyPress={(e) => handleKeyDown(e)}
                        />
                    </FormControl>
                    <Typography style={{ margin: "8px 0px 6px 0px", fontSize: "16px" }}>Admin Password</Typography>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            type="password"
                            value={formik.values.adminPassword}
                            name="adminPassword"
                            error={!!formik.errors.adminPassword}
                            helperText={formik.errors.adminPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder={"Password"}
                            size="small"
                            onKeyPress={(e) => handleKeyDown(e)}
                        />
                    </FormControl>
                    <Typography style={{ margin: "8px 0px 6px 0px", fontSize: "16px" }}>Password</Typography>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            style={{ height: "40px" }}
                            type="password"
                            value={formik.values.password}
                            name="password"
                            error={!!formik.errors.password}
                            helperText={formik.errors.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder={"Password"}
                            size="small"
                            onKeyPress={(e) => handleKeyDown(e)}
                        />
                    </FormControl>
                    <Box sx={{ marginBottom: "10px" }}></Box>
                </DialogContent>
                <DialogActions className="background">
                    <Button
                        color="primary"
                        variant="contained"
                        style={{
                            display: "flex",
                            flex: 1,
                            margin: "0px 14px 10px 14px",
                            borderRadius: "15px",
                        }}
                        onClick={onClickLogin}
                        disabled={loadingDelete.includes(index)}
                    >
                        {loadingDelete.includes(index) ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Edit account"
                        )}
                    </Button>
                </DialogActions>
            </CustomStyle>
        </Dialog>
    );
};

export default EditDialog;
