exports.config = {
    specs: [
        "build/**"
    ],

    capabilities: [{
        browserName: "chrome",
        chromeOptions: {
            args: ['--disable-extensions']
        }
    }],

    loglevel: "command",
    coloredLogs: true,
    waitforTimeout: 20000,

    framework: "jasmine",
    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000
    }
};
