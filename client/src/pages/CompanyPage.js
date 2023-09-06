import {useParams} from 'react-router';
import {companyByIdQuery} from "../lib/graphql/queries";
import JobList from "../components/JobList";
import {useQuery} from "@apollo/client";


function CompanyPage() {
    const {companyId} = useParams();
    const {data, loading, error} = useQuery(companyByIdQuery, {variables: {id: companyId}})

    if (error) return <div>Data is Unavailable</div>
    if (loading) return <div>Loading...</div>
    const {companyById} = data;

    return (
        <div>
            <h1 className="title">
                {companyById.name}
            </h1>
            <div className="box">
                {companyById.description}
            </div>

            <h2 className='title is-5'>Jobs at {companyById.name}</h2>
            <JobList jobs={companyById.jobs}/>
        </div>
    );
}

export default CompanyPage;
