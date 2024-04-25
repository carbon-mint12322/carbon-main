import VerticalTabs from "~/components/lib/Navigation/VerticalTabs";
import { InfoTabComponentProps, VerticalTabType, verticalTabI } from "./index.interface";
import KeyPairListComponent from "~/components/lib/KeyPairListComponent";
import VerticalTabComponentView from "~/components/lib/VerticalTabComponentView";
import { get } from 'lodash'
import stringFormatter from '~/utils/stringFormatter';
import numberFormatter from '~/utils/numberFormatter';
import dateFormatter from '~/utils/dateFormatter';


export const camelCastToTitleCase = (text: string) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}


export default function InfoTabComponent(_props: InfoTabComponentProps) {
    const { verticalTabs, jsonSchema: jsonSchemaOriginal, handleFormSubmit, data } = _props
    const formatJsonSchema = (schema: any) => {
        const formattedSchema: any = {};
        for (const [key, value] of Object.entries(schema) as any) {
            if (value.properties) {
                formattedSchema[key] = formatJsonSchema(value.properties);
            } else {
                formattedSchema[key] = value;
            }
        }
        return formattedSchema;
    }

    const jsonSchema = formatJsonSchema(jsonSchemaOriginal)

    const formatDataFromKeyToObject = (
        { keys, data, nodePath }:
            { keys: string[], data: any, nodePath: string }
    ) => {
        const result: any = []

        for (let x = 0; x < keys.length; x++) {
            const key = keys[x];
            const jsonEle = get(jsonSchema, nodePath ? `${nodePath}.${key}` : key, '')
            const label = jsonEle?.title
            const subTextData = (nodePath ?
                get(data, nodePath ? `${nodePath}.${key}` : key, '')
                : get(data, key)) || ''
            const subText = formatSubTextData({ subTextData, type: jsonEle.type })
            result.push({
                title: label,
                subText
            })
        }
        return result
    }

    const formatSubTextData = ({ subTextData, type }: any) => {

        switch (type.toLowerCase()) {
            case "string":
                return stringFormatter(subTextData ? subTextData : null)

            case "number":
                return numberFormatter(subTextData ? subTextData : null)


            case "date":
                return dateFormatter(subTextData ? subTextData : null)

            case "object":
                return null
            default:
                return subTextData
        }
    }


    const formattedDataBasicInfo = (tab: verticalTabI) => {
        const { props: { viewUiOrder, nodePath } } = tab
        const schemaNodePathValues = Object.keys(nodePath ? get(jsonSchema, nodePath) : jsonSchema)
        const sortedUIOrder = viewUiOrder.reduce((res: string[], it: string, i: number, { [i + 1]: next }: string) => {
            let a1 = schemaNodePathValues.find(x => {
                if (it.includes(x)) {
                    return it
                }
            });
            if (a1) res.push(it);
            if (next) return res;
            else {
                if (viewUiOrder.find((viewUi: string) => viewUi === '*')) {
                    return res.concat(schemaNodePathValues.filter(r => !res.some(z => z === r)));
                } else {
                    return res
                }
            }
        }, []).filter((item: string) => item != '*');
        return formatDataFromKeyToObject({ data, keys: sortedUIOrder, nodePath })
    }

    const getTabJsonSchema = (tab: any) => tab?.props?.nodePath ?
        get(jsonSchema, tab?.props?.nodePath) : jsonSchema


    const getTabData = (tab: any) => {
        let formattedData: any = {}
        Object.keys(getTabJsonSchema(tab)).map(schemaKey => {
            formattedData[schemaKey] = get(data, `${get(tab, "props", "nodePath")}.${schemaKey}`, '')
        });
        return formattedData
    }
    return (
        <VerticalTabs
            labels={verticalTabs?.map((item: verticalTabI, index) => {
                return { label: item.title };
            })}
            panels={verticalTabs?.map((tab: any, index: any) => {
                if (tab?.component) {
                    return tab?.component;
                }
                return (
                    <VerticalTabComponentView
                        key={index}
                        title={tab.title}
                        buttonLabel={"Edit"}
                        handleMainBtnClick={handleFormSubmit}
                        jsonSchema={getTabJsonSchema(tab)}
                        data={getTabData(tab)}
                        uiSchema={tab.props.viewUiOrder}
                    >
                        <KeyPairListComponent items={formattedDataBasicInfo(tab)} />
                    </VerticalTabComponentView>
                )
            })}
        />
    )
}