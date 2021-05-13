import React, { useState } from 'react';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FilterListIcon from '@material-ui/icons/FilterList';

interface Candidate {
    name: string;
    values: Array<number>;
}
interface Category {
    name: string;
    weight: number;
}


function createCandidate(
    name: string,
    values: Array<number>,
): Candidate {
    return { name, values };
}

function createCategory(
    name: string,
    weight: number,
): Category {
    return { name, weight };
}

const candidates = [
    createCandidate('ab', [6,5,2,7]),
    createCandidate('cd', [1,5,2,7]),
    createCandidate('ef', [6,5,2,7]),
    createCandidate('gh', [3,5,2,7]),
    createCandidate('12', [6,6,6,7]),
    createCandidate('34', [6,5,2,7]),
    createCandidate('56', [6,5,2,7]),
    createCandidate('78', [6,5,2,7]),
    createCandidate('99', [6,5,2,7]),
]

const categories = [
    createCategory('Cupcake', 305),
    createCategory('Donut', 452),
    createCategory('Eclair', 262),
    createCategory('Frozen yoghurt', 159),
]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
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
                    align={'left'}
                    padding={'default'}
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
                        align={'right'}
                        padding={'default'}
                        sortDirection={orderBy === index ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === index}
                            direction={orderBy === index ? order : 'asc'}
                            onClick={createSortHandler(index)}
                        >
                            {candidate.name}
                            {orderBy === index ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

interface EnhancedTableToolbarProps {
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();

    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Nutrition
            </Typography>
            <Tooltip title="Filter list">
                <IconButton aria-label="filter list">
                <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
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
            minWidth: 750,
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

export default function WadmTable() {
    const classes = useStyles();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<number>(1);
    const [dense, setDense] = useState(false);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: number) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    return (
        <div className={classes.root}>
        <Paper className={classes.paper}>
            <EnhancedTableToolbar />
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {categories.map((category, row) => { // TODO: Implement Sorting
                            return (
                                <TableRow hover tabIndex={-1} key={category.name}>
                                    <TableCell align="left">{category.name}</TableCell>
                                    {candidates.map((candidate) => (
                                        <TableCell align="right">{candidate.values[row]}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
        </div>
    );
}
