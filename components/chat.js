function Chat({name,text,image_attachment_alt,time,state,image,count}){
    let badge=''
    switch (state) {
        case 'new':
            badge=`<div class="badge new">${count}</div>`
            break;
        case 'unread':
            badge=`<span class="badge unread material-symbols-outlined">done_all</span>`
            break;
        case 'read':
            badge=`<span class="badge read material-symbols-outlined">check</span>`
            break;
        case 'mention':
            badge=`<div class="badge mention">${count}</div>`
    }
    if(image_attachment_alt!==undefined)
        text=`<span class="material-symbols-outlined" style="color: #50b052">photo_camera</span> ${image_attachment_alt}`
    return `
<a class="chat" href="/screens/chat.html">
    <img src="${image}" alt="avatar">
    <div class="body">
        <div class="top">
            <div class="name">${name}</div>
            <div class="time">${time}</div>
        </div>
        <div class="bottom">
            <div class="text">${text}</div>
            ${badge}
        </div>
    </div>
</a>
`
}