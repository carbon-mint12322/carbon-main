import React from 'react';
import dayjs from 'dayjs';
import withAuth from '~/components/auth/withAuth';
import {Box, Grid, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '~/styles/theme/brands/styles';
export { default as getServerSideProps } from '~/utils/ggsp';
import { WfInstView } from "~/components/workflow/wf-view";
import { IStatusDisplayProps, NextAction, UserSubmitEvent, WorkflowInstProps } from '~/components/workflow/types';
import { useOperator } from '~/contexts/OperatorContext';
import { State, WorkflowInstance } from '~/backendlib/workflow/types';
import {
    QueryObserverResult,
    UseBaseMutationResult,
    UseMutationResult,
    useMutation,
    useQuery,
} from '@tanstack/react-query';
import { httpGet } from '~/frontendlib/model-lib/lib';
import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EventIcon from '@mui/icons-material/EventNoteOutlined';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

function UpdateWorkflow(props: any) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [wf, setWf] = React.useState<WorkflowInstance | null>(null);
    const [loading, seLoading] = React.useState<boolean>(false);
    const operatorCtx = useOperator();
    const url = operatorCtx.getApiUrl(`/workflow/WfInstance/${props.wfId}`);
    const getRQ = useQuery([url], () => httpGet(url), {
        enabled: false,
    });

    React.useEffect(() => {
        if (!props.wfId) {
            return;
        }
        seLoading(true);
        getRQ.refetch().then((data: QueryObserverResult<any>) => {
            const wf = data.data as WorkflowInstance;
            if (!wf) {
                return;
            }
            setWf(wf);
            seLoading(false);
        });
    }, [props.wfId]);

    return (
        <Grid container>
            <Grid item xs={3} md={3}>
                <TimelineView {...props} wf={wf} />
            </Grid>
            <Grid item xs={8} md={8}>
                <WfInstView instanceId={props.wfId as string} />
            </Grid>
            
        </Grid>
        
    );
}

function makeStateArr(node: State | undefined): State[] {
    if (!node) {
        return [];
    }
    if (!node.history) {
        return [node];
    }
    return [node, ...makeStateArr(node.history?.previousState)];
}

function stateLabel(state: State) {
    if (!state) {
        return 'Not submitted';
    }
    return state.name;
}

function StatusDisplay(props: IStatusDisplayProps) {
    const { label, icon, state } = props;
    const color = props.color;
    const user = state?.data.event?.userSession?.name || state?.data.event?.userSession?.email;
    const ts = state?.data.event?.ts;
    const tsStr = ts ? dayjs(ts).format('DD/MM/YY hh:mm') : '';

    const Small = (props: any) => (
        <div>
            <small>{props.children}</small>
        </div>
    );
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color={color}>{icon}</TimelineDot>
                {!props.endState ? <TimelineConnector /> : <></>}
            </TimelineSeparator>
            <TimelineContent sx={{ m: 'auto 0' }} variant='body2' color='text.secondary'>
                <Typography component='span'>{label}</Typography>
                {user && <Typography component={Small}>{user}</Typography>}
                {tsStr && <Typography component={Small}>{tsStr}</Typography>}
            </TimelineContent>
        </TimelineItem>
    );
}

function TimelineView(props: any) {
    const wf: WorkflowInstance = props.wf;

    const historyStates = makeStateArr(wf?.state);
    const currentState = wf?.state;

    return (
        <>
            <div>
                Status: <strong>{stateLabel(wf?.state)}</strong>
            </div>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {historyStates.filter((item: any) => item.name !== 'start').map((state: any, index: any) => {
                    return (<StatusDisplay
                        key={index}
                        color={'success'}
                        label={state.name}
                        wf={wf}
                        state={state}
                        icon={<EventIcon htmlColor='white' />}
                        setSelectedState={currentState}
                    />)
                })}
                
            </Timeline>
        </>
    );
}

export default (UpdateWorkflow);
