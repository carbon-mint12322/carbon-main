import axios from 'axios';

export const bulkEventForm = async (data: Object, selectionModel : any, domainSchemaName : String, url : any) => {
    await axios.post(url, {
        entityIds: selectionModel,
        event: data,
        domainSchemaName
    })
};