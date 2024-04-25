
import { State, WorkflowInstance } from '~/backendlib/workflow/types';
import * as React from 'react';
import {
    QueryObserverResult,
    useQuery
} from '@tanstack/react-query';
import { useOperator } from '~/contexts/OperatorContext';
import { httpGet } from '~/frontendlib/model-lib/lib';
import HistoryView from '../workflow/HistoryView';
import CircularLoader from './CircularLoader';

function makeStateArr(node: State | undefined): State[] {
    if (!node) {
        return [];
    }
    if (!node.history) {
        return [node];
    }
    return [node, ...makeStateArr(node.history?.previousState)];
}


function historyStateLabel(state: State) {
    if (!state) {
        return 'Not submitted';
    }
    switch (state.name) {
        case 'validated':
            return 'Validated';
        case 'validateFailed':
            return 'Validation Failed';
        case 'reviewFailed':
            return 'Review Failed';
        case 'waitingForReview':
            return 'Under Review';
        case 'waitingForValidation':
            return 'Under Validation';
        default:
            return state.name;
    }
}

export default function HistoryTab(props: any) {
    const [wf, setWf] = React.useState<WorkflowInstance | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const operatorCtx = useOperator();
    const url = operatorCtx.getApiUrl(`/workflow/WfInstance/${props.wfId}`);
    const getRQ = useQuery([url], () => httpGet(url), {
        enabled: false,
    });

    React.useEffect(() => {
        if (!props.wfId) {
            return;
        }
        setLoading(true);
        getRQ.refetch().then((data: QueryObserverResult<any>) => {
            const wf = data.data as WorkflowInstance;
            if (!wf) {
                return;
            }
            setWf(wf);
            setLoading(false);
        });
    }, [props.wfId]);

    return (
        <CircularLoader value={loading}>
            <HistoryView
                wf={wf}
                makeStateArr={makeStateArr}
                stateLabel={historyStateLabel}
            />
        </CircularLoader>
    );
}