import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDateFrom, humanizePointTimeFrom} from '../utils.js';
import {destinationsArray, returnDestination} from '../mock/destinations.js';
import {offersArray} from '../mock/offers.js';


const createOffersTemplate = (point) => {
  const pointTypeOffer = offersArray?.find((offer) => offer.type === point.type);

  if (!pointTypeOffer) {
    return '';
  }

  return pointTypeOffer.offers.map((offer) => {
    const offersSet = new Set(point.offers);
    const checkedOffer = offersSet.has(offer.id) ? 'checked' : '';

    return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${checkedOffer}>
                        <label class="event__offer-label" for="event-offer-luggage-1">
                          <span class="event__offer-title">${offer.title}</span>
                          +€&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  }).join('');
};

const createEventTypeTemplate = (array) => (`${array.map((offer) => `<div class="event__type-item">
                          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
                          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
                        </div>`).join('')}`);

const createPhotosTemplate = (pictures) => (
  `${pictures.map(({src, description}) =>
    `<img class="event__photo" src="${src}" alt="${description}">`).join('')}`
);

const createDestinationsTemplate = (array) => (`${array.map((destination) => `<option value='${destination.name}'></option>`).join('')}`);

const createTripPointEditFormTemplate = (point = {}) => {
  const {dateFrom, dateTo, destination, type, price = 220} = point;

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

  const pictures = createPhotosTemplate(destination.pictures);
  const destinationNames = createDestinationsTemplate(destinationsArray);
  const offersTypes = createEventTypeTemplate(offersArray);

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
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
${destinationNames}
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                  ${linkedOffers}

                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.destination}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${pictures}
                      </div>
                    </div>
                  </section>
                </section>
              </form>`;

};


export default class PointEditView extends AbstractStatefulView {
  #datePicker = null;

  constructor(point) {
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

    if(this.#datePicker) {
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
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = returnDestination(evt.target.value);

    this.updateElement({
      destination: {
        name: destinationName.name,
        destination: destinationName.destination,
        pictures: destinationName.pictures
      }

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
    if(this._state.dateFrom) {
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
    if(this._state.dateTo) {
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

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setEditClickHandler(this._callback.editClick);
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);

  };


  #setInnerHandlers = () => {
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  };

  static parseStateToPoint = (state) => ({...state});

  static parsePointToState = (point) =>  ({...point});
}
