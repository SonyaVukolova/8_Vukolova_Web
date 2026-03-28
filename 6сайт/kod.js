
const API_URL = 'https://reqres.in';

function showSection(id) {
    console.log("Переключаем на секцию:", id);
    document.querySelectorAll('.api-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
    }
    if (id === 'hero') fetchCatalog();
}

async function fetchCatalog() {
    const grid = document.getElementById('catalog-grid');
    const loader = document.getElementById('catalog-loader');
    if (loader) loader.style.display = 'block';
    if (grid) grid.innerHTML = '';

    try {
        const res = await fetch(API_URL + '?page=1');
        const json = await res.json();
        renderItems(json.data);
    } catch (e) {
        console.log("Ошибка сети, включаю имитацию");
        const mockData =
        renderItems(mockData);
    } finally { 
        if (loader) loader.style.display = 'none'; 
    }
}

function renderItems(data) {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    grid.innerHTML = data.map(i => `
        <div class="card" id="item-${i.id}" style="background:white; padding:15px; border-radius:15px; margin:10px; width:150px; display:inline-block;">
            <img src="${i.avatar}" style="width:60px; border-radius:50%;">
            <h4>${i.first_name}</h4>
            <button onclick="deleteItem(${i.id})" style="border:none; color:red; cursor:pointer; background:none;">Удалить (DELETE)</button>
        </div>
    `).join('');
}

async function postWish() {
    const input = document.getElementById('wish-input');
    if (!input || !input.value) return alert("Введите текст!");
    try {
        await fetch(API_URL, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: input.value}) 
        });
        alert(`Успешно! Метод POST сработал для: ${input.value}`);
        input.value = "";
    } catch(e) { 
        alert("Имитация POST: Желание добавлено!"); 
    }
}

async function deleteItem(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert(`Метод DELETE выполнен для #${id}`);
    } catch(e) { 
        alert(`Имитация DELETE: Удалено #${id}`); 
    }
    const el = document.getElementById(`item-${id}`);
    if(el) el.style.opacity = '0.3';
}

async function patchData() {
    try {
        await fetch(`${API_URL}/2`, { 
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: "Новое"}) 
        });
        alert("Метод PATCH (обновление) выполнен!");
    } catch(e) { 
        alert("Имитация PATCH: Данные обновлены"); 
    }
}

window.onload = function() {
    showSection('hero');
};