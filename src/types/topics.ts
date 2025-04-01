export const topicsMap = {
  animals: [
    'cats', 'dogs', 'birds', 'horses', 'lions', 'tigers', 'elephants', 'dolphins',
    'penguins', 'pandas', 'wolves', 'bears', 'giraffes', 'monkeys', 'rabbits',
    'butterflies', 'whales', 'zebras', 'koalas', 'owls', 'foxes', 'sharks', 'turtles', 'kangaroos'
  ],
  cars: [
    'sports cars', 'luxury cars', 'classic cars', 'muscle cars', 'electric cars', 'supercars',
    'vintage cars', 'convertibles', 'sedans', 'SUVs', 'trucks', 'race cars', 'concept cars',
    'hypercars', 'off-road vehicles', 'hot rods', 'roadsters', 'coupes', 'wagons', 'limousines',
    'rally cars', 'compact cars', 'hybrid cars', 'custom cars'
  ],
  cities: [
    'new york', 'tokyo', 'paris', 'london', 'dubai', 'singapore', 'hong kong', 'rome',
    'barcelona', 'sydney', 'venice', 'san francisco', 'amsterdam', 'istanbul', 'rio de janeiro',
    'seoul', 'prague', 'vienna', 'bangkok', 'moscow', 'berlin', 'kyoto', 'cairo', 'mumbai'
  ],
  fruits: [
    'apples', 'oranges', 'bananas', 'strawberries', 'grapes', 'mangoes', 'pineapples',
    'watermelons', 'peaches', 'blueberries', 'kiwis', 'cherries', 'pears', 'plums',
    'raspberries', 'lemons', 'limes', 'coconuts', 'pomegranates', 'figs', 'blackberries',
    'dragon fruit', 'passion fruit', 'apricots'
  ],
  foods: [
    'pizza', 'sushi', 'pasta', 'burgers', 'tacos', 'curry', 'steak', 'salads',
    'seafood', 'sandwiches', 'ramen', 'bbq', 'desserts', 'soups', 'breakfast',
    'mediterranean', 'chinese', 'mexican', 'italian', 'indian', 'thai', 'french',
    'vegetarian', 'street food'
  ],
  sports: [
    'soccer', 'basketball', 'tennis', 'baseball', 'golf', 'swimming', 'volleyball',
    'athletics', 'boxing', 'cycling', 'skiing', 'surfing', 'hockey', 'rugby',
    'martial arts', 'gymnastics', 'skateboarding', 'climbing', 'racing', 'cricket',
    'snowboarding', 'football', 'wrestling', 'badminton'
  ]
} as const;

export type Topic = keyof typeof topicsMap;
export type Subtopic<T extends Topic> = typeof topicsMap[T][number];

export const topics = Object.keys(topicsMap) as Topic[];
