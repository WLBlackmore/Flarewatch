import styles from "./FireReportPopup.module.css";

const FireReportPopup = (props) => {
    const fire = props.fire;
    const handleFindFireStations = props.handleFindFireStations;
  return (
    <div>
      <h2>Fire Report</h2>
      <p>Latitude: {fire.Latitude}</p>
      <p>Longitude: {fire.Longitude}</p>
      <p>Fire Radiative Power: {fire.FRP}</p>
      <p>Brightness: {fire.Brightness}</p>
      <p>Detection Time: {fire["Detection Time"]}</p>
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