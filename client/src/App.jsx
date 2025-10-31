import { useState, useRef } from 'react';
import ShakeDetector from './ShakeDetector';
import Recorder from './Recorder';
import Admin from './Admin';
import './App.css';

function App() {
  const [threatDetected, setThreatDetected] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const recorderRef = useRef();
  const [status, setStatus] = useState('Shake your phone to start recording for safety.');

  // On phone shake, trigger recording
  function handleShake(intensity) {
    setStatus(`🚨 Shake detected! (intensity: ${intensity.toFixed(2)}) - Recording started.`);
    setThreatDetected(true);
  }

  function handleRecordingComplete(blob) {
    setStatus('Recording complete. Uploading to server...');
    setThreatDetected(false);

    // Upload recording to server /upload
    (async () => {
      try {
        const fd = new FormData();
        fd.append('media', blob, `recording-${Date.now()}.webm`);
        const res = await fetch('/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (res.ok) {
          setStatus('Recording uploaded to server: ' + (json.filename || 'uploaded'));
        } else {
          setStatus('Upload failed: ' + (json.error || res.statusText));
        }
      } catch (err) {
        setStatus('Upload failed: ' + (err.message || err));
      }
    })();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Women Safety App</h2>
        <div>
          <button onClick={() => setShowAdmin(s => !s)} style={{ marginRight: 8 }}>{showAdmin ? 'Hide Admin' : 'Show Admin'}</button>
        </div>
      </div>
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
      {showAdmin && (
        <div style={{ marginTop: 24 }}>
          <Admin />
        </div>
      )}
      <div style={{margin:'32px 0',color:'#666',fontSize:14}}>
        This app will record automatically if a violent shake is detected.<br/>
        Works best as a mobile home screen shortcut or PWA.
      </div>
    </div>
  );
}
export default App;
