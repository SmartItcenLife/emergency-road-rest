function StatCard({title, number, danger}){
    return(
        <div className="card">
            <h3>{title}</h3>
            <p className={danger ? "number danger" : "number"}>{number}</p>
        </div>
    );
}

export default StatCard;