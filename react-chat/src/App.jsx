import './App.css'
import {useState} from "react";
import Chats from "screens/chats/chats.jsx";
import Chat from "screens/chat/chat.jsx";

function App() {
    const [CurrentScreen, setCurrentScreen] = useState(()=>Chats)
    const switchScreenTo=(screen)=> {
        switch (screen) {
            case 'chats':
                setCurrentScreen(()=>Chats)
                break
            case 'chat':
                setCurrentScreen(()=>Chat)
                break
            default:
                throw Error(`Wrong screen ${screen}`)
        }
    }
    return (
        <>
            <CurrentScreen {...{switchScreenTo}} />
        </>
    )
}

export default App
