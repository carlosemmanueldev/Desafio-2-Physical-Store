import { Query, Aggregate } from "mongoose";
import AppError from "./appError";

class ApiFeatures {
    public query: Query<any, any> | Aggregate<any>;
    public queryString: Record<string, any>;
    public totalPages: number;
    public totalDocuments: number;
    public currentPage: number;

    constructor(query: Query<any, any> | Aggregate<any>, queryString: Record<string, any>) {
        this.query = query;
        this.queryString = queryString;
        this.totalPages = 0;
        this.totalDocuments = 0;
        this.currentPage = 1;
    }

    async paginate() {
        this.currentPage = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 5;
        const skip = (this.currentPage - 1) * limit;

        if (this.query instanceof Query) {
            this.totalDocuments = await this.query.model.countDocuments(this.query.getQuery());
            this.totalPages = Math.ceil(this.totalDocuments / limit);

            if (this.queryString.page && skip >= this.totalDocuments) {
                throw new AppError("This page does not exist.", 404);
            }

            this.query = this.query.skip(skip).limit(limit);
        } else {
            this.query = this.query
                .facet({
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: limit }],
                })
                .addFields({
                    total: { $arrayElemAt: ["$metadata.total", 0] },
                })
                .project({ metadata: 0 });

            const result = await this.query.exec();

            this.totalDocuments = result[0]?.total || 0;
            this.totalPages = Math.ceil(this.totalDocuments / limit);

            if (this.queryString.page && skip >= this.totalDocuments) {
                throw new AppError("This page does not exist.", 404);
            }

            this.query = result[0].data || [];
        }

        return this;
    }
}

export default ApiFeatures;
