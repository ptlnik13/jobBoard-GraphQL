import {createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
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
        createJob: (_root, {input: {title, description}}, {user}) => {
            if (!user) {
                throw unAuthorizedError('Missing authentication')
            }
            return createJob({
                title, description, companyId: user.companyId
            })
        },
        deleteJob: async (_root, {id}, {user}) => {
            if (!user) {
                throw unAuthorizedError('Missing Authentication')
            }
            //getJob
            const job = await deleteJob(id, user.companyId);
            // Check that job.companyId === user.companyId
            if (!job) {
                throw notFoundError(`No Job found with ID: ${id}`);
            }
            return job;
        },
        updateJob: async (_root, {id, input: {title, description}}, {user}) => {
            if (!user) {
                throw unAuthorizedError('Missing Authentication');
            }
            const job = await updateJob({id, title, description, companyId: user.companyId})
            if (!job) {
                throw notFoundError(`No Job found with ID: ${id}`);
            }
            return job;
        }
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

function unAuthorizedError(message) {
    return new GraphQLError(message,
        {extensions: {code: 'UNAUTHORIZED'}})
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}
