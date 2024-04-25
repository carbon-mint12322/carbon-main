export default function getListData(data: any, modelName?: string, reFetch?: any, org?: string) {
    return {
        name: modelName,
        data: data,
        checkboxSelection: true,
        columnConfig: [],
        addBtnVisible: false
    };
}