import styles from "./FireReportPopup.module.css";

const FireReportPopup = (props) => {
  const fire = props.fire;
  const handleFindFireStations = props.handleFindFireStations;
  const fireStationNotFound = props.fireStationNotFound;

  const date = new Date(fire["Detection Time"] * 1000);
  const formattedTime = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(
    date.getUTCHours()
  ).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;

  return (
    <div>
      <h2>Fire Report</h2>
      {fire.Latitude && <p>Latitude: {fire.Latitude}</p>}
      {fire.Longitude && <p>Longitude: {fire.Longitude}</p>}
      {fire.FRP && <p>Fire Radiative Power: {fire.FRP}</p>}
      {fire.Brightness && <p>Brightness: {fire.Brightness}</p>}
      {formattedTime && <p>Detection Time: {formattedTime}</p>}
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
