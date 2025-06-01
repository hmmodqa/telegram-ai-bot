const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// قراءة التوكنات من المتغيرات البيئية
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// إنشاء البوت
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// استقبال الرسائل
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "أنت مساعد ذكي متخصص في شرح أكواد أعطال السيارات (OBD-II) باللغة العربية. ركز على سيارات فورد، كراون فكتوريا، وجراند ماركيز، واشرح الكود بوضوح واحترافية."
          },
          {
            role: "user",
            content: `اشرح الكود التالي أو السؤال: ${userText}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "لم أفهم الكود.";
    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(chatId, "حدث خطأ أثناء الاتصال بالذكاء الصناعي. تأكد من الإعدادات أو حاول لاحقًا.");
  }
});
