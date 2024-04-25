export interface verticalTabI {
    title: string
    type: VerticalTabType
    props: any

}

export interface InfoTabComponentProps {
    verticalTabs: verticalTabI[]
    uiSchema: any,
    jsonSchema: any,
    data: any,
    handleFormSubmit: Function
}



export enum VerticalTabType {
    BasicInfo = "basicInfo"

}