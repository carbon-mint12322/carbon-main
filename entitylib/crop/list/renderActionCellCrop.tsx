import dynamic from 'next/dynamic';
import RenderActionCell from '~/entitylib/functions/renderCells/renderActionCell';
const CropEditor = dynamic(import('~/gen/data-views/crop/cropEditor.rtml'));

const render = (reFetch: any) => (data: any) => {
    const landParcelId = data?.landParcel?.id;
    const csFilter = {
        landParcel: landParcelId
    };
    const plotFilter = {
        landParcel: landParcelId,
    };
    const popFilter = {};
    const masterCropFilter = {};
    const formContext: any = {
        getFilter: (key: string) => {
            switch (key) {
                case 'croppingSystem': // this key is defined as ui:options in yaml
                    return csFilter;
                case 'plot': // this key is defined as ui:options in yaml
                    return plotFilter;
                case 'pop': // this key is defined as ui:options in yaml
                    return popFilter;
                case 'mastercrop': // this key is defined as ui:options in yaml
                    return masterCropFilter;
                default:
                    break;
            }
            throw new Error(`Unknown filter key in ui:options ${key}`);
        },
    };

    return RenderActionCell({ data, modelName: 'crop', formContext, reFetch, canBeCompleted: true, showCompleteOption: true, Editor: CropEditor })
};

export default render;