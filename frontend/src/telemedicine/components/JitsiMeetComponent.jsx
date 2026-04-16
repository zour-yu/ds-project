import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN || "meet.jit.si";
const jitsiProtocol = import.meta.env.VITE_JITSI_PROTOCOL || "https";

export default function JitsiMeetComponent({ roomName, userDisplayName, jwt, onClose, onReady }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const loadJitsi = () => {
      if (!containerRef.current) return;

      const startConference = () => {
        if (!window.JitsiMeetExternalAPI || !containerRef.current) return;

        apiRef.current = new window.JitsiMeetExternalAPI(jitsiDomain, {
          roomName: roomName || "default-room",
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          jwt,
          userInfo: {
            displayName: userDisplayName || "Guest"
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            startAudioOnly: false,
            disableThirdPartyRequests: true
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            MOBILE_APP_PROMO: false,
            DEFAULT_REMOTE_DISPLAY_NAME: "Participant"
          }
        });

        apiRef.current.addEventListener("videoConferenceJoined", () => {
          if (onReady) onReady();
        });

        apiRef.current.addEventListener("videoConferenceLeft", () => {
          if (onClose) onClose();
        });
      };

      if (window.JitsiMeetExternalAPI) {
        startConference();
        return;
      }

      const script = document.createElement("script");
      script.src = `${jitsiProtocol}://${jitsiDomain}/external_api.js`;
      script.async = true;
      script.onload = startConference;
      script.onerror = () => {
        console.error("Failed to load Jitsi SDK");
        if (onClose) onClose();
      };
      document.body.appendChild(script);
    };

    loadJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [jwt, onClose, onReady, roomName, userDisplayName]);

  const handleClose = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hangup");
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} className="h-full w-full" />
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 z-50 rounded-full bg-red-600 p-3 text-white shadow-lg transition hover:bg-red-700"
        aria-label="Close call"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
