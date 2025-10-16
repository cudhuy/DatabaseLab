import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectRole } from "src/redux/slices/auth-slice";

const WrapperAdmin = ({ children }) => {
    const role = useSelector((state) => selectRole(state));

    if (role != "staff") {
        if (role == "admin") {
            return <Navigate to={"/admin/accountmanagement"} replace />;
        } else {
            return <Navigate to={"/"} replace />;
        }
    }

    return <Fragment>{children}</Fragment>;
};

export default WrapperAdmin;
