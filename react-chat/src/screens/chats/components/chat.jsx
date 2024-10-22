import './chat.css'


function Chat({name,text,image_attachment_alt,time,state,image,count,switchScreenTo}){
    let badge=null
    switch (state) {
        case 'new':
            badge=<div className="badge new">{count}</div>
            break;
        case 'unread':
            badge=<span className="badge unread material-symbols-outlined">done_all</span>
            break;
        case 'read':
            badge=<span className="badge read material-symbols-outlined">check</span>
            break;
        case 'mention':
            badge=<div className="badge mention">{count}</div>
    }
    if(image_attachment_alt!==undefined)
        text=<><span className="material-symbols-outlined" style={{color: '#50b052'}}>photo_camera</span> {image_attachment_alt}</>
    return <>
        <a className="chat" onClick={(e)=> {
            switchScreenTo('chat')
            e.preventDefault()
        }}>
            <img src={image} alt="avatar"/>
            <div className="body">
                <div className="top">
                    <div className="name">{name}</div>
                    <div className="time">{time}</div>
                </div>
                <div className="bottom">
                    <div className="text">{text}</div>
                    {badge}
                </div>
            </div>
        </a>
    </>
}

export default Chat