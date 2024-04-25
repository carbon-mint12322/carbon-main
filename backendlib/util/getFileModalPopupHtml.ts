import { isUrl } from '~/backendlib/util/isUrl';
import { isImageUrl } from '~/backendlib/util/isImageUrl';
import { camelCaseToSentenceCase } from '~/utils/index';
import { getFileIcon } from '~/utils/getFileIcon';
import { isPdfUrl } from '~/frontendlib/util';

/** */
export function getFileModalPopupHtml(val: unknown): string {
  //
  if (!(typeof val === 'object' && Array.isArray(val) && val.length)) return '';

  return handleArray(val);
}

/** */
function handleArray(val: unknown[]) {
  //
  const arr = [];

  // get any text list
  const texts = val.filter((url) => !isUrl(url));

  // get all urls
  const urls = val.filter((url) => isUrl(url));
  const imageUrls = urls.filter((url) => isImageUrl(url));
  const otherUrls = urls.filter((url : any) => !isImageUrl(url) && !isPdfUrl(url));
  const pdfUrls = urls.filter((url : any) => isPdfUrl(url));

  //
  const isString = (v: unknown): v is string => typeof v === 'string';

  if (imageUrls.length) {
    //
    const imgArrComponent = imageUrls
      .filter(isString)
      .map(
        (url) =>
          '<div class="flex-column col-xs-4 imgs" ' +
          onClickHandlerHtml(url) +
          '>  <img src="' +
          url +
          '"  height="100" width="100" /> </div>',
      );

    //
    arr.push(
      '<div class="card-text d-flex flex-row flex-wrap">' +
        imgArrComponent.join('&nbsp;') +
        '</div>',
    );
  }

  if (otherUrls.length) {
    //
    const otherUrlsComponent = otherUrls
      .filter(isString)
      .map(
        (url) =>
          '<div class="flex-column col-xs-4 otherFiles"> <a target="_blank" rel="noopener noreferrer" href="' +
          url +
          '">' +
          getFileIcon() +
          '</a></div>',
      );

    //
    arr.push(
      '<div class="card-text d-flex flex-row flex-wrap">' +
        otherUrlsComponent.join('&nbsp;') +
        '</div>',
    );
  }

  if (pdfUrls.length) {
    //
    const pdfUrlsComponent = pdfUrls
      .filter(isString)
      .map(
        (url) =>
          '<div class="flex-column col-xs-4 pdfFiles"><span class="text-two pb-3 documentLink" data-href="'+ url +'" data-title="Doc"><img src="https://img.icons8.com/office/40/pdf.png" data-title="Doc" data-href="'+ url + '" height="50" width="50" class="documentPreviewer"></span></div>',
      );

    //
    arr.push(
      '<div class="card-text d-flex flex-row flex-wrap">' +
      pdfUrlsComponent.join('&nbsp;') +
        '</div>',
    );
  }

  if (texts.length) {
    const textsComponent = texts
      .filter(isString)
      .map((text) => '<li>' + camelCaseToSentenceCase(text) + '</li>');
    arr.push('<div class="card-text texts"><ul>' + textsComponent.join('&nbsp;') + '</ul></div>');
  }

  return arr.join(' ');
}

/** */
function onClickHandlerHtml(url: string) {
  return "onclick='" + 'imageModalPopUp("' + url + '")' + "'";
}
