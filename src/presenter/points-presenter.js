import { render, RenderPosition } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-points-view';
import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presenter';
import {updateItem, SortTypes, sortPriceUp, sortTimeUp, sortDayUp} from '../utils.js';


const siteContainer = document.querySelector('.trip-events');

export default class PointsPresenter {
  #pointsContainer = null; // куда отрисовывается весь список(ul) точек на сайте
  #pointsModel = null;
  #pointsList =  new PointsListView(); // список(ul), куда отрисовывается точка машрута(li)
  #noPointsComponent = new NoPointView();
  #sortComponent = new TripSortView();

  #boardPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortTypes.DAY;
  #sourceBoardPoints = [];
  #sortedTimePoints = [];
  #sortedPricePoints = [];

  constructor(pointsContainer, pointsModel) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel; // данные для отрисовки
  }

  init = () => {
    this.#boardPoints = [...this.#pointsModel.points]; // все поинты для отрисовки из модели

    this.#sourceBoardPoints = [...this.#pointsModel.points];
    this.#sortedTimePoints = [...this.#pointsModel.points];
    this.#sortedPricePoints = [...this.#pointsModel.points];
    this.#renderPointsBoard();
  };

  #renderSort = () => {
    render(this.#sortComponent, siteContainer,RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourceBoardPoints = updateItem(this.#sourceBoardPoints, updatedPoint);
    this.#sortedTimePoints = updateItem(this.#sortedTimePoints, updatedPoint);
    this.#sortedPricePoints = updateItem(this.#sortedPricePoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handeModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortTypes.TIME:
        this.#boardPoints.sort(sortTimeUp);
        break;
      case SortTypes.PRICE:
        this.#boardPoints.sort(sortPriceUp);
        break;
      default:
        this.#boardPoints = [...this.#sourceBoardPoints].sort(sortDayUp);
        break;
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderPointsBoard = () => {
    if(this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  };
}


