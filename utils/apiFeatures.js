import Tour from "../models/tourModel.js";
class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'limit', 'sort', 'fields'];
      excludedFields.forEach((el) => {
        delete queryObj[el];
      });
  
      const queryStr = JSON.stringify(queryObj);
      let outputStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      // console.log("outputStr ==>",JSON.parse(outputStr));
      this.query = Tour.find(JSON.parse(outputStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
        console.log('sortBy ==>', sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skipValue = (page - 1) * limit;
  
      this.query = this.query.skip(skipValue).limit(limit);
  
      return this;
    }
  }

  export default APIFeatures;