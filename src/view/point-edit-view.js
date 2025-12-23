import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDateFrom, humanizePointTimeFrom} from '../utils.js';
import {returnAllDestinations, returnDestination} from '../mock/destinations.js';
import {offersArray} from '../mock/offers.js';
import {generateOfferType } from '../mock/point.js';

const CITIES = returnAllDestinations();
const TYPES = generateOfferType();

const BLANK_POINT = {
  basePrice: 0,
  destination: CITIES[0],
  city: '',
  offers: [],
  type: TYPES,
};

const createOffersTemplate = (point) => {
  const pointTypeOffer = offersArray.find((offer) => offer.type === point.type);

  if (!pointTypeOffer) {
    return '';
  }


  return pointTypeOffer.offers.map((offer) => {
    const offersSet = new Set(point.offers);
    const checkedOffer = offersSet.has(offer.id) ? 'checked' : '';

    return `<div class="event__offer-selector">
                         <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${checkedOffer} data-offer-id="${offer.id}">
                        <label class="event__offer-label" for="event-offer-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          +€&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  }).join('');
};

const createCitiesList = () => {
  const allCities = returnAllDestinations();

  return allCities.map((city) => `<option value='${city}'>${city}</option>`).join('');
};

const createEventTypeTemplate = () => offersArray.map((item) => `<div class="event__type-item">
                          <input id="event-type-${item.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}"/>
                          <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-1">${item.type}</label>
                        </div>`).join('');


const createDestinationTemplate = (destination) => {
  const currentDestination = returnDestination(destination);

  const photosTemplate = currentDestination === undefined ? '' : `<div class="event__photos-container"><div class="event__photos-tape"> ${currentDestination.pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`)}</div>
    </div>`;


  return (currentDestination ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestination.destination}</p>
      ${photosTemplate}
    </section>
  ` : '');
};

const createTripPointEditFormTemplate = (point = {}) => {
  const isNewPoint = !('id' in point);

  const {dateFrom, dateTo, destination, type, basePrice} = point;

  const linkedOffers = createOffersTemplate(point);

  const startDate = dateFrom !== null
    ? humanizePointDateFrom(dateFrom, 'DD/MM/YYYY')
    : '';

  const endDate = dateFrom !== null
    ? humanizePointDateFrom(dateFrom, 'DD/MM/YYYY')
    : '';

  const timeFrom = dateFrom !== null
    ? humanizePointTimeFrom(dateFrom, 'HH:mm')
    : '';

  const timeTo = dateTo !== null
    ? humanizePointTimeFrom(dateTo, 'HH:mm')
    : '';

  const destinationInfo = createDestinationTemplate(destination);
  const cityList = createCitiesList();
  const offersTypes = createEventTypeTemplate(type);


  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
${offersTypes}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-${destination}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                    <datalist id="destination-list-${point.id}">
${cityList}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${timeFrom}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${timeTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  ${isNewPoint ? `
      <button class="event__reset-btn" type="reset">Cancel</button>
      ` :
    `
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
      `}
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                  ${linkedOffers}

                    </div>
                  </section>

                  ${destinationInfo}
                </section>
              </form>`;

};


export default class PointEditView extends AbstractStatefulView {
  #datePicker = null;

  constructor(point = {
    ...BLANK_POINT,
    dateFrom: new Date(),
    dateTo: new Date()
  }) {
    super();
    this._state = PointEditView.parseStateToPoint(point);

    this.#setInnerHandlers();
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  get template() {
    return createTripPointEditFormTemplate(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datePicker) {
      this.#datePicker.destroy();
      this.#datePicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();
    this._callback.formSubmit(this._state);
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };


  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };


  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({offers: []});
    this.updateElement({
      type: evt.target.value,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const parsedPrice = parseInt(evt.target.value, 10);

    evt.target.value = isNaN(parsedPrice) ? this._state.basePrice : parsedPrice;
    this._setState({basePrice: parseInt(evt.target.value, 10)});
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = returnDestination(evt.target.value);

    this.updateElement({
      destination: destinationName.name
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDatePickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datePicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#dateFromChangeHandler
        }
      );
    }
  };

  #setDatePickerTo = () => {
    if (this._state.dateTo) {
      this.#datePicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#dateToChangeHandler
        }
      );
    }
  };

  #offersChangeHandler = (evt) => {
    let selectedOffers = this._state.offers;
    const offerId = parseInt(evt.target.dataset.offerId, 10);

    if (evt.target.checked) {
      selectedOffers.push(offerId);
      selectedOffers.sort();
    } else {
      selectedOffers = this._state.offers.filter((e) => e !== offerId);
    }
    this._setState({ offers: selectedOffers });
  };

  _restoreHandlers = () => {
    const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
    if (rollupButtonElement) {
      this.setEditClickHandler(this._callback.editClick);
    }

    this.#setDatePickerFrom();
    this.#setDatePickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);

    this.#setInnerHandlers();

  };


  #setInnerHandlers = () => {
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
  };

  static parseStateToPoint = (state) => ({...state});

  static parsePointToState = (point) => ({...point});
}
