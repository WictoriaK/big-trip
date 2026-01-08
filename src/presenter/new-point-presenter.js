import {render, remove, RenderPosition} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';
import NewPointView from '../view/new-point-view.js';

export default class NewPointPresenter {
  #pointsList = null;
  #destinations = null;
  #offers = null;
  #changeData = null;
  #newPointComponent = null;

  #destroyCallback = null;

  constructor(pointsList, changeData, destinations, offers) {
    this.#pointsList = pointsList;
    this.#changeData = changeData;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if(this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent =  new NewPointView(this.#destinations, this.#offers);
    this.#newPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#newPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#newPointComponent, this.#pointsList,  RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if(this.#newPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };


  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();

    }
  };

  setSaving = () => {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false
      });
    };

    this.#newPointComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
