import React from 'react';
import { Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
}))


type MemoProps = {
    inputMemo: string;
    onChangeInputMemo: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function Memo(props: MemoProps) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper} >
            <TextField
                label="Memo"
                value={props.inputMemo} 
                onChange={props.onChangeInputMemo}
                fullWidth
                multiline
                rows={20}
                variant="outlined"
            />
        </Paper>
    );
}

export default Memo;
                