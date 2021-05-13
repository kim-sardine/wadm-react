import React, { useState } from 'react';
import ReactGA from 'react-ga';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';

import Header from './components/Header';
import Footer from './components/Footer';
import Title from './components/Title';
import Memo from './components/Memo';
import WadmTable from './components/WadmTable'
import './App.css';

ReactGA.initialize('###');
ReactGA.pageview('/');

const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    }
}));

const sampleInputMemo = `Some Important memo here`;

const sampleWadmColumns = [
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    { title: 'Birth Year 1', field: 'birthYear1', type: 'numeric' },
    { title: 'Birth Year 2', field: 'birthYear2', type: 'numeric' },
    {
        title: 'Birth Place',
        field: 'birthCity',
        width: 150
    },
]
const sampleWadmData = [
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthYear1: 1987, birthYear2: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthYear1: 2017, birthYear2: 2017, birthCity: 34 },
]


function App() {
    const [inputMemo, setInputMemo] = useState(sampleInputMemo);
    const [wadmColumns, setWadmColumns] = useState(sampleWadmColumns);
    const [wadmData, setWadmData] = useState(sampleWadmData);
    
    const onChangeInputMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMemo(e.target.value);
    };
    
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <Header />
            <Title />
            <Box m={2}>
                <Grid container spacing={3} direction="row" justify="center">
                    <Box clone order={{ xs: 2, sm: 1 }}>
                        <Grid item xs={12} sm>
                            <Memo
                                inputMemo={inputMemo}
                                onChangeInputMemo={onChangeInputMemo}
                            />
                        </Grid>
                    </Box>
                    <Box clone order={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <WadmTable />
                        </Grid>
                    </Box>
                    <Box clone order={3}>
                        <Grid item xs={12} sm>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
            <Footer />
        </div>
    );
}
    
export default App;
                    