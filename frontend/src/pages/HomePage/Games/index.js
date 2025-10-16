import React, { useEffect } from "react";
import { styled } from "@mui/system";
import { Box, Paper, Grid } from "@mui/material";
import Park1 from "../assets/Park1.png";
import Park2 from "../assets/Park2.png";
import Park3 from "../assets/Park3.png";
import Park4 from "../assets/Park4.png";
import Park5 from "../assets/Park5.png";
import Park6 from "../assets/Park6.png";
import Park7 from "../assets/Park7.png";
import Park8 from "../assets/Park8.png";
import GamesTitle from "./GamesTitle";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Boop from "src/components/animations/Boop";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { fetchAllGames } from "src/redux/slices/gameslice";
import { useSelector } from "react-redux";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: alpha(theme.theme.palette.light.main, 0.9),
        borderRadius: "20px",
        padding: "20px",
    },
    ".imgCustom": {
        cursor: "pointer",
        "&:before": {
            content: "'GO TO GAME LIST'",
            width: 0,
            height: 0,
            color: theme.theme.palette.commonText.white,
            display: "inline-block",
            whiteSpace: "nowrap",
            position: "relative",
            top: -143,
            left: "23%",
            fontWeight: "bold",
            fontSize: "larger",
            cursor: "pointer",
            opacity: 0,
            transition: "1s",
            zIndex: 2,
        },
        "&:hover": {
            "&:before": {
                opacity: 1,
            },
        },
        "&:hover img": {
            filter: "brightness(50%)",
        },
    },
}));

const listImg = [Park1, Park2, Park3, Park4, Park5, Park6, Park7, Park8];
const Games = () => {
    // const imgGameData = useSelector(state => state.gameSlice.data);
    // var listImg = imgGameData.slice(0, 5);
    // listImg = listImg.map(ele => ele.image.url);

    const navigate = useNavigate();
    const goToJoin = () => {
        navigate("/join");
    };
    const style = {
        transform: "rotate(0deg)",
        transition: "transform 150ms",
    };

    return (
        <CustomClass>
            <Paper className="paper">
                <GamesTitle />
                <Grid container spacing={2} justifyContent="center">
                    {listImg.map((item, index) => (
                        <Grid item onClick={goToJoin} style={style} key={index}>
                            <AnimationOnScroll
                                animateOnce={true}
                                initiallyVisible={false}
                                duration={1}
                                animateIn="animate__swing"
                            >
                                <Box className={"imgCustom"}>
                                    <Boop rotation={5} timing={50}>
                                        <Box maxWidth="500px">
                                            <img maxwidth="100%" src={item} />
                                        </Box>
                                    </Boop>
                                </Box>
                            </AnimationOnScroll>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default Games;
