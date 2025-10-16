import { Box, Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GoogleIcon from "@mui/icons-material/Google";
const ContactPage = () => {
    return (
        <Box paddingTop={10} paddingBottom={10}>
            <Helmet>
                <title>Tinkerbell Garden - Events</title>
            </Helmet>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Box marginBottom={2}>
                        {" "}
                        <Typography variant="h3">Get in touch</Typography>
                    </Box>
                    <Box width="75%">
                        <Box>
                            Let us know issues and comment and we can help and set up a time to chat with you and deal
                            with your problem.
                        </Box>
                        <Box marginTop={5}></Box>
                        <Box>
                            <Box>Email : tinkerbellgarden@gmail.com</Box>
                            <Box>Phone : (+84)38-277-6645</Box>
                        </Box>
                        <Box marginTop={5}></Box>
                        <Box>
                            <Box>Follow us</Box>
                            <Box height={"10px"}>{}</Box>
                            <Box style={{ display: "flex", justifyContent: "space-between" }} width="30%">
                                <FacebookIcon />
                                <TwitterIcon />
                                <YouTubeIcon />
                                <GoogleIcon />
                            </Box>
                        </Box>
                        <Box marginBottom={2}></Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box marginBottom={2}>
                        <Typography variant="h3">Let&apos;s Talk</Typography>
                    </Box>
                    <FormControl>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8}>
                                <TextField label="First Name" fullWidth={true} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Last Name" fullWidth={true} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Email" fullWidth={true} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Phone Number" fullWidth={true} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Message" multiline rows={4} fullWidth={true} />
                            </Grid>
                            <Grid item xs={12}>
                                <Box width="15%">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="medium"
                                        fullWidth
                                        sx={{ background: "#9ed670" }}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ContactPage;
