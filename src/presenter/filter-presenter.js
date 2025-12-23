import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/trip-filters-view.js';
import {filter} from '../utils.js';
import {FilterTypes, UpdateType} from '../const.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get filters() {
    const points = this.#pointsModel.points;

    return [{
      type: FilterTypes.EVERYTHING,
      name: 'Everything',
      count: filter[FilterTypes.EVERYTHING](points).length,
    },
    {
      type: FilterTypes.PAST,
      name: 'Past',
      count: filter[FilterTypes.PAST](points).length,
    },
    {
      type: FilterTypes.FUTURE,
      name: 'Future',
      count: filter[FilterTypes.FUTURE](points).length,
    }];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);


    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };


  #handleModelEvent = () => {
    this.init();
  };


  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
