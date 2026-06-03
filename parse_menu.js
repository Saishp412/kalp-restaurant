const fs = require('fs');

const rawText = fs.readFileSync('raw_menu.txt', 'utf-8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l !== '');

const categories = [];
let currentCategory = null;
let currentItem = null;

const menuItems = [];

const categoryMap = {
    'Meals': 'Meals',
    'Soups': 'Soups',
    'Starters': 'Starters',
    'Main Course': 'Main Course',
    'Breads': 'Breads',
    'Rice and Biryani': 'Rice & Biryani',
    'Fried Rice and Noodles': 'Fried Rice & Noodles',
    'Pizza and Pasta': 'Pizza & Pasta',
    'Pide and Manakeesh': 'Pide & Manakeesh',
    'Snacks': 'Snacks',
    'Sushi Dimsum and Bao': 'Sushi, Dimsum & Bao',
    'Momos': 'Momos',
    'Ramen and Khowsuey': 'Ramen & Khowsuey',
    'Accompaniments': 'Accompaniments',
    'Desserts': 'Desserts'
};

let mainCategory = '';
let subCategory = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line is a main category
    if (categoryMap[line]) {
        mainCategory = categoryMap[line];
        subCategory = '';
        continue;
    }

    // Check if line looks like a subcategory
    if (!line.includes(' ') || line === 'Veg Meals' || line === 'Non Veg Meals' || line === 'European Meals' || line === 'Make Your Own One Pot Meal' || line === 'Make Your Own Veg Handi Meal' || line === 'Make Your Own Non Veg Handi Meal' || line === 'Veg Soups' || line === 'Non Veg Soup' || line === 'Veg Starters' || line === 'Non Veg Starters' || line === 'Veg Chinese Gravy' || line === 'Non Veg Chinese Gravy' || line === 'Veg Main Course' || line === 'Non Veg Main Course' || line === 'Rice' || line === 'Biryani' || line === 'Fried Rice' || line === 'Non Veg Fried Rice' || line === 'Veg Noodles' || line === 'Non Veg Noodles' || line === 'Pizza' || line === 'Pasta' || line === 'Sushi Rolls' || line === 'Dimsum' || line === 'Bao Buns' || line === 'Veg Momos' || line === 'Non Veg Momos') {
        if (!line.toLowerCase().includes('rice with') && !line.includes('soup') && !line.includes('soup') && line.split(' ').length <= 5) {
             // Let's rely on manual heuristics for subcategories
             const isSub = line.includes('Meals') || line.includes('Soups') || line.includes('Soup') || line.includes('Starters') || line.includes('Gravy') || line.includes('Course') || line === 'Rice' || line === 'Biryani' || line.includes('Fried Rice') || line.includes('Noodles') || line === 'Pizza' || line === 'Pasta' || line.includes('Rolls') || line === 'Dimsum' || line === 'Bao Buns' || line.includes('Momos');
             if (isSub && !line.includes('manchow') && !line.includes('miso') && !line.includes('tom kha') && !line.includes('Pizza') && !line.includes('Pasta')) { // pizza and pasta are also items
                 subCategory = line;
                 continue;
             } else if (line === 'Pizza' || line === 'Pasta' || line === 'Dimsum') {
                 subCategory = line;
                 continue;
             }
        }
    }

    // Heuristics for duplicate item names
    let name = line;
    let description = '';
    
    // Look ahead to see if next line is duplicate name or description
    if (i + 1 < lines.length) {
        if (lines[i+1].toLowerCase() === name.toLowerCase()) {
            i++; // skip duplicate
        }
    }
    if (i + 1 < lines.length) {
        const nextLine = lines[i+1];
        if (!categoryMap[nextLine] && nextLine.length > 25 && !nextLine.toLowerCase().includes('meal') && !nextLine.toLowerCase().includes('momo') && !nextLine.toLowerCase().includes('soup')) {
            description = nextLine;
            i++;
        }
    }

    // Determine veg/non-veg
    const isVeg = !(name.toLowerCase().includes('chicken') || name.toLowerCase().includes('mutton') || name.toLowerCase().includes('fish') || name.toLowerCase().includes('prawn') || name.toLowerCase().includes('lamb') || name.toLowerCase().includes('basa') || name.toLowerCase().includes('pomfret') || name.toLowerCase().includes('surmai'));

    // Price generator based on category
    let price = 250;
    if (name.toLowerCase().includes('prawn') || name.toLowerCase().includes('mutton') || name.toLowerCase().includes('lamb') || name.toLowerCase().includes('fish')) price = 650;
    else if (name.toLowerCase().includes('chicken')) price = 450;
    else if (mainCategory === 'Pizza & Pasta') price = 500;
    else if (mainCategory === 'Breads' || mainCategory === 'Accompaniments' || mainCategory === 'Snacks') price = 150;
    else price = 350;

    menuItems.push({
        name,
        description: description || '',
        price,
        category: mainCategory || 'Others',
        subCategory: subCategory || '',
        isVeg
    });
}

// Clean up some bad parsing
const cleanItems = menuItems.filter(item => {
    return !['Meals', 'Veg Meals', 'Non Veg Meals', 'European Meals'].includes(item.name);
});

const output = `export const menuData = ${JSON.stringify(cleanItems, null, 2)};\n`;
fs.writeFileSync('src/data/menuData.js', output);
console.log(`Successfully generated menuData.js with ${cleanItems.length} items`);
