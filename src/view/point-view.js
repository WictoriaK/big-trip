import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDateFrom, humanizePointTimeFrom, differentDate} from '../utils.js';


const createOffersTemplate = (point, offers)  => {
  const pointTypeOffer = offers.find((offer) => offer.type === point.type);

  if (!pointTypeOffer) {
    return '';
  }
  const offersSet = new Set(point.offers);

  return pointTypeOffer.offers.map((offer) => {
    const checkedOffer = offersSet.has(offer.id);

    return checkedOffer
      ? `<li class="event__offer">
            <span class="event__offer-title">${offer.title}</span> +€&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>`
      : '';}).join('');
};


const createTripPointTemplate = (point, offers) => {
  const {basePrice, dateFrom, dateTo, destination, type, isFavorite} = point;

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

  const linkedOffers = createOffersTemplate(point, offers);

  return `<li class="trip-events__item">
<div class="event">
                <time class="event__date" datetime="2019-03-18">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${timeFrom}</time>
                    —
                    <time class="event__end-time" datetime="2019-03-18T11:00">${timeTo}</time>
                  </p>
                  <p class="event__duration">
                  ${differentDate(dateFrom, dateTo)}
</p>
                </div>
                <p class="event__price">
                  €&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
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

export default class PointView  extends AbstractView {
  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#offers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
