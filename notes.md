docker issue:
- chromium wasn't being installed using playwright
- switched the puppeteer and faced the same issue
- the browser executable was missing from the final docker image
- i installed the chrome in the final docker image layer and the executable was found!