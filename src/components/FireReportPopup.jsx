import styles from "./FireReportPopup.module.css";

const FireReportPopup = (props) => {
  const fire = props.fire;
  const handleFindFireStations = props.handleFindFireStations;
  const fireStationNotFound = props.fireStationNotFound;

  // If satellite 
  const date = new Date(fire["Detection Time"] * 1000);
  const formattedTime = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(
    date.getUTCHours()
  ).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;

  // If user reported
  const userDate = new Date(fire.created_at);
  const year = userDate.getUTCFullYear();
  const month = String(userDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(userDate.getUTCDate()).padStart(2, "0");
  const hours = String(userDate.getUTCHours()).padStart(2, "0");
  const minutes = String(userDate.getUTCMinutes()).padStart(2, "0");

  const formattedUserDate = `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  

  return (
    <div>
      <h2>Fire Report</h2>
      {/* Satellite reported fire */}
      {fire.Latitude && <p>Latitude: {fire.Latitude}</p>}
      {fire.Longitude && <p>Longitude: {fire.Longitude}</p>}
      {fire.FRP && <p>Fire Radiative Power: {fire.FRP}</p>}
      {fire.Brightness && <p>Brightness: {fire.Brightness}</p>}
      {fire["Detection Time"] && <p>Detection Time: {formattedTime}</p>}
      {fire.Sensor && <p>Satellite: {fire.Sensor}</p>}
      {(fire.Confidence || fire["Confidence [0-100%]"]) && (
        <p>Confidence: {fire["Confidence [0-100%]"] ?? fire.Confidence}</p>
      )}
      {fire.Scan && fire.Track && (
        <p>
          Scan Dimension: {fire.Scan} x {fire.Track}
        </p>
      )}
      {fire["WRS-2 Path"] && <p>WRS-2 Path: {fire["WRS-2 Path"]}</p>}
      {fire["WRS-2 Row"] && <p>WRS-2 Row: {fire["WRS-2 Row"]}</p>}
      
      {/* User reported fire */}
      {fire.latitude && <p>Latitude: {fire.latitude}</p>}
      {fire.longitude && <p>Longitude: {fire.longitude}</p>}
      {fire.severity && <p>Severity: {fire.severity}</p>}
      {fire.created_at && <p>Reported at: {formattedUserDate}</p>}
      {fire.description && <p>Description: {fire.description}</p>}
      {fire.phone_number && <p>Phone Number: {fire.phone_number}</p>}
      {fireStationNotFound ? (
        <p className={styles.notFound}>{fireStationNotFound}</p>
      ) : (
        <div className={styles.popupButtonContainer}>
          <button
            className={styles.stationButton}
            onClick={handleFindFireStations}
          >
            Find nearest fire stations
          </button>
        </div>
      )}
    </div>
  );
};

export default FireReportPopup;
