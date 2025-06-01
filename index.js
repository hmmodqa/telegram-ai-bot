
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// بيئة العمل: قراءة التوكن من متغيرات البيئة
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// إنشاء البوت
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// استقبال أي رسالة
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  // إذا المستخدم أرسل كود مثل P0171 أو P0300 أو حتى كلام بالعربي
  if (userText) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "openrouter/mistral",
          messages: [
            {
              role: "system",
              content: "أنت مساعد ذكي متخصص في شرح أكواد أعطال السيارات (OBD-II) بلغة عربية سهلة، خاصة لسيارات فورد، كراون فكتوريا، وجراند ماركيز."
            },
            {
              role: "user",
              content: `اشرح الكود أو الرسالة التالية: ${userText}`
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

      const reply = response.data.choices[0].message.content;
      bot.sendMessage(chatId, reply);

    } catch (error) {
      console.error(error.response?.data || error.message);
      bot.sendMessage(chatId, "حدث خطأ أثناء التواصل مع الذكاء الصناعي. تأكد من المفاتيح أو حاول لاحقًا.");
    }
  }
});
