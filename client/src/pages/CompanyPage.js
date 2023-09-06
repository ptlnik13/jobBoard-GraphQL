import {useParams} from 'react-router';
import JobList from "../components/JobList";
import {useCompany} from "../lib/graphql/hooks";


function CompanyPage() {
    const {companyId} = useParams();
    const {companyById, loading, error} = useCompany(companyId);
    if (error) return <div>Data is Unavailable</div>
    if (loading) return <div>Loading...</div>

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
