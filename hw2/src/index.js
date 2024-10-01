const default_data = [
    {
        name: "Дженнифер",
        text: "Я тут кое-что нарисовала... Посмотри как будет время...",
        time: "10:53"
    },
    {
        name: "Дженнифер",
        text: "Тебе нравится как я нарисовала?",
        time: "10:53"
    },
    {
        name: "Иван",
        text: "Горжусь тобой! Ты крутая!",
        time: "10:53"
    },
    {
        name: "Иван",
        text: "Джен, ты молодец!",
        time: "10:53"
    },

]
const input = document.querySelector('.form-input');
const messages = document.querySelector('.messages');

function addMessage(message) {
    messages.innerHTML += `
<div class="message">
  <div class="top">
    <div class="name">${message.name}</div>
    <div class="time">${message.time}</div>
  </div>
    <div class="text">${message.text}</div>
</div>
`
}

if (localStorage.getItem('messages') === null) {
    localStorage.setItem('messages', JSON.stringify(default_data));
}

const data = JSON.parse(localStorage.getItem('messages'));

for (const message of data) {
    addMessage(message)
}

input.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        let date = new Date();
        const hours = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        let message = {name: "Иван", time: `${hours}:${minutes}`, text: e.target.value};
        addMessage(message);
        data.push(message);
        localStorage.setItem('messages', JSON.stringify(data));
        e.target.value = '';
    }
});