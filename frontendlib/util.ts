import { NextRouter } from 'next/router';
import { getPageConfig } from '~/static/page-config';

export async function menuGssp(
  datasource: any, // function
  permittedRoles: string[],
  context: any,
) {
  const pageConfigProps = getPageConfig(context);

  return {
    props: {
      ...pageConfigProps.props,
    },
  };
}

export const navigateToParentPage = (router: NextRouter) => () => {
  const currentPath = router.asPath;
  const parentPageParts = currentPath.split('/');
  parentPageParts.pop();
  router.push(parentPageParts.join('/'));
};

export const navigateToListPage = (router: NextRouter) => () => {
  const currentPath = router.asPath;
  const parentPageParts = currentPath.split('/');
  parentPageParts.pop();
  router.push(parentPageParts.join('/').concat('/list'));
};

export const navigateToSuperParentPage = (router: NextRouter) => () => {
  const currentPath = router.asPath;
  const parentPageParts = currentPath.split('/');
  parentPageParts.pop();
  parentPageParts.pop();
  router.push(parentPageParts.join('/'));
};

const imgRegex = /(gif|jpe?g|png|webp)$/i;
const imgDataUrlRegex = /^data:image/;
const docRegex = /.pdf$|.doc?$|.xls$/i;
const pdfDataUrlRegex = /^data:application\/pdf/;
const audioRegex = /(mp3|mp4a|m4a)$/i;
const pdfRegex = /.pdf$/i;

export const isImgUrl = (url: string) => imgRegex.test(url) || imgDataUrlRegex.test(url);
export const isDocumentUrl = (url: string) => docRegex.test(url);
export const isPdfUrl = (url: string) => pdfRegex.test(url) || pdfDataUrlRegex.test(url);
export const isAudioUrl = (url: string) => audioRegex.test(url);

export const getFileUrl = (url: string, domain: string): string => {
  const filename = url?.toString().substring(url.lastIndexOf('/') + 1);
  return (domain === 'localhost' ? `http://` : `https://`).concat(domain === 'localhost' ? `${domain}:3000` : domain).concat(`/api/file/public?id=/gridfs:${process.env.NEXT_PUBLIC_TENANT_NAME}/${filename}`);
}

export const statusStep: {
  [key: string]: {
    buttonLabel: string;
    step: string;
  };
} = {
  Draft: {
    buttonLabel: 'Submit for Review',
    step: 'basicinfo',
  },
  'Under Review': {
    buttonLabel: 'Review & Approve',
    step: 'verification',
  },
  'Under Validation': {
    buttonLabel: 'Validate',
    step: 'validation',
  },
  'Review Failed': {
    buttonLabel: 'Submit for Review',
    step: 'basicinfo',
  },
  'Validation Failed': {
    buttonLabel: 'Submit for Review',
    step: 'basicinfo',
  },
  Approved: {
    buttonLabel: 'Approved',
    step: 'basicinfo',
  },
}
