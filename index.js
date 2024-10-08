const data = {
    chats: [
        {
            name: 'Дженнифер Эшли', time: '15:52',
            text: 'Ты куда пропал?', state: 'new', count: 99,
            image: '/components/chat_images/1.png'
        },
        {
            name: 'Общество целых бокалов', time: '15:52',
            text: 'Ребят, без меня сегодня:(', state: 'unread',
            image: '/components/chat_images/2.png'
        },
        {
            name: 'Антон Иванов', time: '15:52',
            text: 'Тоха, ты где ?', state: 'unread',
            image: '/components/chat_images/3.png'
        },
        {
            name: 'Серёга(должен 2000₽)', time: '15:52',
            text: 'Серёг, это Петя. Где бабло моё?', state: 'read',
            image: '/components/chat_images/4.png'
        },
        {
            name: 'Общество разбитых бокалов', time: '15:52',
            text: 'Петька, ты с нами сегодня?', state: 'mention', count: 99,
            image: '/components/chat_images/5.png'
        },
        {
            name: 'Сэм с Нижнего',
            time: '15:52',
            image_attachment_alt: 'img_12-12-09',
            state: 'read',
            image: '/components/chat_images/6.png'
        },
        {
            name: 'Айрат работа',
            text: 'Айрат, во сколько приедешь?',
            time: '15:52',
            state: 'read',
            image: '/components/chat_images/7.png'
        },
        {
            name: 'Кеша армия',
            text: 'Кеш, задолбал тупить',
            time: '15:52',
            state: 'unread',
            image: '/components/chat_images/8.png'
        },
    ]
}

const chatsElement = document.getElementById('chats');

for (const chat of data.chats) {
    chatsElement.innerHTML += Chat(chat)
}
