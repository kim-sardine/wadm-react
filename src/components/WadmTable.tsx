import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Candidate {
    name: string;
    values: Array<number>;
}
interface Category {
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

export function createCategory(
    name: string,
    index: number,
    weight: number,
): Category {
    return { name, index, weight };
}

const defaultScore = 5;

let candidates: Candidate[]  = [];

let categories: Category[]  = [];

function descendingComparator(a: Category, b: Category, orderBy: number) {
    if (orderBy === -1) {
        if (b.name < a.name) {
            return -1;
        }
        if (b.name > a.name) {
            return 1;
        }
        return 0;
    }
    if (candidates[orderBy].values[a.index] < candidates[orderBy].values[b.index]) {
        return -1;
    }
    if (candidates[orderBy].values[b.index] < candidates[orderBy].values[a.index]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
    order: Order,
    orderBy: number,
): (a: Category, b: Category) => number {
    return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: Category[], comparator: (a: Category, b: Category) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [Category, number]);
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
    onRequestSort: (event: React.MouseEvent<unknown>, property: number) => void;
    order: Order;
    orderBy: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: number) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    key={-1}
                    align="center"
                    padding="default"
                    sortDirection={orderBy === -1 ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === -1}
                        direction={orderBy === -1 ? order : 'asc'}
                        onClick={createSortHandler(-1)}
                    >
                        {orderBy === -1 ? (
                            <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
                {candidates.map((candidate, index) => (
                    <TableCell
                        className={classes.tableCell}
                        key={index}
                        align="center"
                        padding="default"
                        sortDirection={orderBy === index ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === index}
                            direction={orderBy === index ? order : 'asc'}
                            onClick={createSortHandler(index)}
                            // TODO: LightGrey when inactive
                        >
                            {candidate.name} {/* TODO: In Same Line */}
                        </TableSortLabel>
                        <div className="Wow">
                            Wow
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
  );
}

// TODO: Highlight Color
const MyTotalRow = () => {
    return (
        <TableRow hover key="total">
            <TableCell align="center">
                Total
            </TableCell>
            {candidates.map((candidate, index) => (
                <TableCell key={"total" + index} align="center">{candidate.values.reduce((a, b) => a + b, 0)}</TableCell>
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
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            // minWidth: 750,
        },
        tableCell: {
            minWidth: 50,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

interface WadmTableProps {
    inputCandidates: Candidate[],
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>,
    inputCategories: Category[],
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
}

export default function WadmTable(props: WadmTableProps) {

    const { inputCandidates, setCandidates, inputCategories, setCategories } = props;

    candidates = inputCandidates;
    categories = inputCategories;

    const classes = useStyles();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<number>(-1);
    const [open, setOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [dialogType, setDialogType] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [userInput, setUserInput] = useState({
        name: '',
        weight: 0,
    });

    const handleClose = () => {
        setUserInput({
            name: '',
            weight: 0,
        });
        setOpen(false);
    };

    const openAddCategoryDialog = () => {
        setDialogAction("ADD")
        setDialogType("CATEGORY")
        setDialogTitle("Add New Category")
        setOpen(true);
    }
    
    const openAddCandidateDialog = () => {
        setDialogAction("ADD")
        setDialogType("CANDIDAITE")
        setDialogTitle("Add New Candidate")
        setOpen(true);
    }

    const handleUserInputChange = (e: any) => {
        let value = e.target.value;
        if (e.target.name === 'weight') {
            value = parseScore(e.target.value);
        }
        setUserInput({...userInput, [e.target.name]: value});
    }
  
    const handleRequestSort = (e: React.MouseEvent<unknown>, property: number) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const parseScore = (value: string) => {
        let newValue = parseInt(value);
        if (isNaN(newValue)) {
            newValue = 0;
        }
        else if (newValue > 9) {
            newValue = 9;
        }
        else if (newValue < 0) {
            newValue = 0;
        }
        return newValue
    }

    const handleCellValueChange = (value: string, catIdx: number, canIdx: number) => {
        let newValue = parseScore(value);

        const targetCandidate = inputCandidates[canIdx];
        const targetValues = [...targetCandidate.values];
        targetValues[catIdx] = newValue;

        const udpatedCandidate = createCandidate(targetCandidate.name, targetValues)
        setCandidates(
            [...inputCandidates.slice(0, canIdx), udpatedCandidate, ...inputCandidates.slice(canIdx+1)]
        )
    };
    
    const addCategory = (name: string, weight: number) => {
        const newCategory = createCategory(name, inputCategories.length, weight);
        setCategories(
            [...inputCategories, newCategory]
        );
        for (const candidate of inputCandidates) {
            candidate.values.push(defaultScore);
        }
        setCandidates(inputCandidates);
    }
    
    const addCandidate = (name: string) => {
        const values = Array(inputCategories.length);
        values.fill(defaultScore);
        const newCandidate = createCandidate(name, values);

        setCandidates(
            [...inputCandidates, newCandidate]
        );
    }
    
    const clear = () => {
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
    

    const handleDialogSubmit = () => {
        if (dialogAction === 'ADD') {
            if (dialogType === 'CATEGORY') { // Add new category
                addCategory(userInput['name'], userInput['weight']);
            } else {
                addCandidate(userInput['name']);
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
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                stableSort(categories, getComparator(order, orderBy))
                                    .map((category) => {
                                        return (
                                            <TableRow hover key={category.name}>
                                                <TableCell align="center">
                                                    <div>
                                                        <div>{category.name}</div>
                                                        <div>{category.weight}</div>
                                                    </div>
                                                </TableCell>
                                                {candidates.map((candidate, index) => (
                                                    <TableCell key={category.name + candidate.name + index} align="right">
                                                        <TextField
                                                            type="text"
                                                            size="small"
                                                            margin="none"
                                                            value={candidate.values[category.index]}
                                                            onChange={(e) => handleCellValueChange(e.target.value, category.index, index)}
                                                            InputProps={
                                                                { inputProps: { min: "0", max: "9", step: "1" } }
                                                            }
                                                        />
                                                    </TableCell> // TODO: Need Input
                                                ))}
                                            </TableRow>
                                        );
                                    })
                            }
                            <MyTotalRow />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box textAlign='center' m={4}>
                <ButtonGroup size="large" color="primary" aria-label="large outlined button group">
                    <Button onClick={openAddCategoryDialog}>Add Category (FIXME)</Button>
                    <Button onClick={openAddCandidateDialog}>Add Candidate (FIXME)</Button>
                </ButtonGroup>
            </Box>
            <Box textAlign='center'>
                <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained large button group">
                    <Button onClick={(e) => clear()}>Clear</Button>
                </ButtonGroup>
            </Box>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                {dialogType === "CATEGORY" ? 
                    <>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            type="text"
                            value={userInput['name']}
                            label="Category Name"
                            onChange={handleUserInputChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            name="weight"
                            type="text"
                            value={userInput['weight']}
                            label="Category Weight"
                            onChange={handleUserInputChange}
                            fullWidth
                            InputProps={
                                { inputProps: { min: "0", max: "9", step: "1" } }
                            }
                        />
                    </>
                        : 
                    <>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            type="text"
                            value={userInput['name']}
                            label="Candidate Name"
                            onChange={handleUserInputChange}
                            fullWidth
                        />
                    </>
                }
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDialogSubmit} color="primary">
                    {dialogAction === "ADD" ? "Add": "Update"}
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
