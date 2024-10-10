const default_data = [
    {
        name: "Дженнифер",
        text: "Я тут кое-что нарисовала...\nПосмотри как будет время...",
        time: "10:53"
    },
    {
        name: "Иван",
        text: "Горжусь тобой! Ты крутая!",
        time: "10:53"
    },
    {
        name: "Дженнифер",
        text: "Тебе нравится как я нарисовала?",
        time: "10:53"
    },
    {
        name: "Иван",
        text: "Джен, ты молодеееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееец!",
        time: "10:53"
    },

]
const textarea = document.querySelector('.form-input');
const messages = document.querySelector('.messages');
const messagesScroll = document.querySelector('.messages-scroll');

function addMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (message.name === 'Иван') {
        messageDiv.classList.add('my');
    }

    const topDiv = document.createElement('div');
    topDiv.classList.add('top');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.textContent = message.name;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time');
    timeDiv.textContent = message.time;

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = message.text;

    topDiv.appendChild(nameDiv);
    topDiv.appendChild(timeDiv);
    messageDiv.appendChild(topDiv);
    messageDiv.appendChild(text);

    messages.appendChild(messageDiv);

    messagesScroll.scrollTop = messagesScroll.scrollHeight;
}

function sendMessage() {
    let date = new Date();
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    let text = textarea.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let message = {name: "Иван", time: `${hours}:${minutes}`, text: text};
    addMessage(message);
    data.push(message);
    textarea.value = '';
    textarea.dispatchEvent(new Event('input', {
        bubbles: true
    }));
}

function autosize(textarea, row_limit, onAfterResize = function () {
}) {
    // Set default for row_limit parameter
    row_limit = parseInt(row_limit ?? '5');
    if (!row_limit) {
        row_limit = 5;
    }

    // Set required styles for this to function properly.
    textarea.style.setProperty('resize', 'none');
    textarea.style.setProperty('min-height', '0');
    textarea.style.setProperty('max-height', 'none');
    textarea.style.setProperty('height', 'auto');

    // Set rows attribute to number of lines in content
    textarea.addEventListener('input', () => {

        // Reset rows attribute to get accurate scrollHeight
        textarea.setAttribute('rows', '1');

        // Get the computed values object reference
        const cs = getComputedStyle(textarea);

        // Force content-box for size accurate line-height calculation
        // Remove scrollbars, lock width (subtract inline padding and inline border widths)
        // and remove inline padding and borders to keep width consistent (for text wrapping accuracy)
        const inline_padding = parseFloat(cs['padding-left']) + parseFloat(cs['padding-right']);
        const inline_border_width = parseFloat(cs['border-left-width']) + parseFloat(cs['border-right-width']);
        textarea.style.setProperty('overflow', 'hidden', 'important');
        textarea.style.setProperty('width', (parseFloat(cs['width']) - inline_padding - inline_border_width) + 'px');
        textarea.style.setProperty('box-sizing', 'content-box');
        textarea.style.setProperty('padding-inline', '0');
        textarea.style.setProperty('border-width', '0');

        // Get the base line height, and top / bottom padding.
        const block_padding = parseFloat(cs['padding-top']) + parseFloat(cs['padding-bottom']);
        const line_height =
            // If line-height is not explicitly set, use the computed height value (ignore padding due to content-box)
            cs['line-height'] === 'normal' ? parseFloat(cs['height'])
                // Otherwise (line-height is explicitly set), use the computed line-height value.
                : parseFloat(cs['line-height']);

        // Get the scroll height (rounding to be safe to ensure cross browser consistency)
        const scroll_height = Math.round(textarea.scrollHeight);

        // Undo overflow, width, border-width, box-sizing & inline padding overrides
        textarea.style.removeProperty('width');
        textarea.style.removeProperty('box-sizing');
        textarea.style.removeProperty('padding-inline');
        textarea.style.removeProperty('border-width');
        textarea.style.removeProperty('overflow');

        // Subtract block_padding from scroll_height and divide that by our line_height to get the row count.
        // Round to nearest integer as it will always be within ~.1 of the correct whole number.
        const rows = Math.round((scroll_height - block_padding) / line_height);

        // Set the calculated rows attribute (limited by row_limit)
        textarea.setAttribute("rows", "" + Math.min(rows, row_limit));
        onAfterResize()
    });

    // Trigger the event to set the initial rows value
    textarea.dispatchEvent(new Event('input', {
        bubbles: true
    }));
}

if (localStorage.getItem('messages') === null) {
    localStorage.setItem('messages', JSON.stringify(default_data));
}

const data = JSON.parse(localStorage.getItem('messages'));

for (const message of data) {
    addMessage(message)
}

textarea.addEventListener('keypress', (e) => {
    if (
        e.key !== 'Enter' ||
        e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return;
    e.preventDefault();
    if (e.target.value.trim().length === 0) return;
    sendMessage();
});

document.getElementById('send').addEventListener('click', sendMessage);

addEventListener('unload', () => localStorage.setItem('messages', JSON.stringify(data)))

autosize(textarea, 10, () => messagesScroll.scrollTop = messagesScroll.scrollHeight)