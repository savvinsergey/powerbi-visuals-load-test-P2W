/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

// External
/// <reference path="./../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="./../node_modules/@types/jasmine-jquery/index.d.ts" />

let config = require('../configuration/embedded-reports-urls.config.json');

const defaultElement = "div.visual";

async function awaitElements(
    elements: any,
    existTimeout: number): Promise<any>  {
    if (elements && elements.length) {
        await elements.forEach(async element => {
            if (element && element.await) {
                try {
                    await browser.waitForExist(
                        element.await || defaultElement,
                        existTimeout
                    );
                } catch(err) {
                    throw new Error(err);
                }
            }
        });
    }
}

async function handleClicks(elements: any): Promise<any>  {
    if (elements && elements.length) {
        await elements.forEach(async element => {
            if (element && element.click) {
                try {
                    let clickEl: WebdriverIO.Element[] =
                        (await browser.elements(element.click)).value;

                    await browser
                        .elementIdClick(clickEl[2].ELEMENT);
                } catch(err) {
                    throw new Error(err);
                }
            }
        });
    }
}

describe("Load test", () => {
    config.forEach(item => {
        it(item.name || "Name wasn't specified", (done) => {
            const isUrl = /^https\:\/\/(powerbidogfood)\.(powerbi|analysis-df\.windows)\.(com|net)\/view/.test(item.url);

            expect(isUrl).toBe(true);

            browser
                .timeouts("script", 60000)
                .timeouts("implicit", 60000)
                .timeouts("page load", 60000);

            const elements: any = item.elements || null;

            let urlPromise: any = browser.url(item.url);
            (async () => {
                try {
                    await urlPromise;
                    await awaitElements(elements, item.existTimeout);
                    await handleClicks(elements);

                    done();
                } catch(err) {
                    console.error(err);
                }
            })();
        });
    });
});

