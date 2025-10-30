import { useRef, useState } from 'react';

export default function Recorder({ autoStart = false, onRecordingComplete }) {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    setError(null);
    setMediaUrl(null);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      const mediaRecorder = new MediaRecorder(userStream);
      recorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        if (onRecordingComplete) onRecordingComplete(blob);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      setError('Could not start camera/mic: ' + err.message);
    }
  }

  function stopRecording() {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
      setRecording(false);
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
  }

  return (
    <div style={{ textAlign: 'center', margin: 12 }}>
      <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxWidth: 320, borderRadius: 8, background: '#222' }} />
      <div>
        {!recording && <button onClick={startRecording}>Start Recording</button>}
        {recording && <button onClick={stopRecording}>Stop Recording</button>}
      </div>
      {mediaUrl && (
        <div>
          <p>Recording complete:</p>
          <video src={mediaUrl} controls style={{ width: '100%', maxWidth: 320 }} />
          <a href={mediaUrl} download={`safety-recording-${Date.now()}.webm`}>
            Download Video
          </a>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
