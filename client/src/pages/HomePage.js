import JobList from '../components/JobList';
import {getJobs} from "../lib/graphql/queries";
import {useEffect, useState} from "react";

function HomePage() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        async function fetchCall() {
            const jobs = await getJobs();
            setJobs(jobs);
        }
        fetchCall();
    }, []);

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
