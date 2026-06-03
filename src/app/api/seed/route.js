import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Table from '@/models/Table';

const sampleTables = [
  { tableNumber: 'T1', capacity: 2, status: 'free', shape: 'rectangle', position: { x: 10, y: 10 } },
  { tableNumber: 'T2', capacity: 2, status: 'free', shape: 'rectangle', position: { x: 10, y: 30 } },
  { tableNumber: 'T3', capacity: 4, status: 'free', shape: 'rectangle', position: { x: 30, y: 10 } },
  { tableNumber: 'T4', capacity: 4, status: 'free', shape: 'rectangle', position: { x: 30, y: 30 } },
  { tableNumber: 'T5', capacity: 4, status: 'free', shape: 'circle', position: { x: 50, y: 20 } },
  { tableNumber: 'T6', capacity: 6, status: 'free', shape: 'rectangle', position: { x: 70, y: 10 } },
  { tableNumber: 'T7', capacity: 8, status: 'free', shape: 'circle', position: { x: 75, y: 40 } },
  { tableNumber: 'T8', capacity: 2, status: 'free', shape: 'rectangle', position: { x: 10, y: 60 } },
  { tableNumber: 'T9', capacity: 4, status: 'free', shape: 'circle', position: { x: 30, y: 60 } },
  { tableNumber: 'VIP1', capacity: 10, status: 'free', shape: 'rectangle', position: { x: 70, y: 70 } },
];

const sampleMenuItems = [
  // North Indian
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato-butter gravy with aromatic spices.',
    price: 450,
    category: 'North Indian',
    image: '/images/menu/butter-chicken.jpg',
    isVeg: false,
    isSpecial: true,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils simmered overnight in butter and cream.',
    price: 320,
    category: 'North Indian',
    image: '/images/menu/dal-makhani.jpg',
    isVeg: true,
    isSpecial: false,
  },
  // Asian
  {
    name: 'Thai Green Curry',
    description: 'Fragrant coconut curry with vegetables, Thai basil, and green chilies.',
    price: 420,
    category: 'Asian',
    image: '/images/menu/thai-green-curry.jpg',
    isVeg: true,
    isSpecial: false,
  },
  {
    name: 'Chicken Satay',
    description: 'Grilled chicken skewers marinated in lemongrass, served with peanut sauce.',
    price: 380,
    category: 'Asian',
    image: '/images/menu/chicken-satay.jpg',
    isVeg: false,
    isSpecial: false,
  },
  // Korean
  {
    name: 'Bibimbap',
    description: 'Mixed rice bowl topped with sautéed vegetables, gochujang, and a fried egg.',
    price: 480,
    category: 'Korean',
    image: '/images/menu/bibimbap.jpg',
    isVeg: false,
    isSpecial: true,
  },
  {
    name: 'Kimchi Fried Rice',
    description: 'Wok-tossed rice with aged kimchi, vegetables, and sesame oil.',
    price: 350,
    category: 'Korean',
    image: '/images/menu/kimchi-fried-rice.jpg',
    isVeg: true,
    isSpecial: false,
  },
  // Italian
  {
    name: 'Penne Arrabbiata',
    description: 'Penne pasta in a spicy tomato sauce with garlic and red chili flakes.',
    price: 380,
    category: 'Italian',
    image: '/images/menu/penne-arrabbiata.jpg',
    isVeg: true,
    isSpecial: false,
  },
  {
    name: 'Chicken Alfredo Pasta',
    description: 'Fettuccine in a creamy parmesan sauce with grilled chicken strips.',
    price: 450,
    category: 'Italian',
    image: '/images/menu/chicken-alfredo.jpg',
    isVeg: false,
    isSpecial: false,
  },
  // Desserts
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup.',
    price: 200,
    category: 'Desserts',
    image: '/images/menu/gulab-jamun.jpg',
    isVeg: true,
    isSpecial: false,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
    price: 350,
    category: 'Desserts',
    image: '/images/menu/tiramisu.jpg',
    isVeg: true,
    isSpecial: true,
  },
  // Beverages
  {
    name: 'Mango Lassi',
    description: 'Chilled yogurt drink blended with fresh Alphonso mango pulp.',
    price: 200,
    category: 'Beverages',
    image: '/images/menu/mango-lassi.jpg',
    isVeg: true,
    isSpecial: false,
  },
  {
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea brewed with cardamom, ginger, and cinnamon.',
    price: 150,
    category: 'Beverages',
    image: '/images/menu/masala-chai.jpg',
    isVeg: true,
    isSpecial: false,
  },
  // Pizza
  {
    name: 'Tandoori Paneer Pizza',
    description: 'Wood-fired pizza topped with tandoori paneer, peppers, and mozzarella.',
    price: 520,
    category: 'Pizza',
    image: '/images/menu/tandoori-paneer-pizza.jpg',
    isVeg: true,
    isSpecial: true,
  },
  {
    name: 'Chicken Tikka Pizza',
    description: 'Thin-crust pizza with spiced chicken tikka, onions, and mint chutney drizzle.',
    price: 580,
    category: 'Pizza',
    image: '/images/menu/chicken-tikka-pizza.jpg',
    isVeg: false,
    isSpecial: false,
  },
  // Oriental
  {
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles tossed with crunchy vegetables and soy sauce.',
    price: 300,
    category: 'Oriental',
    image: '/images/menu/veg-hakka-noodles.jpg',
    isVeg: true,
    isSpecial: false,
  },
  {
    name: 'Chilli Chicken',
    description: 'Indo-Chinese crispy chicken tossed with green chilies, garlic, and soy sauce.',
    price: 420,
    category: 'Oriental',
    image: '/images/menu/chilli-chicken.jpg',
    isVeg: false,
    isSpecial: true,
  },
];

export async function GET() {
  try {
    await dbConnect();

    const existingCount = await MenuItem.countDocuments();

    let message = '';
    if (existingCount === 0) {
      await MenuItem.insertMany(sampleMenuItems);
      message += 'Seeded menu items. ';
    }
    
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      await Table.insertMany(sampleTables);
      message += 'Seeded tables. ';
    }

    if (existingCount > 0 && tableCount > 0) {
      return NextResponse.json({ success: true, message: 'Database already seeded.' });
    }

    return NextResponse.json(
      { success: true, message: message || 'Database seeded.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
