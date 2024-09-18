import styles from "./FireReportPopup.module.css";

const FireReportPopup = (props) => {
  const fire = props.fire;
  const handleFindFireStations = props.handleFindFireStations;

  const date = new Date(fire["Detection Time"] * 1000);
  const formattedTime = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(
    date.getUTCHours()
  ).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;

  return (
    <div>
      <h2>Fire Report</h2>
      <p>Latitude: {fire.Latitude}</p>
      <p>Longitude: {fire.Longitude}</p>
      <p>Fire Radiative Power: {fire.FRP}</p>
      <p>Brightness: {fire.Brightness}</p>
      <p>Detection Time: {formattedTime}</p>
      <p>Satellite: {fire.Sensor}</p>
      <p>Confidence: {fire.Confidence}</p>
      <p>
        Scan Dimension: {fire.Scan} x {fire.Track}
      </p>
      <div className={styles.popupButtonContainer}>
        <button
          className={styles.stationButton}
          onClick={handleFindFireStations}
        >
          Find nearest fire stations
        </button>
      </div>
    </div>
  );
};

export default FireReportPopup;
