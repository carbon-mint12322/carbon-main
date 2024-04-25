function GLOBAL_FarmbookEventDetail(id, eventDetails) {

    const MAP_ID = 'map_component_for_event_event_detail';
    const BREAKPOINTS = 'col-lg-12';

    /** Runs on function call */
    (function replaceHtml() {

        let html = getStyles();
        let mapEventDetail = false;

        for (const eventDetail of eventDetails) {

            if (eventDetail.UIRenderType === "map") {
                mapEventDetail = eventDetail;
                continue;
            }

            html += getHtmlContentForEventDetail(eventDetail);
        }

        if (mapEventDetail) {
            html += getMapSection();

        }

        // Html is replaced in DOM
        document.getElementById(id).innerHTML = html;


        if (mapEventDetail) {
            // Map is called after, because only after html is replaced component can be used
            new Map(
                mapEventDetail.nestedCoordinates,
                mapEventDetail.markers,
            )
        }
    })();

    /** */
    function getStyles() {
        return "<style>      * {        /* outline: solid red 1px; */        font-family: 'Inter', sans-serif;        font-weight: 500;      }      .headerContent {        font-weight: 700;      }      .usingContentBox {        box-sizing: content-box;      }      body {        background-color: #f5f5f5;      }      .fadedText {        color: grey;      }      .card {        border-radius: 0px;        margin-bottom: .2rem;      }      .firstCard {        border-top-left-radius: 10px;        border-top-right-radius: 10px;        margin-top: 20px;      }      .lastCard {        border-bottom-left-radius: 10px;        border-bottom-right-radius: 10px;        margin-bottom: 20px;      }      .card-header {        background-color: white;      }    </style>"
    }

    /** */
    function getHtmlContentForEventDetail(eventDetail) {

        let html = '';

        const { name: header, UIRenderType, ...rest } = eventDetail;

        if (UIRenderType === "root") {
            html += getRootSection(header)
            html += getSubSection({ bodies: getCardContent(rest) })
        } else {
            html += getSubSection({ header, bodies: getCardContent(rest) })
        }

        return html;
    }

    /** */
    function getRootSection(header) {
        return '<section class="hero row justify-content-center">                    <div class="' + BREAKPOINTS + '">                    <div class="card firstCard">                        <div class="card-body">                        <h4 class="card-title headerContent">' + header + '</h4>                        </div>                    </div>                    </div>                </section>'
    }

    /** */
    function getSubSection(cardContent) {

        let cardBodies = "";

        if (cardContent.header) {
            cardBodies += cardHeaderWrapper(cardContent.header);
        }

        if (cardContent.bodies) {
            for (const body of cardContent.bodies) {
                cardBodies += cardBodyWrapper(body);
            }
        }

        return rowWrapper(columnWrapper(cardWrapper(cardBodies)));
    }

    /** */
    function cardHeaderWrapper(html) {
        return '<div class="card-header fadedText">' + html + '</div>'
    }

    /** */
    function cardBodyWrapper(html) {
        return '<div class="card-body">' + html + '</div>'
    }

    /** */
    function rowWrapper(html) {
        return '<section class="hero row justify-content-center">' + html + '</section';
    }

    /** */
    function columnWrapper(html) {
        return '<div class="' + BREAKPOINTS + '">' + html + '</div>';
    }

    /** */
    function cardWrapper(html) {
        return '<div class="card">' + html + '</div>';
    }

    /** */
    function getCardContent(obj) {

        let contents = [];

        for (const key in obj) {

            let content = (key !== "UIRenderValues") ? cardTitleWrapper('<p class="card-title fadedText">' + key + '</p>') : "";

            content += getFormattedVal(obj[key], key);

            contents.push(content);
        }

        return contents;
    }

    /** */
    function getFormattedVal(val) {

        const onClickHandlerHtml = (url) => "onclick='" + 'imageModalPopUp("' + url + '")' + "'";

        const valType = typeof val;

        if (valType === "number")
            return cardTextWrapper('<p class="card-text">' + val + '</p>');

        if (valType === "string") {

            if (isUrl(val)) return cardTextWrapper('<p class="card-text"' + onClickHandlerHtml(val) + '><img src="' + val + '" height="100" width="100" /> </p>');

            return cardTextWrapper('<p class="card-text">' + val + '</p>');
        }

        if (valType === "object" && Array.isArray(val)) {

            // get any text list
            const texts = val.filter(url => !isUrl(url));

            // get all urls
            const urls = val.filter(url => isUrl(url));
            const imageUrls = urls.filter(url => isImageUrl(url));
            const otherUrls = urls.filter(url => !isImageUrl(url));


            const arr = [];

            if (imageUrls.length) {

                const imgArrComponent = imageUrls.map(url => '<div class="flex-column col-xs-4 imgs" ' + onClickHandlerHtml(url) + '>  <img src="' + url + '"  height="100" width="100" /> </div>');
                arr.push('<div class="card-text d-flex flex-row flex-wrap">' + imgArrComponent.join("&nbsp;") + '</div>')
            }

            if (otherUrls.length) {
                const otherUrlsComponent = otherUrls.map(url => '<div class="flex-column col-xs-4 otherFiles"> <a target="_blank" rel="noopener noreferrer" href="' + url + '">' + getFileIcon(url) + '</a></div>');
                arr.push('<div class="card-text d-flex flex-row flex-wrap">' + otherUrlsComponent.join("&nbsp;") + '</div>');
            }

            if (texts.length) {
                const textsComponent = texts.map(text => '<li>' + camelCaseToSentence(text) + '</li>');
                arr.push('<div class="card-text texts"><ul>' + textsComponent.join("&nbsp;") + '</ul></div>')
            }


            return arr.join("&nbsp;")
        };
    }

    /** */
    function cardTitleWrapper(html) {
        return '<div class="card-title"> ' + html + '</div>';
    }

    /** */
    function cardTextWrapper(html) {
        return '<div class="card-text">' + html + '</div>'
    }

    /** */
    function isUrl(url) {
        return typeof url === "string" && url.startsWith('http')
    }

    /** */
    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
    }


    /** */
    function getFileIcon() {
        return '<img height="100" weight="100"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="#FFF"> 	<path d="M60.9579,8h-42.688C17.5685,8,17,8.5685,17,9.2698v77.4603C17,87.4315,17.5685,88,18.2698,88h59.6825 c0.7013,0,1.2698-0.5685,1.2698-1.2698V26.2643c0-0.7858-0.3122-1.5395-0.8678-2.0951L63.053,8.8678 C62.4974,8.3122,61.7437,8,60.9579,8z"/> 	<path fill="#979593" d="M79.1211,24.707L61.293,6.8789C60.7266,6.312,59.9736,6,59.1719,6H19c-1.6543,0-3,1.3457-3,3v78 c0,1.6543,1.3457,3,3,3h58c1.6543,0,3-1.3457,3-3V26.8281C80,26.0273,79.6875,25.2739,79.1211,24.707z M60,8.4141L77.5857,26H61 c-0.5518,0-1-0.4482-1-1V8.4141z M77,88H19c-0.5518,0-1-0.4482-1-1V9c0-0.5518,0.4482-1,1-1h39v17c0,1.6543,1.3457,3,3,3h17v59 C78,87.5518,77.5518,88,77,88z"/> </svg> </img>'
    }

    /** */
    function camelCaseToSentence(camelCaseText) {
        // Split the camel case text into an array of words
        const words = camelCaseText.split(/(?=[A-Z])/);

        // Capitalize the first word and convert the remaining words to lowercase
        const sentence = words
            .map((word, index) => {
                if (index === 0) {
                    // Capitalize the first word
                    return word.charAt(0).toUpperCase() + word.slice(1);
                } else {
                    // Convert the remaining words to lowercase
                    return word.toLowerCase();
                }
            })
            .join(' ');

        return sentence;
    }

    /** */
    function getMapSection() {
        return '<section class="map row justify-content-center">        <div class="' + BREAKPOINTS + '">          <!--  -->          <div class="card">            <div class="card-header fadedText">              <b>Map</b>            </div>            <div class="card-body">              <div class="img-part" style="height: 500px">                <div id="' + MAP_ID + '" style="height: 100%"></div>              </div>            </div>          </div>        </div>      </section>'
    }

    /** */
    function Map(nestedCoordinates, markers) {

        // eslint-disable-next-line no-undef
        const map = new google.maps.Map(document.getElementById(MAP_ID), {
            mapTypeId: 'satellite',
        });


        let canSetBounds = true;

        for (const coordinates of nestedCoordinates) {
            setPolygonForCoordinates(map, coordinates, canSetBounds);
            canSetBounds = false;
        }

        for (const marker of markers) {
            setMarker(map, marker)
        }

        /** */
        function setPolygonForCoordinates(map, coordinates, canSetBounds) {

            // get first coordinate
            const [first] = coordinates;

            // eslint-disable-next-line no-undef
            const polygons = new google.maps.Polygon({
                path: coordinates,
                geodesic: true,
                fillColor: first.fillColor,
                strokeColor: first.strokeColor,
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillOpacity: 0.4
            });

            polygons.setMap(map);

            // Create a new LatLngBounds object to encapsulate the polygon
            // eslint-disable-next-line no-undef
            const bounds = new google.maps.LatLngBounds();


            if (canSetBounds) {
                // Set the center of the map to the center of the polygon
                for (const coordinate of coordinates) {
                    bounds.extend(coordinate);
                }

                map.fitBounds(bounds);
            }
        }

        /** */
        function setMarker(map, marker) {
            // eslint-disable-next-line no-undef
            new google.maps.Marker({
                position: marker,
                map: map,

            });
        }

        /** */
        function getRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    }


}