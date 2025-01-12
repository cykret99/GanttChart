// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import $ from "jquery";

import './style.css'
import * as createjs from '@createjs/easeljs/dist/easeljs-NEXT.js'

import StageBase from './js/canvas/stage/StageBase.ts'
import DrowContainerBase from './js/canvas/drowObject/base/DrowContainerBase.ts'
import DrowSimpleTable from './js/canvas/drowObject/DrowSimpleTable.ts'
import DateUtils from './js/util/DateUtils.ts'
import Utils from './js/util/Utils.ts'

import GanttChartView from './js/canvas/view/GanttChartView.ts'
import HomeView from './js/canvas/view/HomeView.ts';
import MenuView from './js/canvas/view/MenuView.ts';

import RestAPI from './js/rest/RestAPI.ts'
import DrowButtonBase from './js/canvas/drowObject/base/DrowButtonBase.ts';

window.StageBase = StageBase;
window.DrowContainerBase = DrowContainerBase;
window.DrowSimpleTable = DrowSimpleTable;
window.DateUtils = DateUtils;
window.Utils = Utils;

window.GanttChartView = GanttChartView;
window.HomeView = HomeView;
window.MenuView = MenuView;

window.RestAPI = RestAPI;
window.DrowButtonBase = DrowButtonBase;
