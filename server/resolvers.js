import {createJob, getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql";

export const resolvers = {
    Query   : {
        job    : async (_root, {id}) => {
            const job = await getJob(id)
            if (!job) throw notFoundError(`No Job found with id ${id}`);
            return job;
        },
        jobs   : () => getJobs(),
        company: async (__root, {id}) => {
            const company = await getCompany(id)
            if (!company) throw notFoundError(`No Company found with id ${id}`);
            return company;
        }
    },
    Mutation: {
        createJob: (_root, {input: {title, description}}) => createJob({title, description, companyId: 'FjcJCHJALA4i'})
    },
    Job     : {
        title  : (job) => job.title,
        date   : (job) => toIsoDate(job.createdAt),
        company: ({companyId}) => getCompany(companyId)
    },
    Company : {
        jobs: (company) => getJobsByCompany(company.id)
    }
}

function notFoundError(message) {
    return new GraphQLError(message,
        {extensions: {code: 'NOT_FOUND'}})
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}
