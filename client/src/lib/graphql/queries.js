import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {GraphQLClient} from "graphql-request";
import {getAccessToken} from "../auth";

const client = new GraphQLClient('http://localhost:9000/graphql', {
    headers: () => {
        const accessToken = getAccessToken();
        if (accessToken) {
            return {'Authorization': `Bearer ${accessToken}`};
        }
        return {};
    }
});

const apolloClient = new ApolloClient({
    uri  : 'http://localhost:9000/graphql',
    cache: new InMemoryCache(),
})

export async function getJobs() {
    const query = gql`
        query jobs{
            jobs{
                id
                date
                title
                company{
                    id
                    name
                }
            }
        }
    `
    // const {jobs} = await client.request(query)
    const {data: {jobs}} = await apolloClient.query({query});
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
                id
            }
        }
    `;
    const {job} = await client.request(mutation, {input: {title, description}}, /*{'Authorization':'Bearer TOKEN'}*/) // You can pass into here as 3rd arg.
    return job
}
