import { Box, Typography, Grid } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/system";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import WebIcon from "@mui/icons-material/Web";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CallIcon from "@mui/icons-material/Call";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import HomeIcon from "@mui/icons-material/Home";
import ContactUsImage from "../../pages/HomePage/assets/ContactUs.png";
import FacebookImage from "../../pages/HomePage/assets/FacebookLogo.png";
import TwitterImage from "../../pages/HomePage/assets/Twitter-logo.svg.webp";
import YoutubeImage from "../../pages/HomePage/assets/YoutubeLogo.webp";
import GoogleImage from "../../pages/HomePage/assets/GoogleLogo.png";
import { useSelector } from "react-redux";
import { selectRole } from "src/redux/slices/auth-slice";
import { useLocation } from "react-router-dom";

const FooterContainer = styled(Box)((theme) => ({
    backgroundColor: theme.theme.palette.footer,
    ".detailHeader": {
        alignItems: "center",
        color: theme.theme.palette.light.main,
        fontSize: "larger",
        fontWeight: "bold",
    },
    ".text": {
        color: alpha(theme.theme.palette.commonText.black, 0.7),
    },
    ".wrapper": {
        [theme.theme.breakpoints.down("sm")]: {
            marginLeft: "20%",
            width: "fit-content",
        },
        [theme.theme.breakpoints.down("xs")]: {
            marginLeft: "10%",
            width: "fit-content",
        },
    },
    ".icon": {
        fontSize: "medium",
        position: "relative",
        top: "4px",
    },
    ".smallTextWrapper": {
        color: alpha(theme.theme.palette.commonText.black, 0.7),
        cursor: "pointer",
        display: "flex",
        "&:hover": {
            ".icon": {
                color: theme.theme.palette.commonText.white,
            },
            ".text": {
                color: theme.theme.palette.commonText.white,
            },
        },
    },
    ".logo_icon": {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    ".icons": {
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        [theme.theme.breakpoints.down("md")]: {
            width: "150px",
        },
        cursor: "pointer",
    },
    ".lastText": {
        fontSize: "large",
        color: theme.theme.palette.light.main,
        textAlign: "center",
    },
}));

export default function Footer() {
    const role = useSelector((state) => selectRole(state));
    const location = useLocation();
    const theme = useTheme();
    const clickFooter = () => {
        document.documentElement.scrollTop = 0;
    };
    const info = [
        {
            header: "Customer Policy",
            data: ["Gift", "Discount", "Report Policy", "Report Employee"],
            lg: 2.5,
        },
        {
            header: "About Us",
            data: ["Event", "Games", "Member"],
            lg: 2,
        },
        {
            header: "Social Media",
            data: ["fb.com/tindergarden", "TinderGarden.com", "youtube.com/tindergarden"],
            icons: [
                <FacebookIcon key="1" className="icon" />,
                <WebIcon key="2" className="icon" />,
                <YouTubeIcon className="icon" key="3" />,
            ],
            lg: 3.75,
        },
        {
            header: "Contact Us",
            data: ["(+84)38-277-6645", "tinkerbellgarden@gmail.com", "First Street Dai Co Viet"],
            icons: [
                <CallIcon className="icon" key="1" />,
                <AlternateEmailIcon className="icon" key="2" />,
                <HomeIcon className="icon" key="3" />,
            ],
            lg: 3.75,
        },
    ];

    if (role == "staff" || role == "admin" || location.pathname == "/events") {
        return (
            <FooterContainer py={1}>
                <Typography align="center" variant="body2" style={{ color: theme.palette.primary.main }}>
                    Copyright © {new Date().getFullYear()}.
                </Typography>
            </FooterContainer>
        );
    }

    return (
        <FooterContainer style={{ padding: "30px 30px 20px 30px" }}>
            <Grid container justifyContent="center">
                <Grid item md={8} lg={10}>
                    <Grid container spacing={2} display="flex">
                        {info.map((i, index) => (
                            <Grid item xs={12} sm={6} lg={i.lg || 3} key={index}>
                                <Box className="wrapper">
                                    <Typography className="detailHeader">{i.header}</Typography>
                                    <Box py={0.5}></Box>
                                    {i.data.map((d, idx) => (
                                        <Box key={idx} className="smallTextWrapper" onClick={() => clickFooter()}>
                                            {info[index].icons ? info[index].icons[idx] : null}
                                            <Typography className="text" key={idx}>
                                                &nbsp;{d}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Box py={0.5}></Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={2} className="logo_icon">
                    <img src={ContactUsImage} height="150" width={"150"} />
                    <Box py={1}></Box>
                    <Box className="icons" onClick={() => clickFooter()}>
                        <img src={FacebookImage} height="20" width={"20"} />
                        <img src={GoogleImage} height="20" width={"20"} />
                        <img src={TwitterImage} height="20" width={"20"} />
                        <img src={YoutubeImage} height="20" width={"20"} />
                    </Box>
                </Grid>
            </Grid>
            <Box py={1}></Box>
            <Typography className="lastText">
                © {new Date().getFullYear()} TinderGarden.Co . All right reserved
            </Typography>
        </FooterContainer>
    );
}
