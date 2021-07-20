import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';

import Header from './components/Header';
import Footer from './components/Footer';
import Title from './components/Title';
import Memo from './components/Memo';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import WadmTable, {createCandidate, createCriterion, Wadm} from './components/WadmTable'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { cloneDeep } from 'lodash'

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
const defaultScore = 0;

let templates: {[name: string] : Wadm; } = {};

templates["default"] = {
    candidates: [
        createCandidate('Candidate 1', [0, 0, 0, 0]),
        createCandidate('Candidate 2', [0, 0, 0, 0]),
        createCandidate('Candidate 3', [0, 0, 0, 0]),
        createCandidate('Candidate 4', [0, 0, 0, 0]),
    ],
    criteria: [
        createCriterion('Criteria 1', 0, 5),
        createCriterion('Criteria 2', 1, 5),
        createCriterion('Criteria 3', 2, 5),
        createCriterion('Criteria 4', 3, 5),
    ]
}

templates["SW job"] = {
    candidates: [
        createCandidate('Microsoft', [0, 0, 0, 0]),
        createCandidate('Amazon', [0, 0, 0, 0]),
        createCandidate('Google', [0, 0, 0, 0]),
        createCandidate('Apple', [0, 0, 0, 0]),
    ],
    criteria: [
        createCriterion('Compensation', 0, 5),
        createCriterion('Work-life balance', 1, 5),
        createCriterion('Culture & Values', 2, 5),
        createCriterion('Career Opportunities', 3, 5),
    ]
}

function App() {
    const [inputMemo, setInputMemo] = useState(sampleInputMemo);
    const [template, setTemplate] = useState('default');
    const [wadm, setWadm] = useState(cloneDeep(templates[template]));
    const [title, setTitle] = useState(sampleTitle);
    
    const onChangeInputMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMemo(e.target.value);
    };
    
    const handleChangeTemplate = (e: any) => {
        if (e.target.value && Object.keys(templates).includes(e.target.value)) {
            const newTemplate = e.target.value;
            if (window.confirm(`Really wanna use template : '${newTemplate}'?\nAll data will be deleted`) === false) {
                return
            }
            setTemplate(newTemplate);
            setWadm(cloneDeep(templates[newTemplate]));
        }
        else {
            alert('Wrong Approach');
        }
    };

    const classes = useStyles();

    const clear = () => {
        if (window.confirm('Really wanna clear all?') === false) {
            return
        }

        const newCriteria = createCriterion('New', 0, defaultScore);

        const values = Array(1);
        values.fill(defaultScore);
        const newCandidate = createCandidate('New', values);

        setWadm({
            criteria: [newCriteria],
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
                    <Box textAlign='center' m={1}>
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
                                {
                                    Object.keys(templates).map((template) => {
                                        return (
                                            <MenuItem value={template}>{template}</MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box textAlign='center' m={1}>
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
                    