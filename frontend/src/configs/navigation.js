import React from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ToysIcon from "@mui/icons-material/Toys";
import EventIcon from "@mui/icons-material/Event";
import HouseIcon from "@mui/icons-material/House";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import ReportIcon from "@mui/icons-material/Report";
import PaymentIcon from "@mui/icons-material/Payment";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";

export default [
    {
        id: "home",
        title: "Home",
        icon: <HomeIcon />,
        navLink: "/home",
    },
    {
        id: "join",
        title: "Join",
        icon: <ToysIcon />,
        navLink: "/join",
    },
    {
        id: "events",
        title: "Events",
        icon: <EventNoteIcon />,
        navLink: "/events",
    },
    {
        id: "contact",
        title: "Contact",
        icon: <PhoneEnabledIcon />,
        navLink: "/contact",
    },
    {
        id: "vip",
        title: "VIP",
        icon: <FavoriteSharpIcon />,
        navLink: "/vip",
    },
];

export const adminNavConfig = [
    {
        id: "accountmanagement",
        icon: <AccountBoxIcon />,
        title: "Account",
        navLink: "/admin/accountmanagement",
    },
    {
        id: "gamesmanagement",
        icon: <ToysIcon />,
        title: "Games",
        navLink: "/admin/gamesmanagement",
    },
    {
        id: "eventsholding",
        icon: <EventIcon />,
        title: "Events",
        navLink: "/admin/eventsholding",
    },
    {
        id: "infrastructure",
        icon: <HouseIcon />,
        title: "Infrastructure",
        navLink: "/admin/infrastructure",
    },
    {
        id: "statistics",
        icon: <BarChartIcon />,
        title: "Statistics",
        navLink: "/admin/statistics",
    },
];

export const staffNavConfig = [
    {
        id: "paymentmanagement",
        title: "Payment Management",
        icon: <PaymentIcon />,
        navLink: "/staff/paymentmanagement",
    },
    {
        id: "reportinfrastructure",
        title: "Report Infrastructure",
        icon: <ReportIcon />,
        navLink: "/staff/reportinfrastructure",
    },
    {
        id: "vipmanagement",
        title: "VIP Management",
        icon: <CardMembershipIcon />,
        navLink: "/staff/vipmanagement",
    },
];

export const rightNavConfig = [
    // {
    //     id: "login",
    //     title: "Login",
    //     navLink: "./login",
    // },
];
