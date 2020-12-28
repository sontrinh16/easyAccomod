exports.getFilter = (body) => {
    let filter = {};
    if (body.address){
        filter.postFilter.address = body.address;
    }
    if (body.minPrice){
        filter.rangeFilter.minPrice = body.minPrice;
    }
    if (body.maxPrice){
        filter.rangeFilter.maxPrice = body.maxPrice;
    }
    if (body.type){
        filter.postFilter.type = body.type;
    }
    if (body.minArea){
        filter.rangeFilter.minArea = body.minArea; 
    }
    if (body.maxArea){
        filter.rangeFilter.maxArea = body.maxArea;
    }
    if (body.services){
        filter.roomFilter.services.$all = body.service;
    }
    return filter;
}