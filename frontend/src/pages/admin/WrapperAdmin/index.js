import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectRole } from "src/redux/slices/auth-slice";

const WrapperAdmin = ({ children }) => {
    const role = useSelector((state) => selectRole(state));

    //Cách 1 ok hơn vì dùng ít import các thứ
    if (role != "admin") {
        if (role == "staff") {
            return <Navigate to={"/staff/paymentmanagement"} replace />;
        } else {
            return <Navigate to={"/"} replace />;
        }
    }

    //Cách 2:
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if(role != "admin"){
    //         if(role == "staff"){
    //             navigate("/paymentmanagement");
    //         }else{
    //             console.log("realy");
    //             navigate("/");
    //         }
    //     }
    // });
    return <Fragment>{children}</Fragment>;
};

export default WrapperAdmin;
