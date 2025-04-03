export const topicsMap = {
  animals: [
    'lion', 'wolf', 'tiger', 'bear', 
    'elephant', 'panda', 'penguin', 'gorilla',
    'whale', 'eagle', 'dolphin', 'fox',
    'shark', 'owl', 'leopard', 'zebra'
  ],
  colors: [
    'red', 'blue', 'green', 'yellow',
    'purple', 'orange', 'pink', 'brown',
    'black', 'white', 'gold', 'silver',
    'turquoise', 'violet', 'indigo', 'red'
  ],
  cars: [
    'toyota', 'honda', 'volkswagen', 'mercedes',
    'bmw', 'audi', 'ford', 'chevrolet',
    'hyundai', 'nissan', 'kia', 'subaru',
    'mazda', 'volvo', 'lexus', 'jeep'
  ],
  cities: [
    'tokyo', 'paris', 'new york', 'london',
    'venice', 'rome', 'dubai', 'singapore',
    'hong kong', 'barcelona', 'sydney', 'amsterdam',
    'rio', 'kyoto', 'istanbul', 'seoul'
  ],
  landscapes: [
    'mountain', 'beach', 'forest', 'desert',
    'waterfall', 'lake', 'canyon', 'glacier',
    'valley', 'cliff', 'island', 'volcano',
    'field', 'cave', 'river', 'reef'
  ],
  foods: [
    'sushi', 'pizza', 'pasta', 'burger',
    'taco', 'ramen', 'steak', 'curry',
    'seafood', 'bbq', 'dessert', 'breakfast',
    'sandwich', 'salad', 'noodle', 'dumpling'
  ],
  sports: [
    'soccer', 'basketball', 'tennis', 'baseball',
    'surfing', 'skiing', 'boxing', 'climbing',
    'skateboarding', 'volleyball', 'swimming', 'cycling',
    'hockey', 'golf', 'racing', 'gymnastics'
  ]
} as const;

export type Topic = keyof typeof topicsMap;
export type Subtopic<T extends Topic> = typeof topicsMap[T][number];

export const topics = Object.keys(topicsMap) as Topic[];
