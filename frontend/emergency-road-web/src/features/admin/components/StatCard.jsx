import {useState, useEffect} from "react";

function StatCard({title, number, danger}){
    const [displayNumber, setDisplayNumber] = useState(0);
    const [rolling, setRolling] = useState(false);

    useEffect(()=>{
        const targetNumber = Number(number) || 0;
        let count = 0;
        const maxCount = 5;

        setRolling(true);

        const timer = setInterval(()=>{
            count += 1;

            if(count>=maxCount){
                setDisplayNumber(targetNumber);
                setRolling(false);
                clearInterval(timer);
                return;
            }

            setDisplayNumber(Math.floor(Math.random() * (targetNumber + 10)));
        }, 40);

        return ()=>clearInterval(timer);
    }, [number]);

    return(
        <div className="card">
            <h3>{title}</h3>
            <p className={`number ${danger ? "danger" : ""} ${rolling ? "rolling" : ""}`}>
                {displayNumber}
            </p>
        </div>
    );
}

export default StatCard;