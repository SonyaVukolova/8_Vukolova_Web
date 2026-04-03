const dataStore = {
    ideas: [
        { id: 1, title: "Набор для рисования", price: "2300 ₽" },
        { id: 2, title: "Поход в театр", price: "10000 ₽" },
        { id: 3, title: "Новый телефон", price: "89000₽" },
        { id: 4, title: "Новая кофта", price: "4500 ₽" },
        { id: 5, title: "Пакет сладостей", price: "3000 ₽" },
        { id: 6, title: "Сертификат в спа", price: "8000 ₽" },
        { id: 7, title: "Чайный сервиз", price: "15300 ₽" },
        { id: 8, title: "Косметика", price: "10000 ₽" },
        { id: 9, title: "Женская сумочка", price: "5000 ₽" },
        { id: 10, title: "Золотое кольцо", price: "18000 ₽" }
    ],
    friends: [
        { name: "София", action: "Добавила в список духи" },
        { name: "Артем", action: "Купил другу приставку" },
        { name: "Витя", action: "Мечтает о мотоцикле" },
        { name: "Даша", action: "Хочет новый телефон" },
        { name: "Таня", action: "Заказала картину по номерам" },
        { name: "Юля", action: "Добавила в список коллекционную куклу" }, 
        { name: "Вика", action: "Хочет целый том книг" },
        { name: "Диана", action: "Мечтает о новом штативе" }
    ]
};

function router(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');

    if (sectionId === 'ideas') apiRequest('ideas', renderIdeas);
    if (sectionId === 'my-list') renderMyWishes();
    if (sectionId === 'friends') apiRequest('friends', renderFriends);
}

function apiRequest(key, callback) {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden'); 

    setTimeout(() => {
        loader.classList.add('hidden'); 
        callback(dataStore[key]);}, 700); 
}

function renderIdeas(data) {
    const list = document.getElementById('ideas-list');
    list.innerHTML = data.map(item => `
        <li><article class="card"><h3>${item.title}</h3><p>${item.price}</p></article></li>`).join('');
}

function renderFriends(data) {
    const list = document.getElementById('friends-list');
    list.innerHTML = data.map(f => `
        <li><article class="card"><h3>👤 ${f.name}</h3><p>${f.action}</p></article></li>`).join('');
}

let myWishes = JSON.parse(localStorage.getItem('my_wishes')) || [];

function renderMyWishes() {
    const container = document.getElementById('wish-list-container');
    container.innerHTML = myWishes.map((w, idx) => `
        <li>
            <article class="card ${w.completed ? 'completed' : ''}">
                <h3>${w.title}</h3>
                <button onclick="handleApiAction('PUT', ${idx})">✔</button>
                <button onclick="handleApiAction('DELETE', ${idx})" style="background:#bbb">🗑</button>
            </article>
        </li>
    `).join('');
    localStorage.setItem('my_wishes', JSON.stringify(myWishes));
}

document.getElementById('wish-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('new-wish');
    handleApiAction('POST', input.value);
    input.value = '';
};

function handleApiAction(method, payload) {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    setTimeout(() => {
        loader.classList.add('hidden');
        
        if(method === 'POST') myWishes.push({ title: payload, completed: false });
        if(method === 'DELETE') myWishes.splice(payload, 1);
        if(method === 'PUT') myWishes[payload].completed = !myWishes[payload].completed;
        
        renderMyWishes();
        console.log(`Метод ${method} успешно выполнен через имитацию API`);
    }, 400);
}