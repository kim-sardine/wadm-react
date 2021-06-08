import React, { useState } from 'react';
import ReactGA from 'react-ga';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';

import Header from './components/Header';
import Footer from './components/Footer';
import Title from './components/Title';
import Memo from './components/Memo';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import WadmTable, {createCandidate, createCategory} from './components/WadmTable'
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
const sampleTitle = `Title of the wadm table`;
const defaultScore = 5;

const sampleCandidates = [
    createCandidate('ab', [6,5,2,7]),
    createCandidate('cd', [1,5,2,7]),
    createCandidate('ef', [6,5,2,7]),
    createCandidate('gh', [3,5,2,7]),
    createCandidate('12', [6,6,6,7]),
]

const sampleCategories = [
    createCategory('Cupcake', 0, 5),
    createCategory('Donut', 1, 4),
    createCategory('Eclair', 2, 2),
    createCategory('Frozen yoghurt', 3, 9),
]


function App() {
    const [inputMemo, setInputMemo] = useState(sampleInputMemo);
    const [candidates, setCandidates] = useState(sampleCandidates);
    const [categories, setCategories] = useState(sampleCategories);
    const [title, setTitle] = useState(sampleTitle);

    const onChangeInputMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMemo(e.target.value);
    };
    
    const classes = useStyles();

    const clear = () => {
        if (window.confirm('Really wanna clear all?') === false) {
            return
        }

        const newCategory = createCategory('New', 0, defaultScore);
        setCategories(
            [newCategory]
        );

        const values = Array(1);
        values.fill(defaultScore);
        const newCandidate = createCandidate('New', values);
        setCandidates(
            [newCandidate]
        );
    }

    return (
        <div className={classes.content}>
            <Header />
            <Title
                title={title}
                setTitle={setTitle}
            />
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
                            <WadmTable
                                inputCandidates={candidates}
                                setCandidates={setCandidates}
                                inputCategories={categories}
                                setCategories={setCategories}
                                defaultScore={defaultScore}
                            />
                            <Box textAlign='center'>
                                <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained large button group">
                                    <Button onClick={(e) => clear()}>Clear</Button>
                                </ButtonGroup>
                            </Box>
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
                    