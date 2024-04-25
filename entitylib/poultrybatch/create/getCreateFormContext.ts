export default function getFormContext(props: any) {
    const productionSystemFilter = {
        landParcel: props?.landParcelId,
        category: 'Poultry',
    };
    const poultryPopFilter = {};
    return {
        getFilter: (key: any) => {
            switch (key) {
                case 'productionSystem':
                    return productionSystemFilter;
                case 'poultrypop':
                    return poultryPopFilter;
                default:
                    break;
            }
            throw new Error(`Unknown filter key in ui:options ${key}`);
        },
    };
}