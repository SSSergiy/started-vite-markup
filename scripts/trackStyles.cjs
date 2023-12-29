const CDP = require('chrome-remote-interface');

async function trackStyles() {
  try {
    // Устанавливаем соединение с браузером
    const client = await CDP({ port: 9222 });
    const { CSS } = client;
    console.log(CSS.styleSheetChanged.parameters.styleSheetId)

    // CSS.styleSheetAdded((event) => {
    //   const styleSheetId = event.header.styleSheetId;
    //   console.log(`Додано новий стиль. styleSheetId: ${styleSheetId}`);
    // });
    // ... (остальной код)
    CSS.styleSheetChanged((event) => {
      const styleSheetId = event.styleSheetId;
      console.log(`Змінений стиль. styleSheetId: ${styleSheetId}`);
    });
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

// Запускаем отслеживание стилей
trackStyles();




// async function run() {
//   // Подключение к браузеру
//   const client = await CDP();

//   // Открытие новой вкладки
//   const { Network, Page,CSS } = client;
//   await Promise.all([Network.enable(), Page.enable()]);

//   // Навигация по URL



//   // Обробка зміненого стилю

//   // Ожидание события загрузки страницы
//   await Page.loadEventFired();

//   // Получение содержимого страницы
//   const { data } = await Page.printToPDF();
//   console.log('Содержимое страницы в формате PDF:', data);

//   // Закрытие соединения с браузером
//   client.close();
// }

// // Запуск сценария
// run();
