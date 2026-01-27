
import { Product, Category, AddOnCategory } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Burgers' },
  { id: '2', name: 'Pizza' },
  { id: '3', name: 'Sandwiches' },
  { id: '4', name: 'Nuggets' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Twins Deal',
    description: 'Get Any Of 2 Medium Pizza\'s',
    price: 2400.00,
    originalPrice: 2898.00,
    discount: 17,
    discountText: 'TWO MEDIUM PIZZA',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p2',
    name: '6 Pcs Fried Chicken',
    description: 'Big Crispy Fried Chicken Pcs Extra Tender, Juicy And Crunchy.',
    price: 1400.00,
    originalPrice: 1920.00,
    discount: 27,
    discountText: 'SELECTED FRIED CHICKEN',
    category: 'Nuggets',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p3',
    name: 'Zingers Twist',
    description: '2 MouthWatering Zingers',
    price: 799.00,
    originalPrice: 1099.00,
    discount: 27,
    discountText: 'TWO ZINGERS',
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p4',
    name: 'Pizza Twist',
    description: 'Get Any Of 2 Small Pizza\'s',
    price: 1099.00,
    originalPrice: 1300.00,
    discount: 15,
    discountText: 'TWO SMALL PIZZA',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p5',
    name: 'HouseFull',
    description: 'Any Large Pizza + 10 Wings',
    price: 2160.00,
    discountText: 'LARGE PIZZA 10 WINGS',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p6',
    name: 'Large Combo',
    description: 'Get Any Two Large Pizzas',
    price: 3600.00,
    originalPrice: 4200.00,
    discount: 14,
    discountText: 'TWO LARGE PIZZA',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p7',
    name: 'Royal Grill Burger',
    description: 'Double flame-grilled beef patty with caramelized onions and aged cheddar.',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  },
  {
    id: 'p8',
    name: 'Classic Club Sandwich',
    description: 'Toasted brioche with smoked turkey, honey ham, avocado, and herb mayo.',
    price: 10.25,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isHidden: false
  }
];

export const ADD_ON_CATEGORIES: AddOnCategory[] = [
  {
    id: 'sides',
    name: 'Sides',
    addOns: [
      { id: 'fries', name: 'French Fries', price: 150.00, category: 'sides' },
      { id: 'onion-rings', name: 'Onion Rings', price: 200.00, category: 'sides' },
      { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', price: 250.00, category: 'sides' },
      { id: 'chicken-wings', name: 'Chicken Wings (6pcs)', price: 400.00, category: 'sides' }
    ]
  },
  {
    id: 'sauces',
    name: 'Sauces & Dips',
    addOns: [
      { id: 'mayo', name: 'Mayonnaise', price: 50.00, category: 'sauces' },
      { id: 'ketchup', name: 'Ketchup', price: 50.00, category: 'sauces' },
      { id: 'bbq', name: 'BBQ Sauce', price: 50.00, category: 'sauces' },
      { id: 'ranch', name: 'Ranch Dressing', price: 50.00, category: 'sauces' },
      { id: 'garlic', name: 'Garlic Sauce', price: 50.00, category: 'sauces' },
      { id: 'hot-sauce', name: 'Hot Sauce', price: 50.00, category: 'sauces' }
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    addOns: [
      { id: 'cola', name: 'Cola (500ml)', price: 100.00, category: 'drinks' },
      { id: 'sprite', name: 'Sprite (500ml)', price: 100.00, category: 'drinks' },
      { id: 'water', name: 'Water (500ml)', price: 50.00, category: 'drinks' },
      { id: 'juice', name: 'Orange Juice (500ml)', price: 150.00, category: 'drinks' }
    ]
  },
  {
    id: 'extras',
    name: 'Extras',
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 100.00, category: 'extras' },
      { id: 'extra-meat', name: 'Extra Meat', price: 200.00, category: 'extras' },
      { id: 'bacon', name: 'Bacon Strips', price: 150.00, category: 'extras' },
      { id: 'avocado', name: 'Avocado', price: 100.00, category: 'extras' }
    ]
  }
];
