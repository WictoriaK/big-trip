const offersArray = [
  {
    id: 1,
    title: 'Upgrade to a business class',
    price: 120
  },
  {
    id: 2,
    title: 'Add luggage',
    price: 30
  },
  {
    id: 3,
    title: 'Switch to comfort class',
    price: 100
  },
  {
    id: 4,
    title: 'Add meal',
    price: 15
  },
  {
    id: 5,
    title: 'Choose seats',
    price: 5
  },
  {
    id: 6,
    title: 'Travel by train',
    price: 40
  }
];

const createOffersMap = (offers) => {
  const offersMap = new Map();

  offers.forEach((offer) => {
    offersMap.set(offer.id, offer);
  });

  return offersMap;
};

const offersById = createOffersMap(offersArray);


export {offersById};

