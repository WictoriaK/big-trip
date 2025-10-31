import {points} from '../mock/point.js';


export default class PointsModel {
  points = points;

  getPoints = () => this.points;
}
