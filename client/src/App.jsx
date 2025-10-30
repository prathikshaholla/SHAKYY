import { useState, useRef } from 'react';
import ShakeDetector from './ShakeDetector';
import Recorder from './Recorder';
import './App.css';

function App() {
  const [threatDetected, setThreatDetected] = useState(false);
  const recorderRef = useRef();
  const [status, setStatus] = useState('Shake your phone to start recording for safety.');

  // On phone shake, trigger recording
  function handleShake(intensity) {
    setStatus(`🚨 Shake detected! (intensity: ${intensity.toFixed(2)}) - Recording started.`);
    setThreatDetected(true);
  }

  function handleRecordingComplete(blob) {
    setStatus('Recording complete. Saved locally.');
    setThreatDetected(false);
    // Optionally: upload to backend here
  }

  return (
    <div>
      <h2>Women Safety App</h2>
      <div style={{ margin: 12, fontSize: 18, color: threatDetected ? 'red' : '#222', minHeight: 36 }}>{status}</div>
      <ShakeDetector threshold={15} timeout={2000} onShake={handleShake} />
      <Recorder
        ref={recorderRef}
        autoStart={threatDetected}
        onRecordingComplete={handleRecordingComplete}
      />
      {!threatDetected && (
        <button style={{ marginTop: 16 }} onClick={() => setThreatDetected(true)}>
          Test Camera/Mic Recording
        </button>
      )}
      <div style={{margin:'32px 0',color:'#666',fontSize:14}}>
        This app will record automatically if a violent shake is detected.<br/>
        Works best as a mobile home screen shortcut or PWA.
      </div>
    </div>
  );
}
export default App;
