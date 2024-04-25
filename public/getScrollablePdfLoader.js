
/**
 * getPdfLoader is function to setup a instance of PDFLoader wrapper.
 * It expects a config input and returns a instance with the config setup, 
 * so that we can reuse with different urls each time.
 * 
 * 
 * @param {Object} config - Config to setup a instance of PdfLoader
 * @param {string} config.contentHolderId - A html block level element, where the pages are going to be loaded
 * 
 */
function getScrollablePdfLoader({ contentHolderId }) {

    /**
     * PDFLoader is a wrapper function around mozilla's PDf.js library (https://github.com/mozilla/pdf.js)
     * @constructor
     * 
     * @param {string} url - Url of the pdf to load
     */
    function PDFLoader(url) {

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        let pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        let pdfDoc = null,
            scale = 1;

        /**
        * Get page info from document, resize canvas accordingly, and render page.
        * @param num Page number.
        */
        async function renderPage(num) {

            // Using promise to fetch the page
            return pdfDoc
                .getPage(num)
                .then(function (page) {

                    const newCanvasId = 'pdf-viewer-' + num;

                    // jQuery is expected be loaded before calling this function
                    // eslint-disable-next-line no-undef 
                    $('#' + contentHolderId).append('<canvas id="' + newCanvasId + '"></canvas>');

                    // getting canvas
                    const canvas = document.getElementById(newCanvasId);

                    let viewport = page.getViewport({
                        scale: scale
                    });

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    const renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: viewport
                    };

                    let renderTask = page.render(renderContext);

                    return renderTask.promise;
                });

        }

        /**
         * Renders all the pdf pages into html canvas element
         */
        async function renderAllPages() {
            for (var i = 1; i <= pdfDoc.numPages; i++) {
                await renderPage(i);
            }
        }

        /**
        * Asynchronously downloads PDF.
        */
        pdfjsLib
            .getDocument(url)
            .promise
            .then(async function (pdfDoc_) {
                pdfDoc = pdfDoc_;

                // Clear the existing content holder
                // eslint-disable-next-line no-undef
                $("#" + contentHolderId).empty();

                // Initiate page rendering
                return renderAllPages();
            })
            // eslint-disable-next-line no-console
            .then(() => console.log("PDF loaded."));


    }

    return PDFLoader;
}