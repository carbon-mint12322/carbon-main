import React, { useState } from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import TableView from '../../../common/TableView';
import If from '~/components/lib/If';
import Dialog from '../../Feedback/Dialog';
import { pipe } from 'ramda';


interface TabComponentTableViewsProps {
    innerTabs: any
}

function InnerTab(props: any) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <TableView
                getRowId={(item) => item.id}
                name={props.title}
                columnConfig={props.columns}
                key={props.title}
                data={props.data}
                addBtnVisible={props.allowAdd}
                addBtnTitle={`Add ${props.title}`}
                handleAddBtnClick={() => {
                    setOpenDialog(true);
                }}
            />
            <If value={openDialog}>
                <Dialog
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={openDialog}
                    onClose={handleClose}
                    title={`Add ${props.title}`}
                >
                    <props.editor
                        onSubmit={pipe(props.handleFormSubmit, handleClose)}
                        formContext={props.formContext}
                        onCancelBtnClick={handleClose}
                    />
                </Dialog>
            </If>
        </>
    );
}

export default function TabComponentTableViews({
    innerTabs,
}: TabComponentTableViewsProps) {

    const components: any[] = [];

    innerTabs.map((tab: any) => {
        components.push({
            label: tab.title,
            count: tab.data?.length,
            component: (
                <InnerTab
                    title={tab.title}
                    columns={tab.columns}
                    data={tab.data}
                    allowAdd={tab.allowAdd}
                    handleFormSubmit={tab.handleFormSubmit}
                    formContext={tab.formContext}
                    editor={tab.editor}
                />
            ),
        })
    })

    return (
        <>
            <VerticalTabs
                labels={components?.map((item) => ({ label: item.label, count: item.count }))}
                panels={components?.map((item) => item.component)}
                isCountPresent
            />
        </>
    );
}
