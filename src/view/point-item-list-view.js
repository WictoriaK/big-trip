import {createElement} from '../render.js';
import {humanizePointDateFrom, humanizePointTimeFrom} from '../utils.js';


const createOffersTemplate = (offers) => (
  `${offers.map(({title, price}) =>
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span> +€&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`).join('')}`
);


const createTripPointListItemTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, type, isFavorite, offers} = point;
  // console.log(offers);

  const date = dateFrom !== null
    ? humanizePointDateFrom(dateFrom, 'MMM D')
    : '';

  const timeFrom = dateFrom !== null
    ? humanizePointTimeFrom(dateFrom, 'MMM D')
    : '';

  const timeTo = dateTo !== null
    ? humanizePointTimeFrom(dateTo, 'HH:mm')
    : '';

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  const linkedOffers = createOffersTemplate(offers);

  return `<li class="trip-events__item">
<div class="event">
                <time class="event__date" datetime="2019-03-18">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${timeFrom}</time>
                    —
                    <time class="event__end-time" datetime="2019-03-18T11:00">${timeTo}</time>
                  </p>
                  <p class="event__duration">30M</p>
                </div>
                <p class="event__price">
                  €&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${linkedOffers}

                </ul>
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
</li>`;
};

export default class TripListItemView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createTripPointListItemTemplate(this.point);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
