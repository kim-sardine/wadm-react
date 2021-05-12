import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles';

// TODO: Re-create
// https://material-ui.com/components/tables/#sorting-amp-selecting

const useStyles = makeStyles({
    stickyActionsColumn: {
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
    }
})

interface WadmTableProps {
    wadmColumns: any,
    wadmData: any,
    setWadmColumns: any,
    setWadmData: any,
}

function WadmTable({wadmColumns, wadmData}: WadmTableProps) {

    const classes = useStyles();
    const height = useWindowHeight();


    return (
        <div className={classes.stickyActionsColumn}>
            <MaterialTable
                title="Wadm"
                columns={wadmColumns}
                data={wadmData} 
                options={{
                    maxBodyHeight: height * 0.5,
                    paging: false,
                    search: false,
                }}
                cellEditable={{
                    onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                        return new Promise((resolve, reject) => {
                            console.log('newValue: ' + newValue);
                            console.log('oldValue: ' + oldValue);
                            console.log(rowData);
                            console.log(columnDef);
                            setTimeout(resolve, 1000);
                        });
                    }
                }}
            
            />
        </div>
    );
}

function getWindowHeight() {
    const { innerHeight: height } = window;
    return height;
  }

function useWindowHeight() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowHeight());

    useEffect(() => {
        function handleResize() {
        setWindowDimensions(getWindowHeight());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export default WadmTable;
                