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
import EditIcon from '@material-ui/icons/Edit';

interface Candidate {
    name: string;
    values: Array<number>;
}
interface Category {
    name: string;
    index: number;
    weight: number;
}

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
                        key={index}
                        align="right"
                        padding="default"
                        sortDirection={orderBy === index ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === index}
                            direction={orderBy === index ? order : 'asc'}
                            onClick={createSortHandler(index)}
                            // TODO: LightGrey when inactive
                        >
                            &nbsp;
                            {orderBy === index ? (
                                // FIXME: Do we need this?
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                        {candidate.name} {/* TODO: In Same Line */}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
  );
}

interface MyTableRowProps {
    category: Category,
}

const MyTableRow = (props: MyTableRowProps) => {
    const { category } = props;

    return (
        <TableRow hover key={category.name}>
            <TableCell align="center">
                <div>
                    <div>{category.name}</div>
                    <div>{category.weight}</div>
                </div>
            </TableCell>
            {candidates.map((candidate) => (
                <TableCell align="right">{candidate.values[category.index]}</TableCell> // TODO: Need Input
            ))}
        </TableRow>
    );
};

// TODO: Highlight Color
const MyTotalRow = () => {
    return (
        <TableRow hover key="total">
            <TableCell align="center">
                Total
            </TableCell>
            {candidates.map((candidate) => (
                <TableCell align="right">{candidate.values.reduce((a, b) => a + b, 0)}</TableCell>
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
                        zIndex: 9999
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

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: number) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="Wadm Table"
                        size="medium"
                        aria-label="wadm table"
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
                                            <MyTableRow category={category} />
                                        );
                                    })
                            }
                            <MyTotalRow />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box textAlign='center'>
                <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                    <Button>Add Candidate (FIXME)</Button>
                    <Button>Add Category (FIXME)</Button>
                </ButtonGroup>
            </Box>
        </div>
    );
}
