const sarvamEngToMalTranslation = async (input) => {
	try {
        const translateText = async (text) => {
			const payload = {
				input: `${text}`,
				source_language_code: "en-IN",
				target_language_code: "ml-IN",
				mode: "formal"
			};
			return callSarvamAPI(payload);
		};

		const translatedText = await translateText(input);  // Use await here
		return translatedText;

	} catch (error) {
		console.error("Error in Translation:", error);
		throw error;  // Make sure to throw the error so the caller knows
	}
}

const callSarvamAPI = async (payload) => {
	try {
		const response = await fetch('https://api.sarvam.ai/translate', {
			method: 'POST',
			headers: {
			  'api-subscription-key': `${process.env.SARVAM_API_KEY}`,
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		const translatedText = data.translated_text;
	
		return translatedText;
	} catch (error) {
		console.error("Sarvam Error", error);
		throw error; 
	}
}

module.exports = { sarvamEngToMalTranslation }
