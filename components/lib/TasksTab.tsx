import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import { GridColDef, GridValueGetterParams, GridRowParams } from '@mui/x-data-grid';
import globalStyles from '~/styles/theme/brands/styles';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CustomFooter from '~/components/lib/CustomFooter';
import { Box, Grid, Paper, Typography } from '@mui/material';
import TaskEditForm from '~/container/task/edit';
import ListActionModal from '~/components/lib/ListActionModal';
import { useOperator } from '~/contexts/OperatorContext';
import Dialog from '~/components/lib/Feedback/Dialog';

interface TasksProps {
    data: any;
    reFetch: any;
}

const styles = {
    renderActionCell: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px',
        padding: '8px 0px',
    },
};

export default function TasksTab({ data, reFetch }: TasksProps) {

    const { agentData } = useOperator();
    const [showAll, setShowAll] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState('');


    const taskData = useMemo(() => {
        const filterActive = (data: any[]) => data?.filter((item: any) => item.active === true);
        const filterSelfTasks = (data: any[]) =>
            data?.filter((item: any) =>
                !showAll ? item.assigneeUser?._id.toString() === agentData?.userId : true,
            );
        return filterActive(filterSelfTasks(data));
    }, [data, showAll]);

    const renderActionCell = (data: any) => {
        return (
            <Box component={'div'} sx={styles.renderActionCell}>
                <ListActionModal
                    canActivate={false}
                    canEdit={data?.row?.status == 'Completed' ? false : true}
                    canDelete={false}
                    isActive={data.row.active}
                    id={data.row.id}
                    data={data.row}
                    reFetch={reFetch}
                    schema={'task'}
                    Editor={TaskEditForm}
                />
            </Box>
        );
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Task name',
            minWidth: 250,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row?.name}`,
        },
        {
            field: 'desc',
            headerName: 'Description',
            minWidth: 150,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row?.desc}`,
        },
        {
            field: 'priority',
            headerName: 'Priority',
            minWidth: 150,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.priority}`,
        },
        {
            field: 'assignee',
            headerName: 'Assignee',
            minWidth: 50,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.assigneeUser?.personalDetails?.firstName} ${params.row.assigneeUser?.personalDetails?.lastName
                    ? params.row.assigneeUser?.personalDetails?.lastName
                    : ''
                }`,
        },
        {
            field: 'assignor',
            headerName: 'Assignor',
            minWidth: 50,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.assignorUser?.personalDetails?.firstName} ${params.row.assignorUser?.personalDetails?.lastName
                    ? params.row.assignorUser.personalDetails?.lastName
                    : ''
                }`,
        },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            sortable: false,
            minWidth: 100,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.dueDate}`,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 100,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.status}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            width: 200,
            flex: 1,
            renderCell: renderActionCell,
            valueGetter: (params: GridValueGetterParams) => `${params.row.status}`,
        },
    ]

    return (
            <Box style={globalStyles.dataGridLayer}>
                <DataGrid
                    columns={columns}
                    rows={taskData || []}
                    disableColumnSelector={false}
                    rowHeight={64}
                    disableSelectionOnClick
                    sx={globalStyles.datagridSx}
                    onRowClick={(params: GridRowParams) => { setSelectedRowId(params.row.id); setOpenModal(true); }}
                    components={{
                        Footer: CustomFooter,
                    }}
                    componentsProps={{
                        footer: {
                            taskFilter: !showAll,
                            showTaskSwitch: true,
                            onTaskFilterSwitchClick: () => setShowAll(!showAll),
                        },
                    }}
                />
            {openModal && <Dialog open={openModal} onClose={() => { setOpenModal(false) }} fullWidth maxWidth={'md'}>
                <Typography variant={'h5'} mt={2}>Task Details</Typography>
                <TaskEditForm
                    data={data.filter((item: any) => item.id === selectedRowId)[0]} handleSubmit={() => { setOpenModal(false) }} reFetch={reFetch} readonly={true}
                />
            </Dialog>}
            </Box>
    );
}
