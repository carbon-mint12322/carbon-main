import React, { useMemo } from 'react';
import _ from 'lodash';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import globalStyles from '~/styles/theme/brands/styles';
import DataGrid from '~/components/lib/DataDisplay/DataGrid';
import CustomFooter from '~/components/lib/CustomFooter';
import { Grid, Paper, Typography } from '@mui/material';


interface ImpactProps {
    data: any;
}

export default function Impact({ data }: ImpactProps) {

    const impact = useMemo(
        () => ({
            total_energy_saved: _.round(
                _.sum(data?.map((item: any) => item.details.energySaved || 0) || []),
                2,
            ),
            total_water_saved: _.round(
                _.sum(data?.map((item: any) => item.details.waterSaved || 0) || []),
                2,
            ),
            total_ghgEmissions_saved: _.round(
                _.sum(data?.map((item: any) => item.details.ghgEmissionsSaved || 0) || []),
                2,
            ),
            total_methane_reductions: _.round(
                _.sum(data?.map((item: any) => item.details.methaneReductions || 0) || []),
                2,
            ),
        }),
        [data],
    );

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.name}`,
        },
        {
            field: 'startDate',
            headerName: 'Start date',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.durationAndExpenses?.startDate || params.row.details?.startDate || 'NA'}`,
        },
        {
            field: 'endDate',
            headerName: 'End date',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.durationAndExpenses?.endDate || params.row.details?.endDate || 'NA'}`,
        },
        {
            field: 'totalMenLabourDays',
            headerName: 'Total men labour days',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.durationAndExpenses?.totalMenLabourDays || 0} days`,
        },
        {
            field: 'totalWomenLabourDays',
            headerName: 'Total women labour days',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.durationAndExpenses?.totalWomenLabourDays || 0} days`,
        },
        {
            field: 'totalLabourExpenditure',
            headerName: 'Total labour expenditure (rupees)',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `Rs.${params.row.details.durationAndExpenses?.totalLabourExpenditure || 0}`,
        },
        {
            field: 'energySaved',
            headerName: 'Energy saved (kwh)',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.energySaved || 0} kwh`,
        },
        {
            field: 'waterSaved',
            headerName: 'Water saved (litres)',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.waterSaved || 0} litres`,
        },
        {
            field: 'ghgEmissionsSaved',
            headerName: 'GHG emissions saved (metric tonnes)',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.ghgEmissionsSaved || 0} mt`,
        },
        {
            field: 'methaneReductions',
            headerName: 'Methane reduction (cubic meters)',
            flex: 1,
            valueGetter: (params: GridValueGetterParams) => `${params.row.details.methaneReductions || 0} m3`,
        },
    ]

    return (
        <Grid>
            <Grid container direction='row' justifyContent={'space-between'}>
                <Typography fontSize='16px' fontWeight='600'>
                    Events ({data?.length || 0})
                </Typography>
            </Grid>
            <Grid
                height='fit-content'
                maxHeight='200vh'
                sx={{ bgcolor: 'common.white' }}
                component={Paper}
                elevation={0}
            >
                <DataGrid
                    columns={columns}
                    rows={data || []}
                    autoHeight
                    disableColumnSelector={false}
                    rowHeight={64}
                    disableSelectionOnClick
                    getRowId={(item) => item.id as string}
                    sx={globalStyles.datagridSx}
                    components={{
                        Footer: CustomFooter,
                    }}
                    componentsProps={{
                        footer: {
                            showActiveSwitch: false,
                            children: (
                                <Grid maxWidth='fit-content' container gap={1}>
                                    <Typography sx={{ mr: 1 }}>
                                        Total Energy Saved: {impact.total_energy_saved} kwh
                                    </Typography>
                                    <Typography sx={{ mr: 1 }}>
                                        Total Water Saved: {impact.total_water_saved} litres
                                    </Typography>
                                    <Typography sx={{ mr: 1 }}>
                                        Total GHG Emissions Saved: {impact.total_ghgEmissions_saved} mt
                                    </Typography>
                                    <Typography sx={{ mr: 1 }}>
                                        Total Methane Reductions: {impact.total_methane_reductions} m3
                                    </Typography>
                                </Grid>
                            ),
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
}
