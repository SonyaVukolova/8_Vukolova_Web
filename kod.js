let isEditMode = false;
let deck = [];

class Card {
    constructor(id, name, desc) {
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
    renderBase(typeLabel) {
        return `
            <div class="card-header">${typeLabel}</div>
            <div class="card-header" style="background:none; border-top:none;">${this.name}</div>
            <div class="card-desc">${this.desc}</div>
        `;
    }
}

class Monster extends Card {
    constructor(id, name, desc, level) { super(id, name, desc); this.level = level; }
    render() {
        return `<div class="card monster">
            ${this.renderBase("👾 МОНСТР")}
            <div class="card-stats">УРОВЕНЬ: ${this.level}</div>
            ${isEditMode ? `<button class="del-btn" onclick="deleteCard(${this.id})">УДАЛИТЬ</button>` : ''}
        </div>`;
    }
}

class Item extends Card {
    constructor(id, name, desc, bonus, price) {
        super(id, name, desc);
        this.bonus = bonus;
        this.price = price;
    }
    render() {
        return `<div class="card item">
            <div class="card-stats" style="border-bottom:2px dashed #333">БОНУС: ${this.bonus}</div>
            ${this.renderBase("💰 ШМОТКА")}
            <div class="card-stats">${this.price} Голдов</div>
            ${isEditMode ? `<button class="del-btn" onclick="deleteCard(${this.id})">УДАЛИТЬ</button>` : ''}
        </div>`;
    }
}

class Race extends Card {
    render() {
        return `<div class="card race">
            ${this.renderBase("👤 РАСА")}
            <div class="card-stats">Paca</div>
            ${isEditMode ? `<button class="del-btn" onclick="deleteCard(${this.id})">УДАЛИТЬ</button>` : ''}
        </div>`;
    }
}

class MunchkinClass extends Card {
    render() {
        return `<div class="card class-card">
            ${this.renderBase("📜 КЛАСС")}
            <div class="card-stats">Класс</div>
            ${isEditMode ? `<button class="del-btn" onclick="deleteCard(${this.id})">УДАЛИТЬ</button>` : ''}
        </div>`;
    }
}
function buildSite() {
    const body = document.body;
    body.innerHTML = "";

    const title = document.createElement('h1');
    title.className = 'main-title';
    title.innerText = 'МАНЧКИН';
    body.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button onclick="toggleMode()">${isEditMode ? '✅ СОХРАНИТЬ' : '⚙️ РЕДАКТИРОВАТЬ'}</button>
        ${isEditMode ? `<button onclick="addNewCard()" style="background:#4CAF50; margin-left:10px;">➕ ДОБАВИТЬ КАРТУ</button>` : ''}
    `;
    body.appendChild(controls);

    const container = document.createElement('div');
    container.className = 'deck-container';
    deck.forEach(card => {
        const wrap = document.createElement('div');
        wrap.innerHTML = card.render();
        container.appendChild(wrap.firstElementChild);
    });
    body.appendChild(container);
}

function addNewCard() {
    const type = prompt("Тип: 1-Монстр, 2-Шмотка, 3-Раса, 4-Класс");
    if (!type) return;
    const name = prompt("Имя:");
    const desc = prompt("Описание:");
    const id = Date.now();

    if (type === "1") deck.push(new Monster(id, name, desc, prompt("Уровень:")));
    else if (type === "2") deck.push(new Item(id, name, desc, prompt("Бонус:"), prompt("Цена:")));
    else if (type === "3") deck.push(new Race(id, name, desc));
    else if (type === "4") deck.push(new MunchkinClass(id, name, desc));

    saveToStorage(); buildSite();
}

function deleteCard(id) {
    deck = deck.filter(c => c.id !== id);
    saveToStorage(); buildSite();
}

function toggleMode() { isEditMode = !isEditMode; buildSite(); }

function saveToStorage() {
    const data = deck.map(c => ({...c, typeName: c.constructor.name}));
    localStorage.setItem('munchkin_master_deck', JSON.stringify(data));
}

function loadFromStorage() {
    const saved = localStorage.getItem('munchkin_master_deck');
    if (saved) {
        const raw = JSON.parse(saved);


deck = raw.map(i => {
            if (i.typeName === 'Monster') return new Monster(i.id, i.name, i.desc, i.level);
            if (i.typeName === 'Item') return new Item(i.id, i.name, i.desc, i.bonus, i.price);
            if (i.typeName === 'Race') return new Race(i.id, i.name, i.desc);
            if (i.typeName === 'MunchkinClass') return new MunchkinClass(i.id, i.name, i.desc);
            return new Card(i.id, i.name, i.desc);
        });
    } else { createDefaultDeck(); }
}

function createDefaultDeck() {
    deck = [
        new MunchkinClass(1, "ВОИН", "Буйство: можешь сбросить до 3 карт в бою. Побеждаешь при равенстве сил."),
        new MunchkinClass(2, "КЛИРИК", "Воскрешение: можешь брать карты из сброса. Изгнание: +3 против Андедов."),
        new Race(3, "ДВАРФ", "Можешь нести любое количество Больших шмоток. В руке - 6 карт."),
        new Race(4, "ЭЛЬФ", "+1 к Смывке. Получаешь уровень за помощь в бою."),
        new Race(5, "ХАФЛИНГ", "Продаешь шмотку за двойную цену. Можешь перебросить Смывку."),
        new Item(6, "Башмаки Быстрого Бега", "Запас шагов +1. +1 к смывке.", "+1 Бонус", 500),
        new Item(7, "Плащ Замутнения", "Даёт +1 к попыткам смывки. Одежка.", "+2 Бонус", 600),
        new Item(8, "Жучиный шлем", "Жуки тобой брезгуют.", "+2 Бонус", 400),
        new Item(9, "Сыротёрка Умиротворения", "Только для Клириков.", "+3 Бонус", 400),
        new Item(10, "Неоправданно большой меч", "Очень тяжелый. 1 рука.", "+3 Бонус", 500),
        new Monster(11, "СЕТЕВОЙ ТРОЛЛЬ", "Очень токсичный монстр.", 10)
    ];
    saveToStorage();
}

window.onload = () => { loadFromStorage(); buildSite(); };