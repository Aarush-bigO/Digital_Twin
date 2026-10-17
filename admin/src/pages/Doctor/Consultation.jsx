import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Consultation() {
  const { appointmentId } = useParams();

  const pendingCandidatesRef = useRef([]);
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const bottomRef = useRef(null);
  const inCallRef = useRef(false);

  const [status, setStatus] = useState("Connecting...");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [canChat, setCanChat] = useState(false);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [incomingCall, setIncomingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const myRole = "doctor";

  // Keep a ref synchronized with the latest call state.
  useEffect(() => {
    inCallRef.current = inCall;
  }, [inCall]);

  // ================= END CALL / CLEANUP =================
  const notifyLeaving = () => {
    if (!socketRef.current || !appointmentId || !inCallRef.current) {
      return;
    }

    socketRef.current.emit("webrtc-end-call", {
      appointmentId,
      reason: "peer-left",
    });
  };

  const cleanupCall = () => {
    if (!inCallRef.current && !pcRef.current && !localStreamRef.current) {
      return;
    }

    console.log("Cleaning call");

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingCandidatesRef.current = [];

    inCallRef.current = false;
    setInCall(false);
    setIncomingCall(false);
    setIncomingOffer(null);
    setMicOn(true);
    setCamOn(true);
    setStatus("Call ended");
  };

  // ================= JOIN ROOM =================
  const joinRoom = (socket) => {
    const token =
      localStorage.getItem("dToken") || localStorage.getItem("token");

    socket.emit("join-room", { appointmentId, token });

    socket.on("chat-history", (history) => {
      const formatted = history.map((message) => ({
        from: message.sender,
        message: message.text,
      }));

      setMessages(formatted);
      setCanChat(true);
      setStatus("Connected");
    });

    socket.on("chat-message", (message) => {
      setMessages((previous) => [...previous, message]);
    });

    socket.on("call-blocked", ({ reason }) => {
      const messages = {
        TOO_EARLY: "Consultation not started yet",
        EXPIRED: "Consultation time is over",
        APPOINTMENT_INACTIVE: "Appointment cancelled or completed",
        INVALID_SLOT_DATA: "Server time error",
      };

      alert(messages[reason] || reason || "Call blocked");
      setStatus("Consultation unavailable");
    });

    socket.on("webrtc-offer", ({ offer }) => {
      console.log("OFFER RECEIVED BY DOCTOR");
      setIncomingOffer(offer);
      setIncomingCall(true);
      setStatus("Incoming patient call...");
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      try {
        if (!pcRef.current) return;

        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      } catch (error) {
        console.error("Error setting remote answer:", error);
      }
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        if (!pcRef.current || !pcRef.current.remoteDescription) {
          pendingCandidatesRef.current.push(candidate);
          return;
        }

        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    });

    socket.on("webrtc-end-call", ({ reason }) => {
      if (!inCallRef.current) return;

      const messageMap = {
        "peer-left": "Patient left the consultation",
        disconnect: "Patient connection lost",
        manual: "Call ended",
      };

      alert(messageMap[reason] || "Call ended");
      cleanupCall();
    });
  };

  // ================= SOCKET CONNECTION =================
  useEffect(() => {
    if (!appointmentId) {
      setStatus("Invalid consultation link");
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is not configured");
      setStatus("Server configuration error");
      return;
    }

    const socket = io(backendUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED");
      setStatus("Joining consultation room...");
      joinRoom(socket);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setStatus("Unable to connect to server");
    });

    socket.on("disconnect", (reason) => {
      console.log("SOCKET DISCONNECTED:", reason);
      setStatus("Connection lost. Reconnecting...");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      cleanupCall();
    };
  }, [appointmentId]);

  // ================= PEER CONNECTION =================
  const createPeerConnection = () => {
    console.log("DOCTOR creating PeerConnection");

    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    pc.ontrack = (event) => {
      console.log("DOCTOR RECEIVED REMOTE TRACK");

      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("webrtc-ice-candidate", {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ================= MEDIA =================
  const startMedia = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera and microphone access is not supported.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    return stream;
  };

  // ================= MEDIA CONTROLS =================
  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setCamOn(videoTrack.enabled);
  };

  // ================= ACCEPT CALL =================
  const acceptCall = async () => {
    try {
      if (!incomingOffer) {
        setStatus("No incoming call offer found");
        return;
      }

      setIncomingCall(false);
      setStatus("Starting camera and microphone...");

      const stream = await startMedia();
      const pc = createPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));

      for (const candidate of pendingCandidatesRef.current) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Queued ICE candidate error:", error);
        }
      }

      pendingCandidatesRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (!socketRef.current) {
        throw new Error("Socket connection is unavailable.");
      }

      socketRef.current.emit("webrtc-answer", {
        appointmentId,
        answer,
      });

      inCallRef.current = true;
      setInCall(true);
      setStatus("In call");
    } catch (error) {
      console.error("Unable to accept call:", error);

      alert(
        error.name === "NotAllowedError"
          ? "Camera or microphone permission was denied. Please allow access and try again."
          : error.message || "Unable to start the call.",
      );

      cleanupCall();
      setStatus("Unable to start call");
    }
  };

  // ================= END CALL =================
  const endCall = () => {
    notifyLeaving();
    cleanupCall();
  };

  // ================= LEAVING THE PAGE =================
  useEffect(() => {
    const handleUnload = () => {
      if (!socketRef.current || !appointmentId || !inCallRef.current) {
        return;
      }

      socketRef.current.emit("webrtc-end-call", {
        appointmentId,
        reason: "peer-left",
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      notifyLeaving();
    };
  }, [appointmentId]);

  // ================= CHAT =================
  const sendMessage = () => {
    const message = text.trim();

    if (!message || !socketRef.current || !canChat) return;

    socketRef.current.emit("chat-message", {
      message,
    });

    setText("");
  };

  // FIX: use braces so the effect does not implicitly return a value.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ================= UI =================
  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      {/* VIDEO STAGE */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Local preview */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-4 right-4 w-40 h-28 rounded-xl border border-white object-cover bg-black shadow-lg"
        />

        {/* Status */}
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-sm">
          {status}
        </div>

        {/* Incoming call */}
        {incomingCall && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white text-black p-8 rounded-2xl flex flex-col items-center gap-4">
              <p className="text-xl font-semibold">Patient is calling...</p>

              <button
                onClick={acceptCall}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Accept Call
              </button>
            </div>
          </div>
        )}

        {/* Call controls */}
        {inCall && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-full ${
                micOn ? "bg-gray-700" : "bg-yellow-500"
              }`}
            >
              {micOn ? "Mute" : "Unmute"}
            </button>

            <button
              onClick={toggleCamera}
              className={`px-4 py-2 rounded-full ${
                camOn ? "bg-gray-700" : "bg-yellow-500"
              }`}
            >
              {camOn ? "Camera Off" : "Camera On"}
            </button>

            <button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full"
            >
              End
            </button>
          </div>
        )}
      </div>

      {/* CHAT & TWIN PANEL */}
      <div className="h-[38%] bg-white text-black flex flex-col rounded-t-2xl shadow-2xl">
        {/* Header Tabs */}
        <div className="p-2 border-b flex items-center justify-between px-4 bg-gray-50 rounded-t-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                activeTab === "chat"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              💬 Consultation Chat
            </button>
            <button
              onClick={() => setActiveTab("twin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                activeTab === "twin"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🧬 Patient Digital Twin
            </button>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            Clinical Telemetry
          </span>
        </div>

        {activeTab === "chat" ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.from === myRole ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-[75%] text-xs leading-relaxed ${
                      message.from === myRole
                        ? "bg-green-600 text-white"
                        : message.message?.startsWith("[🧬")
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Message input */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                disabled={!canChat}
                className="flex-1 border rounded-lg px-3 py-2 outline-none disabled:bg-gray-100 text-sm"
                placeholder={canChat ? "Type message..." : "Connecting to chat..."}
              />

              <button
                onClick={sendMessage}
                disabled={!canChat || !text.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 rounded-lg text-sm cursor-pointer"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          /* DIGITAL TWIN CLINICAL REVIEW PANEL */
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 text-xs">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Patient Physiological Twin & Intervention Model
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Live telemetry transmitted during active appointment
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                  Twin Synchronized
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-gray-800 text-xs">138 / 88 mmHg</span>
                  <span className="block text-[10px] text-amber-600 font-medium">Stage 1 Hypertensive</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Glycemic Profile</span>
                  <span className="font-bold text-gray-800 text-xs">HbA1c: 6.2%</span>
                  <span className="block text-[10px] text-amber-600 font-medium">Pre-Diabetic Risk</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Lipid Markers</span>
                  <span className="font-bold text-gray-800 text-xs">Chol: 218 mg/dL</span>
                  <span className="block text-[10px] text-gray-500">HDL: 42 mg/dL</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Biological Twin Score</span>
                  <span className="font-bold text-primary text-xs">68 / 100</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">Sim: 84 / 100</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950">
                <span className="font-bold text-emerald-900 block text-xs">
                  🔮 Counterfactual "What-If" Simulation Projections:
                </span>
                <p className="mt-1 text-[11px] leading-relaxed">
                  With simulated daily physical activity (+30 mins) and medication adherence (90%), the patient's 5-year cardiovascular event risk drops from <strong>14.8%</strong> to <strong>7.2%</strong> (-51% reduction), with projected systolic BP normalization to <strong>124 mmHg</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Consultation;
