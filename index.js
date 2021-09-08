const TelegramBot = require("node-telegram-bot-api");
const token = "1999760365:AAEAvbattbKWhKZtGtbTbIQswaTHWAHmKWA";
const cron = require("node-cron");
const json = require("./classes.json");
const bot = new TelegramBot(token, { polling: true });

function week() {
  const date = new Date().getDate();
  const thisWeek = Math.ceil(date / 7);
  if (thisWeek % 2 === 0 || thisWeek % 2 === 1) {
    return true;
  } else {
    return false;
  }
}

function dayOfWeek() {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  let n = new Date().getDay();
  return days[n];
}

function getClassesToday() {
  const day = dayOfWeek();
  return json[day];
}

function isLessonGoingToday(lesson) {
  if (lesson["неделя"] == "всегда" || lesson["неделя"] == "чет") {
    return true;
  } else {
    return false;
  }
}

function classesMessage() {
  const classesToday = getClassesToday().filter(
    (el) => isLessonGoingToday(el) == week()
  );
  let message =
    "Расписание на сегодня:\n" +
    classesToday.map((el) => {
      return `\tПредмет: ${el["пара"]}\n\tВремя: ${el["время"]}\n\tПеподаватель: ${el["преподаватель"]}\n\tКабинет: ${el["кабинет"]}\n\tТип: ${el["тип"]}\n\n`;
    });
  return message;
}

const chatIdArr = [];

bot.on("message", (msg) => {
  if (!chatIdArr.includes(msg.chat.id)) {
    chatIdArr.push(msg.chat.id);
  }
});

cron.schedule("53 12 * * *", () => {
  chatIdArr.map((chatId) => bot.sendMessage(chatId, classesMessage()));
});
