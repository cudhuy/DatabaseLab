import React from "react";
import { Box } from "@mui/material";
import WrapperStaff from "src/pages/staff/WrapperStaff";
import RegisterVIPMember from "./VIPHandler/RegisterVIPMember";
import UpdateVIP from "./VIPHandler/UpdateVIP";

const VIPManagement = () => {
    return (
        <WrapperStaff>
            <RegisterVIPMember />
            <Box py={3}></Box>
            <UpdateVIP />
        </WrapperStaff>
    );
};

export default VIPManagement;
