import {getJob, getJobs} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
    Query: {
        job    : (_root, {id}) => getJob(id),
        jobs   : () => getJobs(),
        company: (__root, {id}) => getCompany(id)
    },
    Job  : {
        title  : (job) => job.title,
        date   : (job) => toIsoDate(job.createdAt),
        company: ({companyId}) => getCompany(companyId)
    }
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}
