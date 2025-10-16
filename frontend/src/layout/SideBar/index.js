import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    Link,
    Collapse,
    Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { Fragment, useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";

import { rightNavConfig } from "src/configs/navigation";
import logo from "src/assets/images/logos/tinkerbellgarden2.png";
// can import many logo same name to use when event happen
import clsx from "clsx";
import { styled } from "@mui/system";

const CustomStyle = styled(Box)((theme) => ({
    ".menuIconBtn": {
        marginRight: "-1.5",
    },
    ".sidebarList": {
        minWidth: "250px",
    },
    ".listItem": {
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: "large",
        cursor: "pointer",
        margin: "0px 8px",
        color: alpha(theme.theme.palette.background.header.chosenText, 0.65),
    },
    ".selectListItem": {
        textTransform: "capitalize",
        cursor: "pointer",
        margin: theme.theme.spacing(1, 1),
        color: theme.theme.palette.background.header.chosenText,
    },
    ".navLink": {
        padding: theme.theme.spacing(1, 0),
        color: alpha(theme.theme.palette.background.header.chosenText, 0.65),
        textDecoration: "none", //remove underline
        fontSize: "large",
        cursor: "pointer",
        transition: "color 300ms linear",
        "&:hover": {
            color: theme.theme.palette.background.header.chosenText,
        },
    },
    ".activeLink": {
        color: theme.theme.palette.background.header.chosenText,
    },
    ".groupItemList": {
        backgroundColor: theme.theme.palette.background.paper,
        "& $navLink": {
            fontSize: "0.8rem",
            lineHeight: 0,
            display: "flex",
            alignItems: "center",
        },
    },
}));

const Sidebar = ({ navConfig }) => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [activeGroupItem, setActiveGroupItem] = useState(undefined);

    function toggleSidebar() {
        setOpenSidebar(!openSidebar);
    }

    function handleSidebarClose() {
        setOpenSidebar(false);
        setActiveGroupItem(undefined);
    }

    function toggleGroupItem(groupId) {
        if (activeGroupItem === groupId) {
            setActiveGroupItem(undefined);
        } else {
            setActiveGroupItem(groupId);
        }
    }

    function renderNavItem(item) {
        const AnchorTag = item.externalLink ? Link : NavLink;
        return (
            <AnchorTag
                onClick={handleSidebarClose}
                className={({ isActive }) =>
                    isActive ? "navLink activeLink" : "navLink"
                }
                href={item.externalLink ? item.navLink : undefined}
                target={item.newTab ? "_blank" : undefined}
                to={item.externalLink ? undefined : item.navLink}
            >
                {item.title}
                {item.externalLink && (
                    <OpenInNewIcon
                        style={{ marginLeft: 4, fontSize: "inherit" }}
                    />
                )}
            </AnchorTag>
        );
    }

    return (
        <CustomStyle>
            <IconButton onClick={toggleSidebar} className={"menuIconBtn"}>
                <MenuIcon fontSize="medium" />
            </IconButton>
            <Drawer
                anchor="right"
                open={openSidebar}
                onClose={handleSidebarClose}
            >
                {/* Must pass again CustomStyle for component suddenly appear */}
                <CustomStyle>
                    <List className={"sidebarList"}>
                        <ListItem onClick={handleSidebarClose}>
                            <Link component={RouterLink} to="/">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{
                                        height: "100px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                {/* Tinkerbell Garden */}
                            </Link>
                        </ListItem>
                        <Divider style={{ marginBottom: "16px" }} />
                        {[...navConfig, ...rightNavConfig].map((item, _) => {
                            return item.children ? (
                                <Fragment key={item.id}>
                                    <ListItem
                                        onClick={() => toggleGroupItem(item.id)}
                                        className={clsx("selectListItem")}
                                    >
                                        <Box display="flex" alignItem="center">
                                            {item.title}{" "}
                                            {item.id === activeGroupItem ? (
                                                <ExpandLessIcon fontSize="small" />
                                            ) : (
                                                <ExpandMoreIcon fontSize="small" />
                                            )}
                                        </Box>
                                    </ListItem>
                                    <Box px={2}>
                                        <Collapse
                                            in={item.id === activeGroupItem}
                                        >
                                            <List
                                                className={clsx(
                                                    "groupItemList"
                                                )}
                                            >
                                                {item.children.map((cItem) => (
                                                    <ListItem
                                                        key={cItem.id}
                                                        button
                                                        className={"listItem"}
                                                    >
                                                        {renderNavItem(cItem)}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </Box>
                                </Fragment>
                            ) : (
                                <ListItem key={item.id} className={"listItem"}>
                                    {renderNavItem(item)}
                                </ListItem>
                            );
                        })}
                    </List>
                    <Box py={2}></Box>
                </CustomStyle>
            </Drawer>
        </CustomStyle>
    );
};

export default Sidebar;
