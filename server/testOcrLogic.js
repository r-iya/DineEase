const text = `
Veg. Items Noodles Beverages
Shahi Paneer 200/- Veg Noodles 80/- Chocolate Shake 50/-
Kadahi Paneer 210/- Hakka Noodles 120/- Strawberry Shake 50/-
Paneer Masala 220/- Paneer Noodles 100/- Butter Scotch Shake 50/-
Paneer Do Pyaza 220/- Egg Noodles 100/- Oreo Shake 70/-
Aloo Tikki Rice Bowl 80/- Honey Chilli Fried Rice/Noodles 100/- Tea 15/-
`;

const lines = text.split('\n');
const menuItems = [];

lines.forEach(line => {
    if (line.trim() === '') return;

    // Regex to find prices: optional currency symbol, space, numbers, optional periods, optional /-
    const priceRegex = /[\$£€₹]?\s*(\d+(?:\.\d{1,2})?)(?:\/-|\/)?/g;

    let match;
    let lastIndex = 0;

    while ((match = priceRegex.exec(line)) !== null) {
        const priceVal = parseFloat(match[1]);

        // The name is the text between the last match and this match
        let nameRaw = line.substring(lastIndex, match.index);

        // Clean up name: letters and spaces only, replace multiple spaces with single space
        const name = nameRaw.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();

        if (name && !isNaN(priceVal) && name.length > 2) {
            menuItems.push({ name, price: priceVal });
        }

        lastIndex = priceRegex.lastIndex;
    }
});

console.log(JSON.stringify(menuItems, null, 2));
