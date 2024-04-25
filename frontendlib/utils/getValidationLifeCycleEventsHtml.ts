import { get } from 'lodash';
import { getHtmlFromSchemaAndData } from '~/backendlib/util/getHtmlFromSchemaAndData';
import AddNotesJsonSchema from '~/gen/jsonschemas/add_notes.json';
import AddNotesUiSchema from '~/gen/ui-schemas/add_notes-ui-schema.json';

interface Props {
  username: string;
  status: string;
  dateTime: string;
  formObj?: Record<string, any>;
}

export function getValidationLifeCycleEventsHtml(events: Props[]) {
  return getLeftBar(events) + getEventDesc(events);
}

/** */
function getLeftBar(events: Props[]) {
  //
  const getIcon = (status: string) => {
    if (status?.includes('fail'))
      return `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4999 13.6946L10.6678 1.82974C10.4971 1.53906 10.2534 1.29803 9.9608 1.13057C9.66823 0.9631 9.33697 0.875 8.99986 0.875C8.66275 0.875 8.33149 0.9631 8.03892 1.13057C7.74635 1.29803 7.50262 1.53906 7.33189 1.82974L0.499862 13.6946C0.335593 13.9757 0.249023 14.2955 0.249023 14.6211C0.249023 14.9468 0.335593 15.2665 0.499862 15.5477C0.668401 15.8401 0.911713 16.0825 1.20483 16.2498C1.49795 16.4172 1.83032 16.5036 2.16783 16.5001H15.8319C16.1691 16.5033 16.5012 16.4168 16.794 16.2494C17.0868 16.0821 17.3299 15.8399 17.4983 15.5477C17.6628 15.2667 17.7496 14.947 17.7499 14.6214C17.7502 14.2957 17.6639 13.9759 17.4999 13.6946ZM16.4163 14.9219C16.3567 15.0235 16.2712 15.1075 16.1685 15.1651C16.0658 15.2228 15.9496 15.2521 15.8319 15.2501H2.16783C2.05008 15.2521 1.9339 15.2228 1.83121 15.1651C1.72852 15.1075 1.64302 15.0235 1.58346 14.9219C1.52951 14.8306 1.50105 14.7264 1.50105 14.6204C1.50105 14.5143 1.52951 14.4101 1.58346 14.3188L8.41549 2.45396C8.47625 2.35284 8.56215 2.26917 8.66482 2.21108C8.7675 2.153 8.88346 2.12247 9.00142 2.12247C9.11939 2.12247 9.23535 2.153 9.33803 2.21108C9.4407 2.26917 9.5266 2.35284 9.58736 2.45396L16.4194 14.3188C16.4729 14.4104 16.5008 14.5147 16.5002 14.6208C16.4997 14.7269 16.4707 14.8309 16.4163 14.9219ZM8.37486 10.2501V7.12505C8.37486 6.95929 8.44071 6.80032 8.55792 6.68311C8.67513 6.5659 8.8341 6.50005 8.99986 6.50005C9.16562 6.50005 9.32459 6.5659 9.4418 6.68311C9.55901 6.80032 9.62486 6.95929 9.62486 7.12505V10.2501C9.62486 10.4158 9.55901 10.5748 9.4418 10.692C9.32459 10.8092 9.16562 10.8751 8.99986 10.8751C8.8341 10.8751 8.67513 10.8092 8.55792 10.692C8.44071 10.5748 8.37486 10.4158 8.37486 10.2501ZM9.93736 13.0626C9.93736 13.248 9.88238 13.4292 9.77936 13.5834C9.67635 13.7376 9.52993 13.8577 9.35863 13.9287C9.18732 13.9996 8.99882 14.0182 8.81696 13.982C8.63511 13.9459 8.46806 13.8566 8.33695 13.7255C8.20584 13.5944 8.11655 13.4273 8.08038 13.2454C8.0442 13.0636 8.06277 12.8751 8.13372 12.7038C8.20468 12.5325 8.32484 12.3861 8.47901 12.283C8.63319 12.18 8.81444 12.1251 8.99986 12.1251C9.2485 12.1251 9.48696 12.2238 9.66277 12.3996C9.83859 12.5755 9.93736 12.8139 9.93736 13.0626Z" fill="white"/>
              </svg>
      `;

    return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5672 6.68281C12.6253 6.74086 12.6714 6.80979 12.7029 6.88566C12.7343 6.96154 12.7505 7.04287 12.7505 7.125C12.7505 7.20713 12.7343 7.28846 12.7029 7.36434C12.6714 7.44021 12.6253 7.50914 12.5672 7.56719L8.19219 11.9422C8.13415 12.0003 8.06522 12.0464 7.98934 12.0779C7.91347 12.1093 7.83214 12.1255 7.75 12.1255C7.66787 12.1255 7.58654 12.1093 7.51067 12.0779C7.43479 12.0464 7.36586 12.0003 7.30782 11.9422L5.43282 10.0672C5.31554 9.94991 5.24966 9.79085 5.24966 9.625C5.24966 9.45915 5.31554 9.30009 5.43282 9.18281C5.55009 9.06554 5.70915 8.99965 5.875 8.99965C6.04086 8.99965 6.19992 9.06554 6.31719 9.18281L7.75 10.6164L11.6828 6.68281C11.7409 6.6247 11.8098 6.5786 11.8857 6.54715C11.9615 6.5157 12.0429 6.49951 12.125 6.49951C12.2071 6.49951 12.2885 6.5157 12.3643 6.54715C12.4402 6.5786 12.5091 6.6247 12.5672 6.68281ZM17.125 9C17.125 10.607 16.6485 12.1779 15.7557 13.514C14.8629 14.8502 13.594 15.8916 12.1093 16.5065C10.6247 17.1215 8.99099 17.2824 7.4149 16.9689C5.8388 16.6554 4.39106 15.8815 3.25476 14.7452C2.11846 13.6089 1.34463 12.1612 1.03112 10.5851C0.717618 9.00901 0.87852 7.37535 1.49348 5.8907C2.10844 4.40605 3.14985 3.1371 4.486 2.24431C5.82214 1.35152 7.39303 0.875 9 0.875C11.1542 0.877275 13.2195 1.73403 14.7427 3.25727C16.266 4.78051 17.1227 6.84581 17.125 9ZM15.875 9C15.875 7.64025 15.4718 6.31104 14.7164 5.18045C13.9609 4.04987 12.8872 3.16868 11.631 2.64833C10.3747 2.12798 8.99238 1.99183 7.65876 2.2571C6.32514 2.52237 5.10013 3.17716 4.13864 4.13864C3.17716 5.10013 2.52238 6.32513 2.2571 7.65875C1.99183 8.99237 2.12798 10.3747 2.64833 11.6309C3.16868 12.8872 4.04987 13.9609 5.18046 14.7164C6.31105 15.4718 7.64026 15.875 9 15.875C10.8227 15.8729 12.5702 15.1479 13.8591 13.8591C15.1479 12.5702 15.8729 10.8227 15.875 9Z" fill="white"/>
            </svg>
    `;
  };

  //
  const content = events.map((event, index) => {
    const iconBgColor = (() => {
      if (event?.status?.toLowerCase().includes('fail')) return 'orange';

      return '#8bc34a';
    })();

    let html = `
            <div class="statusLogo"
              style="max-height:70px; border-radius:20px; background-color:${iconBgColor}; color: white; padding: 5px;">
              ${getIcon(event?.status?.toLowerCase())}
              </svg>
            </div>
    `;

    if (index < events.length - 1) {
      html += `
            <div class="stick" style="border: 1px solid grey;max-width: 1px;height: 45px;"></div>
      `;
    }

    return html;
  });

  return `
         <div class="leftBar d-flex flex-column justify-content-start align-items-center"
            style="max-width: 50px; margin-right: 10px;">
            ${content.join('')}
          </div>
    `;
}

/** */
function getEventDesc(events: Props[]) {
  //
  const content = events.map(({ username, status, formObj, dateTime }, index) => {
    const marginCss = index > 0 ? 'margin-top: 25px;' : '';

    let form = '';

    if (formObj && typeof formObj === 'object' && Object.keys(formObj).length) {
      form = getHtmlFromSchemaAndData({
        data: formObj,
        schema: AddNotesJsonSchema as any,
        uiSchema: AddNotesUiSchema,
      });
    }

    const creationDetailsHtml = (() => {
      let html = ``;

      if (username)
        html += `<span style="color: #959595;font-size: smaller;">${username}</span> • `;

      if (dateTime) html += `<span style="color: #959595;font-size: smaller;">${dateTime}</span>`;

      return html + '<br />';
    })();

    return `
       <div style="${marginCss}">
          <span
            class="validationEventForm ${form.length > 0 && 'fakeLink'}"
            data-validation-event-form='${form}'
            data-validation-event-form-title="${status}"
            style="font-size: 0.875rem;"
          >
            ${status}
          </span>
          <br />            
          ${creationDetailsHtml}           
        </div>
    `;
  });

  //
  return `
    <div class="mainBar" style="d-flex flex-column justify-content-center align-items-start">
    ${content.join('')}
    </div>
  `;
}
