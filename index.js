require('dotenv').config()
const axios = require('axios').default;

/**
 * 
 * @param {string} message - The message to analyze
 * @param {array} attributes - What to analyze the message for
 * @returns {object} The attributes requested and their scores
 */
async function getScores (message, attributes) {
    try {
        const raw = await axios.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_KEY}`, {
    	    "comment": {
	        	"text": message,
	        },
    	    "languages": ["en"],
	        "requestedAttributes": formatAttributes(attributes),
            }, { "Content-Type": 'application/json' }
        );

        console.log(raw.data)

    } catch (error) {
        console.log(error);
    }
}

function formatAttributes (attributes) {
    let formattedAttributes = {}

    attributes.forEach((attribute) => {
        formattedAttributes[attribute] = {}
    })

    return formattedAttributes;
}

getScores("im going to kill you!", ["TOXICITY"])