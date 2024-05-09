import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, Typography, Container, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "drawerState",
})<{
    drawerState?: boolean;
    drawerwidth: number;
}>(({ theme, drawerState, drawerwidth }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerwidth,
    ...(drawerState && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    }),
    position: "relative",
    backgroundColor: "#f7f7f7",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Montserrat', sans-serif", // Use Montserrat font
}));

const FancyButton = styled(Button)({
    background: "#2196f3",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    "&:hover": {
        background: "#1976d2",
    },
});

const ButtonContainer = styled("div")({
    display: "flex",
    gap: "100px", // Adjust the gap between buttons
    position: "absolute",
    bottom: 150, // Align buttons to the bottom
    right: 900, // Align buttons to the right
});

export default function LandingPage() {
    const [drawerState, setDrawerState] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    return (
        <>
            <Main drawerState={drawerState} drawerwidth={0}>
                <Container>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" gutterBottom>
                                Time Table Generator
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Effortlessly create tailor-made timetables for your university with
                                just one click, enhancing organization and efficiency instantly.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3}>
                                <img
                                    src="src/icons/3895889.jpg"
                                    alt="placeholder"
                                    style={{ width: "100%" }}
                                />
                                <ButtonContainer>
                                    <Link to="/upload">
                                        {" "}
                                        {/* Link to Upload.tsx */}
                                        <FancyButton variant="contained">Upload CSV</FancyButton>
                                    </Link>
                                    <Link to="/combined">
                                        {" "}
                                        {/* Link to TimetableCombined.tsx */}
                                        <FancyButton variant="contained">
                                            Generate or Edit
                                        </FancyButton>
                                    </Link>
                                </ButtonContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Main>
        </>
    );
}
