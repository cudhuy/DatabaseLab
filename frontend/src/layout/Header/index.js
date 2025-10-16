import { Box, Container, Link, Paper, List, ListItem, Button, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useEffect } from "react";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import navigationConfig, { rightNavConfig, adminNavConfig, staffNavConfig } from "src/configs/navigation";
import { FS } from "src/redux/slices/other/constant";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SideBar from "src/layout/SideBar";
import logoImg from "src/assets/images/logos/Tinkerbellgarden.png";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import LoginButton from "src/components/LoginButton";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "src/redux/slices/auth-slice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { triggerMode } from "src/redux/slices/themeSlice";
import LightModeIcon from "@mui/icons-material/LightMode";

const CustomClass = styled(Box)((theme) => ({
    ".activeLink": {
        backgroundColor: theme.theme.palette.primary.main,
        color: String(theme.theme.palette.background.header.chosenText) + " !important",
        paddingBottom: "6px",
    },
    ".navLink": {
        height: 65,
        padding: theme.theme.spacing(1, 1.5),
        margin: theme.theme.spacing(0, 1),
        color: theme.theme.palette.primary.main,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        fontSize: "1.2rem",
        cursor: "pointer",
        transition: "color 300ms linear",
        textTransform: "capitalize",
        fontWeight: "bold",
        "&:hover": {
            color: theme.theme.palette.commonText.black,
        },
    },
    ".root": {
        height: 65,
        boxShadow: theme.theme.palette.shadow.main,
        backgroundColor: theme.theme.palette.background.header.main,
        borderRadius: "10px",
        zIndex: theme.theme.zIndex.appBar,
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    ".dropdown": {
        position: "relative",
        "&:hover .dropdownContent": {
            visibility: "visible",
            opacity: 1,
        },
    },
    ".dropdownContent": {
        position: "absolute",
        top: "100%",
        right: 0,
        minWidth: "100%",
        zIndex: 100,
        visibility: "hidden",
        opacity: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    ".dropdownItem": {
        padding: theme.theme.spacing(0.5, 1),
        "& .navLink": {
            height: "auto",
            color: "red",
            whiteSpace: "nowrap",
            width: "100%",
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
        "& .activeLink": {
            border: 0,
            color: "red",
        },
    },
    ".boxContainer": {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
        margin: "auto",
        height: 59,
        padding: theme.theme.spacing(0, 0.5),
        [theme.theme.breakpoints.down("xs")]: {
            padding: theme.theme.spacing(1.5, 2),
        },
    },
}));

export default function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.up("lg"));
    const showLogo = useMediaQuery(theme.breakpoints.up("sm"));
    const role = useSelector((state) => selectRole(state));
    const [navConfig, setNavConfig] = useState(navigationConfig);
    const event = useSelector((state) => state.eventSliceV2.event);
    const loadingBookTicket = useSelector((state) => state.ticketSlice.loadingBookTicket);
    const dp = useDispatch();
    const { isDarkMode } = useSelector((state) => state.themeSlice);

    const [bookDialogIsOpen, setOpenBookDialog] = useState(false);
    const openBookDialog = () => {
        setOpenBookDialog(true);
    };
    const closeBookDialog = () => {
        setOpenBookDialog(false);
    };

    const changeMode = () => {
        dp(triggerMode());
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (role == "admin") {
            setNavConfig(adminNavConfig);
        } else if (role == "staff") {
            setNavConfig(staffNavConfig);
        } else {
            setNavConfig(navigationConfig);
        }
        if (role == "admin") {
            navigate("/admin/accountmanagement");
        } else if (role == "staff") {
            navigate("/staff/paymentmanagement");
        }
    }, [role]);

    function renderNav(navConfig) {
        const renderItem = (item) => {
            const AnchorTag = item.externalLink ? Link : NavLink;
            return (
                <AnchorTag
                    key={item.id}
                    className={({ isActive }) => (isActive ? "navLink activeLink" : "navLink")}
                    href={item.externalLink ? item.navLink : undefined}
                    target={item.newTab ? "_blank" : undefined}
                    to={item.externalLink ? undefined : item.navLink}
                >
                    {item.icon}
                    &nbsp;{item.title}
                    {item.externalLink && (
                        <OpenInNewOutlinedIcon
                            style={{
                                marginLeft: 4,
                                marginBottom: -3,
                                fontSize: "1rem",
                            }}
                        />
                    )}
                </AnchorTag>
            );
        };

        return navConfig.map((item) => {
            return item.children ? (
                <div key={item.id} className={"second-font navLink dropdown"}>
                    {item.icon}
                    <Box px={0.2}></Box>
                    <Box lineHeight={1}>{item.title}</Box>
                    <ExpandMoreOutlinedIcon fontSize="small" />
                    <Paper elevation={0} className={"dropdownContent"}>
                        <List component="ul">
                            {item.children.map((cItem) => {
                                return (
                                    <ListItem key={cItem.id} button className={"dropdownItem"}>
                                        {renderItem(cItem)}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </div>
            ) : (
                renderItem(item)
            );
        });
    }

    return (
        <CustomClass>
            <Box className={"root"}>
                <Container maxWidth="xl">
                    <Box className="boxContainer">
                        <Box display="flex" alignItems="center">
                            {showLogo && (
                                <Box display="flex" alignItems="center" mr={5}>
                                    <Link component={RouterLink} to="/">
                                        <img height={50} src={logoImg} alt="logo" />
                                    </Link>
                                </Box>
                            )}
                            {isMobile && (
                                <Box display="flex" alignItems="center">
                                    {renderNav(navConfig)}
                                </Box>
                            )}
                        </Box>
                        <Box display="flex" alignItems="center" height="100%">
                            {/* {!role && event ? (
                                <Box>
                                    <Button
                                        style={{
                                            width: "120px",
                                            borderRadius: "10px",
                                        }}
                                        variant="contained"
                                        startIcon={<BookOnlineIcon />}
                                        onClick={openBookDialog}
                                        disabled={loadingBookTicket == FS.FETCHING}
                                    >
                                        {loadingBookTicket == FS.FETCHING ? (
                                            <BeatLoader color="#fff" size={8} />
                                        ) : (
                                            <Typography
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                Book
                                            </Typography>
                                        )}
                                    </Button>
                                    <BookingDialog {...{ bookDialogIsOpen, closeBookDialog }} />
                                </Box>
                            ) : null} */}
                            <Box px={1}></Box>
                            <LoginButton />
                            <Box px={1}></Box>
                            <IconButton onClick={changeMode} size="small">
                                {!isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                            {isMobile && <Box>{renderNav(rightNavConfig)}</Box>}
                            {!isMobile && <SideBar navConfig={navConfig} />}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </CustomClass>
    );
}
