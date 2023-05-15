const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const chatWithOpenAi = async (msg, msgArray) => {
  msgArray.push({ role: "user", content: `${msg}` });
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: msgArray,
  });

  console.log(`Our Response is ${completion.data.choices[0].message.content}`);
  msgArray.push({
    role: "assistant",
    content: completion.data.choices[0].message.content,
  });
  console.log(msgArray);
  // console.log(completion.data.choices[0].message);
  return completion.data.choices[0].message.content;
};

module.exports = chatWithOpenAi;
