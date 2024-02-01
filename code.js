const { Telegraf } = require('telegraf');

const token = '6707629996:AAE6bWyDTMdlxI7EmwnzA9Py-eZ2qBaskkg'
const adminId = '1881638682'
const channelId = '-1002061287991';

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('Привет! Отправьте мне ваше предложение.'));

bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;

    const forwardedMsg = await ctx.telegram.forwardMessage(adminId, ctx.message.chat.id, ctx.message.message_id);

    const adminKeyboard = {
        inline_keyboard: [
            [{ text: 'Принять', callback_data: `accept_${forwardedMsg.message_id}` }],
            [{ text: 'Отклонить', callback_data: `reject_${forwardedMsg.message_id}` }],
        ],
    };

    const userNotification = 'Ваше предложение отправлено на рассмотрение администратору✅';
    await ctx.telegram.sendMessage(ctx.message.chat.id, userNotification);

    await ctx.telegram.sendMessage(adminId, `\n${userMessage}`, { reply_markup: adminKeyboard });
});

bot.action(/accept_/, async (ctx) => {
    const messageId = ctx.callbackQuery.message.message_id;
    ctx.answerCbQuery('Предложение принято');
    await ctx.telegram.sendMessage(channelId, `\n${ctx.callbackQuery.message.text}`);
    await ctx.telegram.editMessageReplyMarkup(adminId, messageId, null);
});

bot.action(/reject_/, async (ctx) => {
    const messageId = ctx.callbackQuery.message.message_id;
    ctx.answerCbQuery('Предложение отклонено');
    await ctx.telegram.editMessageReplyMarkup(adminId, messageId, null);
});

bot.launch();