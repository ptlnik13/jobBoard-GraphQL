import {ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache} from "@apollo/client";
import {getAccessToken} from "../auth";

const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'})
const authLink = new ApolloLink((operation, fwd) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {'Authorization': `Bearer ${accessToken}`}
        })
    }
    return fwd(operation);
})
const apolloClient = new ApolloClient({
    link : concat(authLink, httpLink),
    cache: new InMemoryCache(),
})

const jobDetailFragment = gql`
    fragment jobDetail on Job{
        id
        date
        title
        company{
            id
            name
        }
    }
`

const jobByIdQuery = gql`
    query jobs{
        jobs{
            ...jobDetail
        }
    }
    ${jobDetailFragment}
`;

export async function getJobs() {
    const query = jobByIdQuery;
    const {data: {jobs}} = await apolloClient.query({query, fetchPolicy: 'network-only'});
    return jobs;
}

export async function getJob(id) {
    const query = gql`
        query job($id: ID!) {
            job(id: $id){
                id
                date
                title
                company{
                    id
                    name
                }
                description
            }
        }
    `
    const {data: {job}} = await apolloClient.query({query, variables: {id}});
    return job;
}

export async function getCompany(id) {
    const query = gql`
        query company($id: ID!){
            company(id: $id){
                id
                name
                description
                jobs {
                    id
                    date
                    title
                    description
                }
            }
        }
    `
    const {data: {company}} = await apolloClient.query({query, variables: {id}});
    return company;
}

export async function createJob({title, description}) {
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!){
            job: createJob(input: $input){
                ...jobDetail
            }
        }
        ${jobDetailFragment}
    `;
    const {data: {job}} = await apolloClient.mutate({
        mutation,
        variables: {input: {title, description}},
        update   : (cache, result) => {
            cache.writeQuery({query: jobByIdQuery, variables: {id: result.data.job.id}, data: result.data})
        }
    })
    return job;
}
