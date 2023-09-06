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
export const apolloClient = new ApolloClient({
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

export const jobsQuery = gql`
    query jobs{
        jobs{
            ...jobDetail
        }
    }
    ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
    query companyById($id: ID!){
        companyById(id: $id){
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

export const jobByIdQuery = gql`
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
            cache.writeQuery({query: jobsQuery, variables: {id: result.data.job.id}, data: result.data})
        }
    })
    return job;
}
