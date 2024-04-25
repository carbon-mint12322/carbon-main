import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';

const identityFormatter = (value: any) => value;

const renderSchemeOwner = (reFetch: any) => (data: any) => {
    const ownerType = data?.ownerType;

    if (ownerType === 'Farmer') {
        const farmer = data?.farmer;
        if (farmer && farmer.personalDetails) {
            const { firstName, lastName } = farmer.personalDetails;
            return identityFormatter(`${firstName} ${lastName ? lastName : ''}`);
        }
    } else if (ownerType === 'Operator') {
        const collective = data?.collective;
        if (collective) {
            return identityFormatter(collective.name);
        }
    }

    // Default to the original behavior if ownerType is not 'farmer' or 'operator'
    return identityFormatter(data?.schemeOwner);
};

export default renderSchemeOwner;

