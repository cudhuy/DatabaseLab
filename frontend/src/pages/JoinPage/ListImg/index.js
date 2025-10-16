import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ItemImg from "src/pages/JoinPage/ItemImg";
import Empty from "src/components/Empty";
import { useTheme } from "@mui/system";

const ListImg = ({ data }) => {
    const theme = useTheme();
    return (
        <Box>
            <Grid container spacing={7} style={{ justifyContent: "center" }}>
                {data ? (
                    data.map((ele, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <ItemImg data={ele} />
                        </Grid>
                    ))
                ) : (
                    <Empty color={theme.palette.commonText.black} />
                )}
            </Grid>
        </Box>
    );
};

export default ListImg;
