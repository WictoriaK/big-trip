import { render, RenderPosition } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-points-view';
import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presernter';
import {updateItem} from '../utils';


const siteContainer = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsContainer = null; // куда отрисовывается весь список(ul) точек на сайте
  #pointsModel = null;
  #pointsList =  new PointsListView(); // список(ul), куда отрисовывается точка машрута(li)
  #noPointsComponent = new NoPointView();
  #sortComponent = new TripSortView();

  #boardPoints = [];
  #pointPresenter = new Map();

  constructor(pointsContainer, pointsModel) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel; // данные для отрисовки
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points]; // все поинты для отрисовки из модели

    this.#renderPointsBoard();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#handlePointChange, this.#handeModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#pointsContainer);
  };

  #renderPoints = () => {
    for(let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  };

  #renderPointsList = () => {
    render(this.#pointsList, this.#pointsContainer);
    this.#renderPoints();
  };

  #renderPointsBoard = () => {
    if(this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    render(this.#sortComponent, siteContainer,RenderPosition.AFTERBEGIN);
    this.#renderPointsList();
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handeModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}


