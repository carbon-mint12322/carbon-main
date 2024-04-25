export function getCertificates(documents?: Object[]): { title: string; href: string }[] {
  const isCertificate = (doc: { documentType?: unknown } | null) =>
    doc &&
    typeof doc === 'object' &&
    typeof doc.documentType === 'string' &&
    doc.documentType.toLowerCase().includes('certificate');

  return (
    documents
      ?.filter(isCertificate)
      ?.map((doc: any) => {
        if (doc.documentEvidence && typeof doc.documentEvidence === 'string') {
          // Handle the case with documentEvidence
          return {
            title: doc.documentDetails || doc.name,
            href: doc.documentEvidence,
          };
        } else if (doc.attachments && Array.isArray(doc.attachments)) {
          // Handle the case with attachments
          return doc.attachments.map((attachment : string) => ({
            title: doc.documentDetails || doc.name,
            href: attachment || false,
          }));
        }

        // Handle the case where neither documentEvidence nor attachments are present
        return null;
      })
      .reduce((acc, val) => (val ? acc.concat(val) : acc), []) // Flatten and filter null entries
      .filter((item : any) => typeof item.href === 'string') ?? []
  );
}
