import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';

import Header from './components/Header';
import Footer from './components/Footer';
import Title from './components/Title';
import Memo from './components/Memo';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import WadmTable, {createCandidate, createCategory, Wadm} from './components/WadmTable'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import './App.css';

const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    selectTemplate: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const sampleInputMemo = `Some Important memo here`;
const sampleTitle = ``;
const defaultScore = 5;

let templates: {[name: string] : Wadm; } = {};

templates["default"] = {
    candidates: [
        createCandidate('Company A', [6,5,2,7]),
        createCandidate('Company B', [9,9,5,4]),
        createCandidate('Company C', [6,5,6,3]),
        createCandidate('Company D', [3,5,8,4]),
        createCandidate('Company E', [4,6,3,7]),
    ],
    categories: [
        createCategory('Compensation', 0, 8),
        createCategory('Career', 1, 8),
        createCategory('Dev Culture', 2, 5),
        createCategory('Location', 3, 3),
    ]
}

function App() {
    const [inputMemo, setInputMemo] = useState(sampleInputMemo);
    const [wadm, setWadm] = useState(templates["default"]);
    const [title, setTitle] = useState(sampleTitle);
    const [template, setTemplate] = useState('');
    
    const onChangeInputMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMemo(e.target.value);
    };
    
    const handleChangeTemplate = (e: any) => {
        if (e.target.value) {
            if (window.confirm(`Really wanna use template : '${e.target.value}' ?`) === false) {
                return
            }
            setTemplate(e.target.value);
        }
    };

    const classes = useStyles();

    const clear = () => {
        if (window.confirm('Really wanna clear all?') === false) {
            return
        }

        const newCategory = createCategory('New', 0, defaultScore);

        const values = Array(1);
        values.fill(defaultScore);
        const newCandidate = createCandidate('New', values);

        setWadm({
            categories: [newCategory],
            candidates: [newCandidate]
        });
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
                                wadm={wadm}
                                setWadm={setWadm}
                                defaultScore={defaultScore}
                            />
                        </Grid>
                    </Box>
                    <Box clone order={3}>
                        <Grid item xs={12} sm>
                        </Grid>
                    </Box>
                </Grid>
                <Grid container direction="column" justify="center">
                    <Box textAlign='center' m={2}>
                        <FormControl variant="outlined" className={classes.selectTemplate}>
                            <InputLabel id="selete-template-label">Template</InputLabel>
                            <Select
                                labelId="selete-template-label"
                                id="selete-template"
                                value={template}
                                onChange={handleChangeTemplate}
                                label="Template"
                                autoWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box textAlign='center' m={2}>
                        <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained large button group">
                            <Button onClick={(e) => clear()}>Clear</Button>
                        </ButtonGroup>
                    </Box>
                    <Box textAlign='center' m={2}>
                        <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained large button group">
                            <Button onClick={(e) => clear()}>Clear</Button>
                        </ButtonGroup>
                    </Box>
                </Grid>
            </Box>
            <Footer />
        </div>
    );
}
    
export default App;
                    