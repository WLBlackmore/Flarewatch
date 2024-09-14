
const FireStationPopup = (props) => {
    const fireStation = props.fireStation;
    
    const buildAddress = (fireStation) => {
        let address = "";

        // Start building the address
        address += fireStation["addr:housenumber"] + " " + fireStation["addr:street"];

        if (fireStation["addr:city"]){
            address += ", " + fireStation["addr:city"];
        }

        if (fireStation["addr:state"]){
            address += ", " + fireStation["addr:state"];
        } else if (fireStation["addr:province"]){
            address += ", " + fireStation["addr:province"];
        }

        return address;

    }
    return (
        <div>
            <h2>Fire Station</h2>
            <p>Latitude: {fireStation.latitude}</p>
            <p>Longitude: {fireStation.longitude}</p>
            {fireStation.official_name && <p>Name: {fireStation.official_name}</p>}
            {!fireStation.official_name && fireStation.name && <p>Name: {fireStation.name}</p>}
            {fireStation["addr:housenumber"] && fireStation["addr:street"] && <p>Address: {buildAddress(fireStation)}</p>}
            {fireStation.phone && <p>Phone: {fireStation.phone}</p>}
            {fireStation.operator && <p>Operator: {fireStation.operator}</p>}
        </div>
    );
}

export default FireStationPopup;