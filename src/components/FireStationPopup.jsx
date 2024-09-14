
const FireStationPopup = (props) => {
    const fireStation = props.fireStation;
    return (
        <div>
            <h2>Fire Station</h2>
            <p>Latitude {fireStation.latitude}</p>
            <p>Longitude {fireStation.longitude}</p>
            {fireStation.name && <p>Name {fireStation.name}</p>}
        </div>
    );
}

export default FireStationPopup;