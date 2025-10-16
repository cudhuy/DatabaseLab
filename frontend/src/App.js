import { Box } from "@mui/material";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import routes from "src/configs/routes";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/ClockLoader";
import MainLayout from "src/layout/MainLayout";
import { Helmet } from "react-helmet";
import clsx from "clsx";
import { css } from "@emotion/react";
import { checkAuth, selectAuthSlice, selectRole } from "src/redux/slices/auth-slice";
import { useSnackbar } from "notistack";
import { useTheme, styled } from "@mui/system";
import { fetchAllGames, fetchCommonPrice } from "./redux/slices/gameslice";
import { fetchEvent } from "./redux/slices/eventSliceV2";
import { fetchVIPAccount } from "./redux/slices/vipSlice";
import { checkTheme } from "./redux/slices/themeSlice";

//delay of browser
const override = css`
    display: block;
    margin: 0 auto;
`;

const CustomClass = styled(Box)(() => ({
    ".loader": {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const App = () => {
    const LayoutTag = MainLayout;
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const theme = useTheme();
    // const role = useSelector((state) => selectRole(state));
    // const navigate = useNavigate();

    useEffect(() => {
        init();
    }, []);
    const init = async () => {
        setLoading(true);
        await dp(checkAuth(eq));
        await Promise.all([dp(fetchAllGames()), dp(fetchEvent()), dp(fetchCommonPrice())]);
        // if (role == "admin") {
        //     navigate("/admin/accountmanagement");
        // } else {
        //     navigate("/staff/paymentmanagement");
        // }
        setLoading(false);
    };

    return (
        <CustomClass>
            {loading ? (
                <Box className={"loader"}>
                    <FadeLoader color={theme.palette.primary.main} size={100} css={override} speedMultiplier={2} />
                </Box>
            ) : (
                <LayoutTag>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                element={
                                    <Suspense
                                        fallback={
                                            <Box>
                                                <Box py={2}></Box>
                                                <FadeLoader
                                                    color={theme.palette.primary.main}
                                                    size={100}
                                                    speedMultiplier={2}
                                                    css={override}
                                                />
                                            </Box>
                                        }
                                    >
                                        <Helmet>
                                            <meta property="og:url" content={window.location.href} />
                                            <meta name="twitter:url" content={window.location.href} />
                                        </Helmet>
                                        <Box
                                            className={clsx({
                                                [`animate__animated animate__${route.animation}`]: Boolean(
                                                    route.animation
                                                ),
                                            })}
                                        >
                                            <route.component />
                                        </Box>
                                    </Suspense>
                                }
                            />
                        ))}
                        <Route path="*" element={<Navigate to={"/home"} replace />} />
                    </Routes>
                </LayoutTag>
            )}
        </CustomClass>
    );
};

export default App;
