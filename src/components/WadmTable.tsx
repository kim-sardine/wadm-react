import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export interface Wadm {
    candidates: Candidate[];
    criteria: Criterion[];
}


interface Candidate {
    name: string;
    values: Array<number>;
}

interface Criterion {
    name: string;
    index: number;
    weight: number;
}

export function createCandidate(
    name: string,
    values: Array<number>,
): Candidate {
    return { name, values };
}

export function createCriterion(
    name: string,
    index: number,
    weight: number,
): Criterion {
    return { name, index, weight };
}


function descendingComparator(candidates: Candidate[], a: Criterion, b: Criterion, orderBy: number) {
    if (orderBy === -1) {
        if (b.weight < a.weight) {
            return -1;
        }
        if (b.weight > a.weight) {
            return 1;
        }
        return 0;
    }
    if (candidates[orderBy].values[b.index] < candidates[orderBy].values[a.index]) {
        return -1;
    }
    if (candidates[orderBy].values[a.index] < candidates[orderBy].values[b.index]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
    candidates: Candidate[],
    order: Order,
    orderBy: number,
): (a: Criterion, b: Criterion) => number {
    return order === 'desc'
            ? (a, b) => descendingComparator(candidates, a, b, orderBy)
            : (a, b) => -descendingComparator(candidates, a, b, orderBy);
}

function stableSort(array: Criterion[], comparator: (a: Criterion, b: Criterion) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [Criterion, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        };
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    candidates: Candidate[];
    onRequestSort: (property: number) => void;
    order: Order;
    orderBy: number;
    openUpdateCandidateDialog: (index: number) => void
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, candidates, order, orderBy, onRequestSort, openUpdateCandidateDialog} = props;
    const createSortHandler = (property: number) => () => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    className={classes.tableCell}
                    key={-1}
                    align="center"
                    padding="default"
                    sortDirection={orderBy === -1 ? order : false}
                >
                    <SortIcon 
                        fontSize='small'
                        color={orderBy === -1 ? 'secondary' : 'primary'}
                        style={{cursor: "pointer"}}
                        onClick={createSortHandler(-1)} />
                </TableCell>
                {candidates.map((candidate, index) => (
                    <TableCell
                        className={classes.tableCell}
                        key={index}
                        padding="default"
                        sortDirection={orderBy === index ? order : false}
                    >
                        <Box display="flex">
                            <Box flexGrow={1} onClick={() => openUpdateCandidateDialog(index)} style={{cursor: "pointer", textAlign: "center"}}>
                                <span className="Wow">
                                    {candidate.name}
                                </span>
                            </Box>
                            <Box>
                                <SortIcon 
                                    fontSize='small'
                                    className={classes.sortIcon}
                                    color={orderBy === index ? 'secondary' : 'primary'}
                                    onClick={createSortHandler(index)} />
                            </Box>

                        </Box>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
  );
}


interface MyTotalRowProps {
    candidates: Candidate[];
    criteria: Criterion[];
    classes: ReturnType<typeof useStyles>;
}

const MyTotalRow = (props: MyTotalRowProps) => {
    
    const {candidates, criteria} = props;

    let totals = [];
    for (const candidate of candidates) {
        let total = 0;
        for (let i in candidate.values) {
            total += candidate.values[i] * criteria[i].weight;
        }
        totals.push(total);
    }

    return (
        <TableRow hover key="total" style={{backgroundColor: '#f5f5f5'}}>
            <TableCell className={props.classes.tableCell} align="center">
                Total
            </TableCell>
            {totals.map((total, idx) => (
                <TableCell className={props.classes.tableCell} key={"total" + idx} align="center">{total}</TableCell>
            ))}
        </TableRow>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& table:first-child': {
                '& tr': {
                    '& td:first-child, th:first-child': {
                        backgroundColor: '#f5f5f5',
                        position: 'sticky',
                        left: 0,
                        zIndex: 999
                    },
                    '& th:first-child': {
                        zIndex: 1100
                    }
                }
            }
        },
        modalControl: {
            display: 'block'
        },
        modalAction: {
            padding: 24
        },
        cursor: {
            cursor: 'pointer'
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            wordWrap: 'break-word',
            // minWidth: 750,
        },
        tableFirstCell: {
            padding: '16px 12px',
            minWidth: 60,
            maxWidth: 100,
            cursor: 'pointer',
            border: '1px solid rgba(224, 224, 224, 1)',
            [theme.breakpoints.down('sm')]: {
                maxWidth: 50,
            }
        },
        tableCell: {
            padding: 12,
            minWidth: 50,
            cursor: 'pointer',
            border: '1px solid rgba(224, 224, 224, 1)'
        },
        sortIcon: {
            cursor: "pointer",
            marginLeft: 12,
            height: "100%"
        }
    }),
);

interface WadmTableProps {
    wadm: Wadm;
    setWadm: React.Dispatch<React.SetStateAction<Wadm>>;
    defaultScore: number;
}

export default function WadmTable(props: WadmTableProps) {

    const { wadm, setWadm, defaultScore } = props;

    const classes = useStyles();
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<number>(-1);
    const [open, setOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [dialogType, setDialogType] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogTitleLabel, setDialogTitleLabel] = useState('');
    const [dialogDeleteButtonVisibility, setDialogDeleteButtonVisibility] = useState('hidden');
    const [userInput, setUserInput] = useState({
        name: '',
        weight: 1,
    });
    const [targetIndex, setTargetIndex] = useState(0);

    const handleClose = () => {
        setUserInput({
            name: '',
            weight: 1,
        });
        setOpen(false);
    };

    const openAddCriterionDialog = () => {
        setDialogAction("ADD");
        setDialogType("CRITERION");
        setDialogTitle("Add New Criteria");
        setDialogTitleLabel("Criteria Name");
        setDialogDeleteButtonVisibility("hidden")
        setOpen(true);
    }
    
    const openAddCandidateDialog = () => {
        setDialogAction("ADD");
        setDialogType("CANDIDAITE");
        setDialogTitle("Add New Candidate");
        setDialogTitleLabel("Candidate Name");
        setDialogDeleteButtonVisibility("hidden")
        setOpen(true);
    }

    function openUpdateCriterionDialog(index: number) {
        setDialogAction("UPDATE");
        setDialogType("CRITERION");
        setDialogTitle("Update Criteria");
        setDialogTitleLabel("Criteria Name");
        setDialogDeleteButtonVisibility("visible")
        setTargetIndex(index)
        const targetCriterion = wadm.criteria.find((criterion) => criterion.index === index);
        setUserInput({
            name: targetCriterion? targetCriterion.name : '',
            weight: targetCriterion? targetCriterion.weight : 1
        })
        setOpen(true);
    }

    function openUpdateCandidateDialog(index: number) {
        setDialogAction("UPDATE");
        setDialogType("CANDIDATE");
        setDialogTitle("Update Candidate");
        setDialogTitleLabel("Candidate Name");
        setDialogDeleteButtonVisibility("visible")
        setTargetIndex(index)
        setUserInput({
            ...userInput,
            name: wadm.candidates[index].name
        })
        setOpen(true);
    }

    const handleUserInputChange = (e: any) => {
        let value = e.target.value;
        if (e.target.name === 'weight') {
            value = parseScore(e.target.value);
        }
        setUserInput({...userInput, [e.target.name]: value});
    }

    const handleKeyPress = (e: any) => {
        if(e.key === 'Enter'){
            handleDialogSubmit();
        }
    }
  
    const handleRequestSort = (property: number) => {
        const toAsc = orderBy === property && order === 'desc';
        setOrder(toAsc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const parseScore = (value: string) => {
        let newValue = parseInt(value);
        if (isNaN(newValue)) {
            newValue = 0;
        }
        else if (newValue > 10) {
            newValue = 10;
        }
        else if (newValue < 0) {
            newValue = 0;
        }
        return newValue
    }

    const handleCellValueChange = (value: string, valueIdx: number, canIdx: number) => {
        let newValue = parseScore(value);

        const targetCandidate = wadm.candidates[canIdx];
        const targetValues = [...targetCandidate.values];
        targetValues[valueIdx] = newValue;

        const udpatedCandidate = createCandidate(targetCandidate.name, targetValues)
        setWadm({
            ...wadm,
            candidates: [...wadm.candidates.slice(0, canIdx), udpatedCandidate, ...wadm.candidates.slice(canIdx+1)]
        });
    };
    
    const addCriterion = (name: string, weight: number) => {
        const newCriterion = createCriterion(name, Date.now(), weight);

        for (const candidate of wadm.candidates) {
            candidate.values.push(defaultScore);
        }
        setWadm({
            criteria: [...wadm.criteria, newCriterion],
            candidates: wadm.candidates
        });
    }
    
    const addCandidate = (name: string) => {
        const values = Array(wadm.criteria.length);
        values.fill(defaultScore);
        const newCandidate = createCandidate(name, values);

        setWadm({
            ...wadm,
            candidates: [...wadm.candidates, newCandidate]
        });
    }

    const handleDelete = () => {
        if (window.confirm(`Really wanna delete '${userInput['name']}' ?`) === true) {
            if (dialogType === 'CRITERION') {
                const targetCriterionIndex = wadm.criteria.findIndex((criterion) => criterion.index === targetIndex);
                for (const candidate of wadm.candidates) {
                    candidate.values = [...candidate.values.slice(0, targetCriterionIndex), ...candidate.values.slice(targetCriterionIndex+1)]
                }
                setWadm({
                    candidates: wadm.candidates,
                    criteria: [...wadm.criteria.slice(0, targetCriterionIndex), ...wadm.criteria.slice(targetCriterionIndex+1)]
                });
            } else {
                setWadm({
                    ...wadm,
                    candidates: [...wadm.candidates.slice(0, targetIndex), ...wadm.candidates.slice(targetIndex+1)]
                });
            }
        }
        handleClose();
    };

    const handleDialogSubmit = () => {
        if (userInput['name'] === '') {
            alert('Name is empty');
            return;
        }
        
        if (dialogType === 'CRITERION' && userInput['weight'] < 1) {
            alert('Weight must be between 1 and 10');
            return;
        }

        if (dialogAction === 'ADD') {
            if (dialogType === 'CRITERION') { // Add new criterion
                addCriterion(userInput['name'], userInput['weight']);
            } else { // Add new candidate
                addCandidate(userInput['name']);
            }
        } else {
            if (dialogType === 'CRITERION') {  // Update criterion
                const targetCriterionIndex = wadm.criteria.findIndex((criterion) => criterion.index === targetIndex);
                wadm.criteria[targetCriterionIndex].name = userInput['name'];
                wadm.criteria[targetCriterionIndex].weight = userInput['weight'];
                setWadm({
                    ...wadm,
                    criteria: wadm.criteria
                });
            } else {  // Update candidate
                wadm.candidates[targetIndex].name = userInput['name'];
                setWadm({
                    ...wadm,
                    candidates: wadm.candidates
                });
            }
        }

        handleClose();
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="Wadm Table"
                        size="medium"
                        aria-label="wadm table"
                        stickyHeader={true}
                    >
                        <EnhancedTableHead
                            classes={classes}
                            candidates={wadm.candidates}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            openUpdateCandidateDialog={openUpdateCandidateDialog}
                        />
                        <TableBody>
                            {
                                stableSort(wadm.criteria, getComparator(wadm.candidates, order, orderBy))
                                    .map((criterion, valueIdx) => {
                                        return (
                                            <TableRow hover key={criterion.name + criterion.index}>
                                                <TableCell className={classes.tableFirstCell} onClick={() => openUpdateCriterionDialog(criterion.index)} align="center">
                                                    <div>
                                                        <div>
                                                            <strong>{criterion.name}</strong>
                                                        </div>
                                                        <div>
                                                            <em>{criterion.weight}</em>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                {wadm.candidates.map((candidate, index) => (
                                                    <TableCell className={classes.tableCell} key={criterion.name + candidate.name + index} align="center">
                                                        <TextField
                                                            type="text"
                                                            size="small"
                                                            margin="none"
                                                            value={candidate.values[valueIdx]}
                                                            onChange={(e) => handleCellValueChange(e.target.value, valueIdx, index)}
                                                            inputProps={{ style: {textAlign: 'center'} }}
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })
                            }
                            <MyTotalRow classes={classes} criteria={wadm.criteria} candidates={wadm.candidates} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box textAlign='center' m={3}>
                <ButtonGroup color="primary" aria-label="outlined button group">
                    <Button onClick={openAddCriterionDialog}>Add New Criteria<ArrowDownwardIcon /></Button>
                    <Button onClick={openAddCandidateDialog}>Add New Candidate<ArrowForwardIcon /></Button>
                </ButtonGroup>
            </Box>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                <TextField
                    className={classes.modalControl}
                    autoFocus
                    margin="dense"
                    name="name"
                    type="text"
                    value={userInput['name']}
                    label={dialogTitleLabel}
                    onChange={handleUserInputChange}
                    onKeyPress={handleKeyPress}
                    fullWidth
                />
                {dialogType === "CRITERION" ?
                    <TextField
                        className={classes.modalControl}
                        margin="dense"
                        name="weight"
                        type="text"
                        value={userInput['weight']}
                        label="Criterion Weight (1 ~ 10)"
                        onChange={handleUserInputChange}
                        fullWidth
                    />
                        : 
                    <></>
                }
                </DialogContent>
                <DialogActions className={classes.modalAction}>
                    <Box flexGrow={1} component="div" visibility={dialogDeleteButtonVisibility}>
                        <Button onClick={handleDelete} variant="contained" color="secondary">
                            Delete
                        </Button>
                    </Box>
                    <Button onClick={handleClose} variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSubmit} variant="contained" color="primary">
                        {dialogAction === "ADD" ? "Add": "Update"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
