import { isImageUrl } from '~/backendlib/util/isImageUrl';

export function processEvidences(events: any, globalIndex: number, plotMap: any, landParcelMap: any, fieldParcelMap: any) {
    return events.flatMap((event: any) => {
        return event.fullDetails?.evidences
            ? event.fullDetails.evidences
                ?.filter((ev: any) => ev !== null && isImageUrl(ev))
                .map((ev: any, secondIndex: number) => {
                    const currentIndex = globalIndex;
                    globalIndex++;
                    return {
                        index: currentIndex,
                        event: event,
                        markers: [event?.markers[secondIndex]],
                        url: ev,
                        nestedCoordinates: plotMap ? [landParcelMap, fieldParcelMap, plotMap] : [landParcelMap, fieldParcelMap],
                        isFirst: currentIndex === 0,
                        notFirst: currentIndex !== 0,
                    };
                })
                .concat(
                    event.fullDetails?.durationAndExpenses?.photoEvidenceBeforeAfter
                        ? event.fullDetails.durationAndExpenses.photoEvidenceBeforeAfter?.filter((photoUrl: any) => photoUrl !== null && isImageUrl(photoUrl)).map((photoUrl: any, thirdIndex: number) => {
                            const currentIndex = globalIndex;
                            globalIndex++;
                            return {
                                index: currentIndex,
                                event: event,
                                markers: [event?.markers[thirdIndex]],
                                url: photoUrl,
                                nestedCoordinates: plotMap ? [landParcelMap, fieldParcelMap, plotMap] : [landParcelMap, fieldParcelMap],
                                isFirst: currentIndex === 0,
                                notFirst: currentIndex !== 0,
                            };
                        })
                        : [],
                    event.fullDetails?.durationAndExpenses?.documentEvidenceInvoice
                        ? event.fullDetails.durationAndExpenses.documentEvidenceInvoice?.filter((docUrl: any) => docUrl !== null && isImageUrl(docUrl)).map((docUrl: any, fourthIndex: number) => {
                            const currentIndex = globalIndex;
                            globalIndex++;
                            return {
                                index: currentIndex,
                                event: event,
                                markers: [event?.markers[fourthIndex]],
                                url: docUrl,
                                nestedCoordinates: plotMap ? [landParcelMap, fieldParcelMap, plotMap] : [landParcelMap, fieldParcelMap],
                                isFirst: currentIndex === 0,
                                notFirst: currentIndex !== 0,
                            };
                        })
                        : []
                )
            : [];
    });
}