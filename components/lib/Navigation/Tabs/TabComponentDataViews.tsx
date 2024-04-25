import React, { useState } from 'react';

import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import TableView from '../../../common/TableView';
import If from '~/components/lib/If';
import Dialog from '../../Feedback/Dialog';
import { pipe } from 'ramda';
import ReactJsonSchemaForm from '~/components/lib/ReactJsonSchemaForm';


interface TabComponentDataViewsProps {
    verticalTabs: any
}

function VerticalTab(props: any) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <ReactJsonSchemaForm
                modelName={props.modelName}
                schema={props.jsonSchema}
                uiSchema={props.uiSchema}
                formData={props.formData}
                formContext={props.formContext}
                onSubmit={props.onSubmit}
                onSuccess={props.onSuccess}
                onChange={props.onChange}
                onError={props.onError}
                onSettled={props.onSettled}
                onSubmitAttempt={props.onSubmitAttempt}
                onFormError={props.onFormError}
                mainBtnLabel={props.mainBtnLabel}
                onCancelBtnClick={props.onCancelBtnClick}
                readonly={true}
            />
            <If value={openDialog}>
                <Dialog
                    fullWidth={true}
                    maxWidth={'lg'}
                    open={openDialog}
                    onClose={handleClose}
                    title={`Edit`}
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

export default function TabComponentDataViews({
    verticalTabs,
}: TabComponentDataViewsProps) {

    const components: any[] = [];

    verticalTabs.map((tab: any) => {
        components.push({
            label: tab.title,
            count: tab.data?.length,
            component: (
                <VerticalTab
                    title={tab.title}
                    data={tab.data}
                    allowEdit={tab.allowEdit}
                    handleFormSubmit={tab.handleFormSubmit}
                    formContext={tab.formContext}
                    editor={tab.editor}
                    nodePath={tab.props.nodePath}
                    viewUiOrder={tab.props.viewUiOrder}
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
