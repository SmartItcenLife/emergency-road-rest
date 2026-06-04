import MapHospitalList from "./MapHospitalList";
import MapHospitalDetailPanel from "./MapHospitalDetailPanel.jsx"
import "./MapSidePanel.css";

function MapSidePanel({
  hospitals,
  selectedHospital,
  onSelectHospital,
  onBackToList,
  loading,
  error,
}) {
  return (
    <aside
       className={selectedHospital ? "map-side-panel detail-mode" : "map-side-panel"}>
      {selectedHospital ? (
        <MapHospitalDetailPanel
          hospital={selectedHospital}
          onBack={onBackToList}
        />
      ) : (
        <MapHospitalList
          hospitals={hospitals}
          onSelectHospital={onSelectHospital}
          loading={loading}
          error={error}
        />
      )}
    </aside>
  );
}

export default MapSidePanel;
