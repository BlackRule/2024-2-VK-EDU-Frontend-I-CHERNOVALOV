import 'screens/screen.css'
import 'components/topbar.css'
import './chats.css'
import './components/compose.css'
import Chat from "./components/chat.jsx";
import Screen from "screens/Screen.jsx";

function Chats({switchScreenTo}) {
    const data = {
        chats: [
            {
                id: 1,
                name: 'Дженнифер Эшли', time: '15:52',
                text: 'Ты куда пропал?', state: 'new', count: 99,
                image: 'chat_images/1.png'
            },
            {
                id: 2,
                name: 'Общество целых бокалов', time: '15:52',
                text: 'Ребят, без меня сегодня:(', state: 'unread',
                image: 'chat_images/2.png'
            },
            {
                id: 3,
                name: 'Антон Иванов', time: '15:52',
                text: 'Тоха, ты где ?', state: 'unread',
                image: 'chat_images/3.png'
            },
            {
                id: 4,
                name: 'Серёга(должен 2000₽)', time: '15:52',
                text: 'Серёг, это Петя. Где бабло моё?', state: 'read',
                image: 'chat_images/4.png'
            },
            {
                id: 5,
                name: 'Общество разбитых бокалов', time: '15:52',
                text: 'Петька, ты с нами сегодня?', state: 'mention', count: 99,
                image: 'chat_images/5.png'
            },
            {
                id: 6,
                name: 'Сэм с Нижнего',
                time: '15:52',
                image_attachment_alt: 'img_12-12-09',
                state: 'read',
                image: 'chat_images/6.png'
            },
            {
                id: 7,
                name: 'Айрат работа',
                text: 'Айрат, во сколько приедешь?',
                time: '15:52',
                state: 'read',
                image: 'chat_images/7.png'
            },
            {
                id: 8,
                name: 'Кеша армия',
                text: 'Кеш, задолбал тупить',
                time: '15:52',
                state: 'unread',
                image: 'chat_images/8.png'
            },
        ]
    }

    return (
            <Screen>
                <div className="topbar">
                    <span className="material-symbols-outlined">menu</span>
                    <span className="title">Messenger</span>
                    <span className="material-symbols-outlined">search</span>
                </div>
                <div id="chats">
                    {
                        data.chats.map((chat) =>
                            <Chat key={chat.id} {...chat} id={undefined} {...{switchScreenTo}}/>)
                    }
                </div>
                <span className="material-symbols-outlined compose">edit</span>
            </Screen>
    )
}

export default Chats
