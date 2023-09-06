import JobList from '../components/JobList';

import {useJobs} from "../lib/graphql/hooks";

function HomePage() {
    const {jobs, error, loading} = useJobs();

    if (error) return <div>Data is Unavailable</div>
    if (loading) return <div>Loading...</div>
    return (
        <div>
            <h1 className="title">
                Job Board
            </h1>
            <JobList jobs={jobs}/>
        </div>
    );
}

export default HomePage;
