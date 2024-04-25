import Map from "~/components/CommonMap";
import { Coordinate } from "~/utils/coordinatesFormatter";

interface Props { nestedCoordinates: Coordinate[][], markers: Coordinate[] }

export function QRMapWithMarkers({ nestedCoordinates, markers }: Props) {

    return <Map

        //
        polygons={[{ paths: [] }]}

        // Setting markers
        markers={markers.map(coordinate => {
            return { position: coordinate }
        })}
    />
}