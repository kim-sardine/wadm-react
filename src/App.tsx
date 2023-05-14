import React, { useState, useRef } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import { lightBlue, cyan, teal } from '@material-ui/core/colors';

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
import domtoimage from 'dom-to-image';

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

const defaultInputMemo = 'memo here';
const defaultTitle = '';
const defaultTemplate = 'Default';
const defaultScore = 0;

let templates: {[name: string] : Wadm; } = {};

templates[defaultTemplate] = {
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

templates["Career"] = {
    candidates: [
        createCandidate('A', [0, 0, 0, 0]),
        createCandidate('B', [0, 0, 0, 0]),
        createCandidate('C', [0, 0, 0, 0]),
        createCandidate('D', [0, 0, 0, 0]),
    ],
    criteria: [
        createCriterion('Compensation', 0, 5),
        createCriterion('Work-life balance', 1, 5),
        createCriterion('Culture & Values', 2, 5),
        createCriterion('Career Opportunities', 3, 5),
    ]
}

templates["SW Career"] = {
    candidates: [
        createCandidate('A', [0, 0, 0, 0]),
        createCandidate('B', [0, 0, 0, 0]),
        createCandidate('C', [0, 0, 0, 0]),
        createCandidate('D', [0, 0, 0, 0]),
    ],
    criteria: [
        createCriterion('Compensation', 0, 5),
        createCriterion('Work-life balance', 1, 5),
        createCriterion('Culture & Values', 2, 5),
        createCriterion('Career Opportunities', 3, 5),
    ]
}

templates["Moving House"] = {
    candidates: [
        createCandidate('A', [0, 0, 0, 0, 0, 0]),
        createCandidate('B', [0, 0, 0, 0, 0, 0]),
        createCandidate('C', [0, 0, 0, 0, 0, 0]),
    ],
    criteria: [
        createCriterion('Price', 0, 5),
        createCriterion('Near Work', 1, 5),
        createCriterion('Near Schools', 2, 5),
        createCriterion('Near Nature', 3, 5),
        createCriterion('Potential', 4, 5),
        createCriterion('Parking', 5, 5),
    ]
}

const commonStyles = {
    fontSize: '12px'
}

const TealButton = withStyles((theme) => ({
    root: {
        ...commonStyles,
      color: theme.palette.getContrastText(teal[700]),
      backgroundColor: teal[700],
      '&:hover': {
        backgroundColor: teal[900],
      },
    },
  }))(Button);

const LightBlueButton = withStyles((theme) => ({
    root: {
        ...commonStyles,
      color: theme.palette.getContrastText(lightBlue[700]),
      backgroundColor: lightBlue[700],
      '&:hover': {
        backgroundColor: lightBlue[900],
      },
    },
  }))(Button);

const CyanButton = withStyles((theme) => ({
    root: {
        ...commonStyles,
      color: theme.palette.getContrastText(cyan[700]),
      backgroundColor: cyan[700],
      '&:hover': {
        backgroundColor: cyan[900],
      },
    },
  }))(Button);

function App() {
    const [inputMemo, setInputMemo] = useState(defaultInputMemo);
    const [template, setTemplate] = useState(defaultTemplate);
    const [wadm, setWadm] = useState(cloneDeep(templates[template]));
    const [title, setTitle] = useState(defaultTitle);
    const fileRef = useRef<HTMLInputElement>(null);

    
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

        setTitle(defaultTitle);
        setInputMemo(defaultInputMemo);
        setWadm({
            criteria: [newCriteria],
            candidates: [newCandidate]
        });

    }

    function createFilename(): string {
        let filename = title;
        if (filename !== '') {
            filename += '_';
        }

        let today = new Date();
        let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        let time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
        filename += date + '__' + time;
        filename = 'wadm_' + filename;

        return filename;
    }

    const exportWadmAsImage = (e: any) => {
        
        var node = document.getElementById('wadm-table');
        if (!node) return;

        let filename = createFilename();

        domtoimage.toJpeg(node).then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = `${filename}.jpeg`;
            link.href = dataUrl;
            link.click();
        });
    }

    const exportWadmAsJson = (e: any) => {
        let output = JSON.stringify({wadm: wadm, inputMemo: inputMemo, title: title}, null, 4);
        
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = fileDownloadUrl;

        let filename = createFilename();

        element.download = filename + '.json'
        document.body.appendChild(element);
        element.click(); 
        URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
    }

    const importJson = (e: any) => {
        fileRef?.current?.click();
    }

    let fileReader = new FileReader();
  
    const handleFileRead = (e: any) => {
        const content = fileReader.result;
        const loadedWadm = JSON.parse(String(content));
        setTitle(loadedWadm['title']);
        setInputMemo(loadedWadm['inputMemo']);
        setWadm(cloneDeep(loadedWadm['wadm']));
    };

    const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        if (file !== undefined) {
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            fileReader.readAsText(file);
        }
    };

    return (
        <div className={classes.content}>
            <Header />
            <Title
                title={title}
                setTitle={setTitle}
            />
            <Box m={2}>
                <Grid container spacing={3} direction="row">
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
                <Grid container direction="column" style={{textAlign: "center"}}>
                    <Box m={1}>
                        <FormControl variant="outlined" className={classes.selectTemplate}>
                            <InputLabel id="select-template-label">Template</InputLabel>
                            <Select
                                labelId="select-template-label"
                                id="select-template"
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
                    <Box m={1}  style={{marginTop: "16px", marginBottom: "16px"}}>
                        <ButtonGroup variant="contained" aria-label="contained button group">
                            <TealButton onClick={exportWadmAsImage}>Export as image</TealButton>
                            <CyanButton onClick={exportWadmAsJson}>Export as json</CyanButton>
                            <LightBlueButton onClick={importJson}>Import json</LightBlueButton>
                        </ButtonGroup>
                    </Box>
                    <Box m={3}>
                        <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained large button group">
                            <Button onClick={(e) => clear()}>Clear</Button>
                        </ButtonGroup>
                    </Box>
                </Grid>
            </Box>
            <Footer />
            <input type="file" style={{display: "none"}}
                multiple={false}
                accept="application/JSON"
                onChange={handleFileChosen}
                ref={fileRef}
            />
        </div>
    );
}
    
export default App;
                    