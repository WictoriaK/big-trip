import { render, remove, RenderPosition } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import NoPointView from '../view/no-points-view';
import TripSortView from '../view/trip-sort-view.js';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter.js';
import {sortPriceUp, sortTimeUp, filter} from '../utils.js';
import {FilterTypes, SortTypes, UpdateType, UserAction} from '../const.js';

const siteContainer = document.querySelector('.trip-events');

export default  class PointsBoardPresenter {
  #pointsContainer = null; // куда отрисовывается весь список(ul) точек на сайте
  #pointsModel = null;
  #sortComponent = null;
  #filterModel = null;

  #pointsList = new PointsListView(); // список(ul), куда отрисовывается точка машрута(li)
  #noPointsComponent = new NoPointView();


  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortTypes.DAY;

  constructor(pointsContainer, pointsModel, filterModel) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel; // данные для отрисовки
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#pointsList.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handelModelEvent);
    this.#filterModel.addObserver(this.#handelModelEvent);
  }

  init = () => {
    this.#renderPointsBoard();
  };

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortTypes.TIME:
        return filteredPoints.sort(sortTimeUp);
      case SortTypes.PRICE:
        return filteredPoints.sort(sortPriceUp);
    }

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init(callback);
  };

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, siteContainer, RenderPosition.AFTERBEGIN);
  };


  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#handleViewAction, this.#handeModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#pointsContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #handeModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;

    }
  };

  #handelModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsBoard();
        this.#renderPointsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsBoard({resetSortType: true});
        this.#renderPointsBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  #renderPointsBoard = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#pointsList, this.#pointsContainer);
    this.#renderPoints(points);
  };

  #clearPointsBoard = ({resetSortType = false} = {}) => {

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#newPointPresenter.destroy();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if(resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  };
}


