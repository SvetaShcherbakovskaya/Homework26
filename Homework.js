/*
HW_26_TEXT
Используя два информационных ресурса (API) - https://jsonplaceholder.typicode.com/users и https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.27&current_weather=true
1. Получить список пользователей (users) с ресурса https://jsonplaceholder.typicode.com/users
2. Для каждого пользователя получить его географические координаты (latitude и longitude)   
3. Используя эти координаты, получить текущую погоду для каждого пользователя с ресурса https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.27&current_weather=true
4. Определить пользователя с самой высокой температурой и вывести его имя, телефон  
 и температуру в консоль.
 Решите задачу с использованием 
 5.fetch  
 6.axios (для одного из запросов).
*/

async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    return users;
}

async function getWeather(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weather = await response.json();
    return weather.current_weather;
}

async function main() {
    const users = await getUsers();
    let maxTemp = -Infinity;
    let hottestUser = null;

    for (const user of users) {
        const { lat, lng } = user.address.geo;
        const weather = await getWeather(lat, lng);
        if (weather.temperature > maxTemp) {
            maxTemp = weather.temperature;
            hottestUser = user;
        }
    }

    if (hottestUser) {
        console.log(`Name: ${hottestUser.name}, Phone: ${hottestUser.phone}, Temperature: ${maxTemp}`);
    }
}

main();