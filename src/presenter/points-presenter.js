import { render } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-points-view';
import TripSortView from '../view/trip-sort-view.js';


const siteContainer = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsContainer = null; // куда отрисовывается весь список(ul) точек на сайте
  #pointsModel = null;
  #pointsList =  new PointsListView(); // список(ul), куда отрисовывается точка машрута(li)

  #boardPoints = [];

  constructor(pointsContainer, pointsModel) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel; // данные для отрисовки
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points]; // все поинты для отрисовки из модели

    this.#renderPointsBoard();
  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);


    const replacePointToForm = () => {
      this.#pointsList.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#pointsList.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);

      }
    };


    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditClickHandler(() => {
      replaceFormToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });


    render(pointComponent, this.#pointsList.element);

  };

  #renderPointsBoard = () => {
    render(this.#pointsList, this.#pointsContainer);

    if(this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#pointsContainer);
    } else {
      render(new TripSortView(), siteContainer,'afterbegin');
      for(let i = 0; i < this.#boardPoints.length; i++) {
        this.#renderPoint(this.#boardPoints[i]);
      }
    }
  };
}


