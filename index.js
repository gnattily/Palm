const perspective = require('./perspective');

(async function() {
    console.log( await perspective.getScores("im going to kill you!", ["TOXICITY", "PROFANITY"]) )
})();