import { QRCard } from '~/frontendlib/QR/QRCard';
import { getEvidencesHtml } from './getEvidencesHtml';
import { getHtmlFromSchemaAndData } from './getHtmlFromSchemaAndData';
import { getSchemaAndUISchema } from './getSchemaAndUISchema';
import { getStaticHtmlFromReactComponent } from './getStaticHtmlFromReactComponent';
import React from 'react';

/** */
export async function getHtmlFoEvent({
  eventData,
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
  eventData: Record<string, any>;
}): Promise<string> {
  //
  const { schema, uiSchema } = getSchemaAndUISchema(eventName);

  //
  const eventHtml = getHtmlFromSchemaAndData({ data: eventData, schema, uiSchema });

  //
  const evidencesHtml = getEvidencesHtml(eventData);

  return [
    getStaticHtmlFromReactComponent(
      React.createElement(QRCard, { body: eventHtml + '<br />' }, []),
    ),
    evidencesHtml
      ? getStaticHtmlFromReactComponent(
          React.createElement(QRCard, { title: 'Evidences', body: evidencesHtml + '<br />' }, []),
        )
      : '',
  ].join(' ');
}
