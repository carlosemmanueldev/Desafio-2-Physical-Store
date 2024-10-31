import {Query} from "mongoose";
import AppError from "./appError";

class ApiFeatures {
    public query: Query<any, any>;
    public queryString: Record<string, any>;
    public totalPages: number;
    public totalDocuments: number;
    public currentPage: number;

    constructor(query: Query<any, any>, queryString: Record<string, any>) {
        this.query = query;
        this.queryString = queryString;
        this.totalPages = 0;
        this.totalDocuments = 0;
        this.currentPage = 1;
    }

    async paginate() {
        this.currentPage = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 1;
        const skip = (this.currentPage - 1) * limit;

        this.totalDocuments = await this.query.model.estimatedDocumentCount(this.query.getQuery());
        this.totalPages = Math.ceil(this.totalDocuments / limit);

        if (this.queryString.page) {
            if (skip >= this.totalDocuments) {
                throw new AppError('This page does not exist.', 404);
            }
        }

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default ApiFeatures;