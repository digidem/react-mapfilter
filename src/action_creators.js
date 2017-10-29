import {
  UPDATE_VISIBLE_FIELDS,
  UPDATE_FIELD_ORDER,
  EDIT_FEATURE,
  DELETE_FEATURE
} from './constants'

export const updateFilter = createActionCreator('UPDATE_FILTER')
export const removeFilter = createActionCreator('REMOVE_FILTER')
export const updateVisibleFilters = createActionCreator('UPDATE_VISIBLE_FILTERS')
export const updateFieldMapping = createActionCreator('UPDATE_FIELD_MAPPING')
export const changeCoordinates = createActionCreator('CHANGE_COORDINATE_FORMAT')
export const moveMap = createActionCreator('MOVE_MAP')
export const replaceFeatures = createActionCreator('REPLACE_FEATURES')
export const addFeatures = createActionCreator('ADD_FEATURES')
export const replaceMapStyle = createActionCreator('REPLACE_MAP_STYLE')
export const openSettings = createActionCreator('OPEN_SETTINGS')
export const showFeatureDetail = createActionCreator('SHOW_FEATURE_DETAIL')
export const closeModal = createActionCreator('CLOSE_MODAL')
export const switchView = createActionCreator('SWITCH_VIEW')
export const redirectView = createActionCreator('REDIRECT_VIEW')
export const updateVisibleFields = createActionCreator(UPDATE_VISIBLE_FIELDS)
export const updateFieldOrder = createActionCreator(UPDATE_FIELD_ORDER)
export const editFeature = createActionCreator(EDIT_FEATURE)
export const deleteFeature = createActionCreator(DELETE_FEATURE)
export const requestPrint = createActionCreator('REQUEST_PRINT')
export const cancelPrint = createActionCreator('CANCEL_PRINT')
export const changePaperSize = createActionCreator('CHANGE_PAPER_SIZE')
export const updateViewState = createActionCreator('UPDATE_VIEW_STATE')

function createActionCreator (type) {
  return function (payload) {
    return {type: type, payload}
  }
}
