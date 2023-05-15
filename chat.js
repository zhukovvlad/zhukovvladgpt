const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatText = "What version of chatGPT AI engine do you use?"

const func = async () => {
	const response = await openai.createImage({
		prompt: "John Lennon playing heavy metal on the Red Square in Moscow",
		n: 2,
		size: "1024x1024",
	  });

  console.log(response.data)

//   console.log(response.data.choices[0].message);

  return response;
};

func();
