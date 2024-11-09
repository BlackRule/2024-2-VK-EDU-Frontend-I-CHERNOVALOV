import {SwitchScreenTo} from '~/types.ts'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.jsx'
import Chat from './components/Chat.tsx'
import styles from './Chats.module.scss'
import ScreenBottom from "screens/ScreenBottom/ScreenBottom.tsx";

function Chats({switchScreenTo}:{switchScreenTo:SwitchScreenTo}) {
  const data = {
    chats: [
      {
        count: 99,
        id: 1, image: 'chat_images/1.png',
        name: 'Дженнифер Эшли', state: 'new', text: 'Ты куда пропал?',
        time: '15:52'
      },
      {
        id: 2,
        image: 'chat_images/2.png', name: 'Общество целых бокалов',
        state: 'unread', text: 'Ребят, без меня сегодня:(',
        time: '15:52'
      },
      {
        id: 3,
        image: 'chat_images/3.png', name: 'Антон Иванов',
        state: 'unread', text: 'Тоха, ты где ?',
        time: '15:52'
      },
      {
        id: 4,
        image: 'chat_images/4.png', name: 'Серёга(должен 2000₽)',
        state: 'read', text: 'Серёг, это Петя. Где бабло моё?',
        time: '15:52'
      },
      {
        count: 99,
        id: 5, image: 'chat_images/5.png',
        name: 'Общество разбитых бокалов', state: 'mention', text: 'Петька, ты с нами сегодня?',
        time: '15:52'
      },
      {
        id: 6,
        image: 'chat_images/6.png',
        image_attachment_alt: 'img_12-12-09',
        name: 'Сэм с Нижнего',
        state: 'read',
        time: '15:52'
      },
      {
        id: 7,
        image: 'chat_images/7.png',
        name: 'Айрат работа',
        state: 'read',
        text: 'Айрат, во сколько приедешь?',
        time: '15:52'
      },
      {
        id: 8,
        image: 'chat_images/8.png',
        name: 'Кеша армия',
        state: 'unread',
        text: 'Кеш, задолбал тупить',
        time: '15:52'
      },
    ]
  }

  return (
    <Screen>
      <Topbar>
        <MaterialSymbol symbol='menu'/>
        <span className={styles.title}>Messenger</span>
        <MaterialSymbol symbol='search'/>
      </Topbar>
      <ScreenBottom>
        <div className={styles.chats}>
          {
            data.chats.map((chat) =>
              <Chat key={chat.id} {...chat} id={chat.id} {...{switchScreenTo}}/>)
          }
        </div>
        <MaterialSymbol symbol='edit' className={styles.compose} hoverable={false}/>
      </ScreenBottom>
    </Screen>
  )
}

export default Chats
