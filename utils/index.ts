import createEmotionCache from './createEmotionCache';

const formatPhoneNumber = (phone: string) => {
  return phone.toString().replace(/\s/g, '').replace('-', '');
};

const camelCaseToSentenceCase = (string: string) => {
  const result = string?.replace(/([A-Z])/g, ' $1');
  const newText = result?.charAt(0)?.toUpperCase() + result?.slice(1);
  return newText;
};

const getQueryParams = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries());
};

export { createEmotionCache, formatPhoneNumber, getQueryParams, camelCaseToSentenceCase };
