import React, { useEffect, useState } from 'react';
import './ContestList.css'
import Navbar from '../../header/Navbar';

const ContestList = () => {
    const mainurl = "https://codeforces.com/api/contest.list?";
    const contesturl = "https://codeforces.com/contest/";

    const [contests, setContests] = useState([]);
    const [upcoming, setUpcoming] = useState(false);

    useEffect(() => {
        fetch(mainurl)
            .then(res => res.json())
            .then(data => displayContests(data.result));
    }, []);

    const displayContests = (data) => {
        let f1 = false, f2 = false;
        const upcomingContests = [];
        const pastContests = [];

        data.forEach((contest, i) => {
            if (contest.phase === "BEFORE") {
                f1 = true;
                upcomingContests.push(makeContest(contest, i));
            }
            if (contest.phase === "FINISHED" && !f2) {
                f2 = true;
                pastContests.push(<h1 className="title--contest" key="past-title">Past Contests</h1>);
            }
            pastContests.push(makeContest(contest, i));
        });

        setUpcoming(f1);
        setContests([...upcomingContests, ...pastContests]);
    };

    const makeContest = (contest, index) => {
        const duration = formatDuration(contest.durationSeconds);
        const startTime = new Date(contest.startTimeSeconds * 1000).toString().substr(0, 25);

        return (
            <div className="contests--contest" key={index}>
                <h2 className="content--contest cont">Name: <a href={`${contesturl}${contest.id}`} target="_blank" rel="noopener noreferrer">{contest.name}</a></h2>
                <div className="content--contest">Type: {contest.type}</div>
                <div className="content--contest">Duration: {duration}</div>
                <div className="content--contest">Start Time: {startTime}</div>
                <Countdown startTime={contest.startTimeSeconds * 1000} />
            </div>
        );
    };

    const formatDuration = (seconds) => {
        const hr = Math.floor(seconds / 3600);
        const mn = Math.floor((seconds % 3600) / 60);
        const day = Math.floor(hr / 24);
        const remainingHr = hr % 24;

        let result = "";
        if (day) result += `${day}d `;
        result += `${remainingHr}hr ${mn}min`;

        return result;
    };

    return (
        <div id="main--contest">
            <Navbar />
            {upcoming &&<h1 className="title--contest" id="u--contest">Upcoming Contests</h1>}
            {contests}
        </div>
    );
};

const Countdown = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateCountdown(startTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateCountdown(startTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    if (!timeLeft) return null;

    return (
        <div className="content--contest">
            {/* <Navbar/> */}
            Before Start: {timeLeft}
        </div>
    );
};

const calculateCountdown = (startTime) => {
    const now = new Date().getTime();
    const distance = startTime - now;
    if (distance < 0) return null;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let result = "";
    if (days > 0) result += `${days}d `;
    result += `${hours}h ${minutes}m ${seconds}s`;

    return result;
};

export default ContestList;
