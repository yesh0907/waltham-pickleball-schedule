docker issue:
- chromium wasn't being installed using playwright
- switched the puppeteer and faced the same issue
- the browser executable was missing from the final docker image
- i installed the chrome in the final docker image layer and the executable was found!
- turns out only the final layer/stage in the docker file will be written to docker image. that is why chromium was not found when I was installing using playwright. I was trying to install it in a stage that was not part of the final docker image