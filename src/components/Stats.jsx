import "../assets/styles/Stats.css";

function Stats({ attempts, time, accuracy }) {
  return (
    <div className="stats">
      <p>🧠 Attempts: {attempts}</p>
      <p>⏱ Time: {time} сек</p>
      <p>🎯 Accuracy: {accuracy}%</p>
    </div>
  );
}

export default Stats;
