var newFilterName = "tiltshift";
Filter_Controller.filterNameMap[newFilterName]        = PIXI.filters.TiltShiftFilter;
Filter_Controller.defaultFilterParam[newFilterName]   = [20,700];
 
Filter_Controller.updateFilterHandler[newFilterName]  = function(filter, param) {
        filter.blur   = [param[0]];
        filter.gradientBlur = [param[1]];
};