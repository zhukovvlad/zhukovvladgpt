const { Telegraf } = require("telegraf");
const chatWithOpenAi = require("./chatOpenAi");

const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands([
  {
    command: "test",
    description: "Test command",
  },
  {
    command: "greetings",
    description: "Greetings command",
  },
  {
    command: "chat",
    description: "Chat with chatGPT command",
  },
  {
    command: "clear",
    description: "Clear message history command",
  },
  {
    command: "stop",
    description: "Stop chat with chatGPT command",
  },
]);

let stopEaring = false;
const messages = [];

bot.command("test", (ctx) => {
  ctx.reply("Tests are beautiful");
});

bot.command("stop", (ctx) => {
  stopEaring = true;
  ctx.reply("Ooops, we have stopped");
});

bot.command("clear", (ctx) => {
	messages.length = 0;
	ctx.reply("We have cleared the History")
})

bot.start((ctx) => {
  ctx.reply("Welcome to the OpenAI bot! Please enter your request.");
});

// bot.on("message", async (ctx) => {
//   const userText = ctx.message.text;
//   console.log(ctx.telegram);
//   await ctx.reply(`Our message is ${userText}`);
// });

bot.command("chat", (ctx) => {
  stopEaring = false;
  //   console.log(ctx);
  ctx.reply("So let's have a fun!");
  bot.on("message", async (ctx) => {
	console.log(messages)
    if (stopEaring) {
      ctx.reply("Use command in menu");
    } else {
      console.log(stopEaring);
      const user_input = ctx.message.text;
      console.log(`Message is ${user_input}`);
      const result = await chatWithOpenAi(user_input, messages);
      ctx.reply(result);
    }
  });
});

bot.command("complete", async (ctx) => {
  try {
    const user_input = ctx.message.text;
    console.log(user_input);
    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/completions",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "text-davinci-003",
        prompt: `${user_input}`,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      },
    });
    const bot_response = response.data.choices[0].text;
    ctx.reply(bot_response);
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

bot.launch();
