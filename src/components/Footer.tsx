import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Container,
    Toolbar,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    footer: {
        marginTop: 'auto'
    },
  }));


function Footer() {
    const classes = useStyles();

    return (
        <AppBar position="static" color="primary" className={classes.footer}>
            <Container maxWidth="md">
                <Toolbar>
                    <Typography variant="body1" color="inherit">
                        © 2021 Sidepun.ch
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
    
export default Footer;
