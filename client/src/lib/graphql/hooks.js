import {useMutation, useQuery} from "@apollo/client";
import {companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery} from "./queries";

export function useCompany(id) {
    const {data, loading, error} = useQuery(companyByIdQuery, {variables: {id: id}})
    return {companyById: data?.companyById, loading, error: Boolean(error)}
}

export function useJob(id) {
    const {data, loading, error} = useQuery(jobByIdQuery, {variables: {id}})
    return {job: data?.job, loading, error: Boolean(error)}
}

export function useJobs() {
    const {data, loading, error} = useQuery(jobsQuery, {fetchPolicy: 'network-only'})
    return {jobs: data?.jobs, loading, error: Boolean(error)};
}


export function useCreateJob() {
    const [mutate, {loading}] = useMutation(createJobMutation);
    const createJob = async (title, description) => {
        const {data: {job}} = await mutate({
            variables: {input: {title, description}}, update: (cache, result) => {
                cache.writeQuery({query: jobsQuery, variables: {id: result.data.job.id}, data: result.data})
            }
        })
        return job;
    }

    return {createJob, loading};
}
