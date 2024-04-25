export interface EntityScheduledEventEditFormProps {
    data: any;
    currentPlanId: string | undefined;
    handleSubmit: () => void;
    reFetch?: () => void;
    readonly?: boolean;
}
