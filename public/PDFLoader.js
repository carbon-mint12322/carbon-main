
/**
 * getPdfLoader is function to setup a instance of PDFLoader wrapper.
 * It expects a config input and returns a instance with the config setup, 
 * so that we can reuse with different urls each time.
 * 
 * 
 * @param {Object} config - Config to setup a instance of PdfLoader
 * @param {string} config.canvasId - Id of the canvas element 
 * @param {string} config.pageNumId - Id of the html element to show page number
 * @param {string} config.prevButtonId - Id of the html element to register for going to previous page
 * @param {string} config.nextButtonId - Id of the html element to register for going to next page
 * @param {string} config.pageCountId - Id of the html element to display the total pages in the PDF
 * 
 */
function getPdfLoader({ canvasId, pageNumId, prevButtonId, nextButtonId, pageCountId }) {

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
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 0.8,
            canvas = document.getElementById(canvasId),
            ctx = canvas.getContext('2d');

        /**
        * Get page info from document, resize canvas accordingly, and render page.
        * @param num Page number.
        */
        function renderPage(num) {
            pageRendering = true;
            // Using promise to fetch the page
            pdfDoc.getPage(num).then(function (page) {
                let viewport = page.getViewport({
                    scale: scale
                });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                let renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function () {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        // New page rendering is pending
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            // Update page counters
            document.getElementById(pageNumId).textContent = num;
        }

        /**
        * If another page rendering in progress, waits until the rendering is
        * finised. Otherwise, executes rendering immediately.
        */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        /**
        * Displays previous page.
        */
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        }
        document.getElementById(prevButtonId).addEventListener('click', onPrevPage);

        /**
        * Displays next page.
        */
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }
        document.getElementById(nextButtonId).addEventListener('click', onNextPage);

        /**
        * Asynchronously downloads PDF.
        */
        pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.getElementById(pageCountId).textContent = pdfDoc.numPages;

            // Initial/first page rendering
            renderPage(pageNum);
        });


    }

    return PDFLoader;
}