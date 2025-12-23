
const destinationsArray =  [
  {
    destination: 'Norway, officially the Kingdom of Norway, is a Nordic country located on the Scandinavian Peninsula in Northern Europe.',
    name: 'Norway',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200?r=0.0762563005163317',
        description: 'Norway'
      }
    ]
  },
  {
    destination: 'London is the capital and largest city of England and the United Kingdom, a major global center for finance, culture, and transportation located on the River Thames in southeastern England.',
    name: 'London',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200?r=0.0762563005163317',
        description: 'London'
      }
    ]
  },
  {
    destination: 'Tokyo is Japans capital and a major global metropolis known for blending tradition and modernity.',
    name: 'Tokyo',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200?r=0.0762563005163317',
        description: 'Tokyo'
      }
    ]
  },
  {
    destination: 'Amsterdam is the capital of the Netherlands, famous for its historic canal system, diverse culture, and liberal atmosphere. ',
    name: 'Amsterdam',
    pictures: [
      {
        src: 'https://loremflickr.com/300/200?r=0.0762563005163317',
        description: 'Amsterdam'
      }
    ]
  }
];

const returnDestination = (city) => {
  const destinationCity = destinationsArray.filter((item) => item.name === city);
  return destinationCity[0];
};

const returnAllDestinations = () => {
  const allDestinations = destinationsArray.map(({name}) => name);
  return allDestinations;
};


export { destinationsArray, returnDestination, returnAllDestinations};
