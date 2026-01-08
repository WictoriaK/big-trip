import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import {getAllDestinations, getDestination} from '../utils.js';

const defaultPoint =  {
  id: 0,
  basePrice: 10,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination:  {
    description:   'Amsterdam, in a middle of Europe, middle-eastern paradise, a perfect place to stay with a family.',
    name: 'Amsterdam',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.757505347894956',
        description: 'Amsterdam park'
      }
    ]
  },
  isFavorite: false,
  offers: [],
  type: 'taxi',
};


const createOffersTemplate = (point, offers, isDisabled) => {
  const pointTypeOffer = offers.find((d) => d.type === point.type)?.offers;

  if (!pointTypeOffer) {
    return '';
  }

  return pointTypeOffer.map((offer) => {
    const offersSet = new Set(point.offers);
    const checkedOffer = offersSet.has(offer.id) ? 'checked' : '';

    return `<div class="event__offer-selector">
                         <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${checkedOffer} data-offer-id="${offer.id}" ${isDisabled ? 'disabled' : ''}>
                        <label class="event__offer-label" for="event-offer-${offer.id}">
                          <span class="event__offer-title">${he.encode(offer.title)}</span>
                          +€&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  }).join('');
};

const createCitiesList = (destinations) => {
  const allCities = getAllDestinations(destinations);

  return allCities.map((city) => `<option value='${city}'>${city}</option>`).join('');
};

const createEventTypeTemplate = (offers, isDisabled) => offers.map((item) => `<div class="event__type-item">
                          <input id="event-type-${item.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}" ${isDisabled ? 'disabled' : ''}/>
                          <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-1">${item.type}</label>
                        </div>`).join('');


const createDestinationTemplate = (city, destinations) => {
  const currentDestination = getDestination(city, destinations);

  const photosTemplate = currentDestination === undefined ? '' : `<div class="event__photos-container"><div class="event__photos-tape"> ${currentDestination.pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`)}</div>
    </div>`;


  return (currentDestination ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestination.description}</p>
      ${photosTemplate}
    </section>
  ` : '');
};

const createNewPointFormTemplate = (point, destinations, offers) => {

  const {dateFrom, dateTo, destination, type, basePrice, isSaving, isCanceling, isDisabled} = point;


  const destinationInfo = createDestinationTemplate(destination?.name, destinations);
  const cityList = createCitiesList(destinations);

  const offersTypes = createEventTypeTemplate(offers);
  const linkedOffers = createOffersTemplate(point, offers);


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
                    <label class="event__label  event__type-output" for="event-${destination.name}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${point.destination.name}" list="destination-list-${point.id}">
                    <datalist id="destination-list-${point.id}">
${cityList}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom} " ${isDisabled ? 'disabled' : ''}>
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''} ${isSaving ? 'Saving...' : 'save'}>Save</button>

      <button class="event__reset-btn" type="reset" ${isCanceling ? 'Canceling...' : 'Cansel'}>Cancel</button>

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

export default class NewPointView extends AbstractStatefulView {
  #point = null;
  #datePicker = null;
  #destinations = null;
  #offers = [];

  constructor(destinations, offers) {
    super();
    this.#point = defaultPoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this._setState(NewPointView.parsePointToState(this.#point));
    this._state = NewPointView.parsePointToState(this.#point);

    this.#setInnerHandlers();
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  get template() {
    return createNewPointFormTemplate(this._state, this.#destinations, this.#offers);
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
      NewPointView.parsePointToState(point),
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

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };


  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(NewPointView.parseStateToPoint(this._state));
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

    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);

    this.updateElement({
      destination: selectedDestination
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
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setInnerHandlers();

  };


  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
  };

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
  });
}
