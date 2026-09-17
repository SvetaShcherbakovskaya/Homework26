import { GoogleGenAI } from "@google/genai";

function getProducts() {
    const products = [
        { name: "Молоко", count: 2.0, price: 1.5, expDate: "2024-07-01" },
        { name: "Хлеб", count: 0.5, price: 0.8, expDate: "2024-06-15" },
        { name: "Яйца", count: 12, price: 2.5, expDate: "2024-07-10" },
        { name: "Сыр", count: 0.3, price: 3.0, expDate: "2024-07-20" },
    ];

    return products;
}

function createBasePromptByRole(user) {
    if (user.role === "ADMIN") {
        return `
Ты — квалифицированный повар, определяющий ингредиенты
блюда по названию блюда.

Тебе дается название желаемого блюда и список
продуктов, имеющихся в холодильнике.

Твоя задача — на основе этих данных составить рекомендации
для владельца холодильника, какие недостающие продукты надо
закупить, чтобы владелец мог приготовить желаемое блюдо.

Правила:
- возвращай только список продуктов, которые нужно закупить.
- не возвращай продукты, не имеющие отношения к данному блюду.
- не возвращай продукты, которые уже есть в холодильнике.
`;
    } else {
        return `
Ты — квалифицированный повар, определяющий ингредиенты
блюда по названию блюда.

Тебе дается название желаемого блюда и список
продуктов, имеющихся в холодильнике.

Твоя задача — на основе этих данных составить рекомендации
для владельца холодильника, какие продукты надо
использовать из имеющихся в холодильнике, чтобы владелец мог
приготовить желаемое блюдо.

Правила:
- возвращай только список продуктов, которые нужно использовать
  из числа имеющихся в холодильнике.
- не возвращай продукты, не имеющие отношения к данному блюду.
- не возвращай продукты, которых нет в холодильнике.
`;
    }
}

function createPrompt(basePrompt, dishTitle, availableProducts) {
    return `
${basePrompt}

Название блюда: ${dishTitle}

Продукты, имеющиеся в холодильнике:
${JSON.stringify(availableProducts, null, 2)}
`;
}

async function askAi(prompt) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}

async function main() {
    const user = {
        name: "John",
        role: "USER",
    };

    const admin = {
        name: "Bill",
        role: "ADMIN",
    };

    const authenticatedUser = admin;

    // 1. Получаем все продукты из холодильника
    const availableProducts = getProducts();

    // 2. Создаем базовый промпт в зависимости от роли
    const basePrompt = createBasePromptByRole(authenticatedUser);

    // 3. Создаем полный промпт
    const prompt = createPrompt(
        basePrompt,
        "борщ",
        availableProducts
    );

    // 4. Отправляем промпт искусственному интеллекту
    const aiResponse = await askAi(prompt);

    // 5. Выводим ответ
    console.log(aiResponse);
}

main();