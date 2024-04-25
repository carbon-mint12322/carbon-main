import React, { FC, ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function getStaticHtmlFromReactComponent(component: ReactElement) {
  return renderToStaticMarkup(component);
}
