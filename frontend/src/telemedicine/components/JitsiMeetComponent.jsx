import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN || "meet.jit.si";
const jitsiProtocol = import.meta.env.VITE_JITSI_PROTOCOL || "https";

const JitsiMeetComponent = ({ roomName, userDisplayName, jwt, onClose, onReady }) => {
  const containerRef = useRef(null);
  const jitsiAPIRef = useRef(null);

  useEffect(() => {
    const initJitsi = async () => {
      if (!window.JitsiMeetExternalAPI) {
        // Load Jitsi SDK from CDN
        const script = document.createElement("script");
        script.src = `${jitsiProtocol}://${jitsiDomain}/external_api.js`;
        script.async = true;
        script.onload = () => startConference();
        script.onerror = () => {
          console.error("Failed to load Jitsi SDK");
          if (onClose) onClose();
        };
        document.body.appendChild(script);
      } else {
        startConference();
      }
    };

    const startConference = () => {
      if (!containerRef.current) return;

      const options = {
        roomName: roomName || "default-meeting",
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        jwt,
        userInfo: {
          displayName: userDisplayName || "Guest"
        },
        configOverwrite: {
          startAudioOnly: false,
          disableAudioLevels: true,
          enableWelcomePage: true,
          useStunTurn: true,
          prejoinPageEnabled: false,
          chromeExtensionBanner: null,
          disableThirdPartyRequests: true
        },
        interfaceConfigOverwrite: {
          DEFAULT_LANGUAGE: "en",
          SHOW_JITSI_WATERMARK: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: false,
          DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "invite",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "download",
            "help",
            "mute-everyone",
            "e2ee",
            "security"
          ]
        }
      };

      try {
        jitsiAPIRef.current = new window.JitsiMeetExternalAPI(jitsiDomain, options);

        jitsiAPIRef.current.addEventListeners({
          onConferenceEntered: () => {
            console.log("Conference entered");
            if (onReady) onReady();
          },
          onConferenceLeft: () => {
            console.log("Conference ended");
            if (onClose) onClose();
          },
          onParticipantJoined: (participant) => {
            console.log("Participant joined:", participant);
          },
          onParticipantLeft: (participant) => {
            console.log("Participant left:", participant);
          },
          onDisplayNameChange: (displayName) => {
            console.log("Display name changed to:", displayName);
          },
          onDeviceListChanged: (devices) => {
            console.log("Devices changed:", devices);
          },
          onEmailChange: (email) => {
            console.log("Email changed to:", email);
          },
          onAvatarUrlChange: (avatarUrl) => {
            console.log("Avatar URL changed to:", avatarUrl);
          },
          onVideoConferenceLeft: () => {
            console.log("User left video conference");
            if (onClose) onClose();
          },
          onAudioMuteStatusChanged: (muted) => {
            console.log("Audio muted:", muted);
          },
          onVideoMuteStatusChanged: (muted) => {
            console.log("Video muted:", muted);
          }
        });
      } catch (error) {
        console.error("Error initializing Jitsi:", error);
        if (onClose) onClose();
      }
    };

    initJitsi();

    return () => {
      if (jitsiAPIRef.current) {
        try {
          jitsiAPIRef.current.dispose();
        } catch (error) {
          console.error("Error disposing Jitsi:", error);
        }
        jitsiAPIRef.current = null;
      }
    };
  }, [roomName, userDisplayName, onReady, onClose]);

  const handleClose = () => {
    if (jitsiAPIRef.current) {
      try {
        jitsiAPIRef.current.executeCommand("hangup");
      } catch (error) {
        console.error("Error hanging up:", error);
      }
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default JitsiMeetComponent;
