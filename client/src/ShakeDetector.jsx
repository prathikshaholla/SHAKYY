import { useEffect } from 'react';

export default function ShakeDetector({ threshold = 15, timeout = 2000, onShake }) {
  useEffect(() => {
    let lastShakeTime = 0;
    let permissionGranted = false;

    async function requestMotionPermission() {
      if (
        window.DeviceMotionEvent &&
        typeof window.DeviceMotionEvent.requestPermission === 'function'
      ) {
        try {
          const resp = await window.DeviceMotionEvent.requestPermission();
          permissionGranted = resp === 'granted';
        } catch (err) {
          // ignore
        }
      } else {
        permissionGranted = true; // non-iOS
      }
    }

    requestMotionPermission().then(() => {
      if (permissionGranted) {
        window.addEventListener('devicemotion', handleMotion);
      }
    });

    function handleMotion(event) {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      if (x == null || y == null || z == null) return;
      const total = Math.sqrt(x * x + y * y + z * z);
      if (total > threshold) {
        const now = Date.now();
        if (now - lastShakeTime > timeout) {
          lastShakeTime = now;
          if (typeof onShake === 'function') onShake(total);
        }
      }
    }
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [threshold, timeout, onShake]);
  return null; // This is a non-visual sensor
}
