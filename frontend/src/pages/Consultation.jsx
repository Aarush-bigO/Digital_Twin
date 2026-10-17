import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
function Consultation() {
  const { appointmentId } = useParams();

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const bottomRef = useRef(null);
 const callBlockedRef = useRef(false);
  // chat
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [savedTwin] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("patient_digital_twin")) || {
          vitals: { systolicBP: 138, diastolicBP: 88, hba1c: 6.2, fastingGlucose: 114, totalCholesterol: 218 },
          twinMetrics: { baselineScore: 68, biologicalAge: 43, baselineCvRisk: 14.8, simulatedCvRisk: 7.2, riskReductionPct: 51 },
        }
      );
    } catch (e) {
      return null;
    }
  });

  const [status, setStatus] = useState("Connecting...");
  const [inCall, setInCall] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
const [camOn, setCamOn] = useState(true);
  // ================= SOCKET =================
  useEffect(() => {
  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  // ---------- LISTENERS FIRST ----------
 socket.on("room-ready", ({ peerReady }) => {
  console.log("ROOM STATE:", peerReady);

  setPeerReady(peerReady);

  if (peerReady)
    setStatus("Doctor available");
  else
    setStatus("Waiting for doctor...");
});

  socket.on("chat-history", (history) => {
    const formatted = history.map((m) => ({
      from: m.sender,
      message: m.text,
    }));
    setMessages(formatted);
    setCanChat(true);
  });

  socket.on("chat-message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  socket.on("webrtc-end-call", ({ reason }) => {
    if (!inCall) return;
    toast.info("Call ended");
    endCallLocal();
  });

  // ---------- THEN CONNECT ----------
  socket.on("connect", () => {
    console.log("CONNECTED:", socket.id);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("dToken");

    socket.emit("join-room", { appointmentId, token });
  });

  return () => socket.disconnect();
}, [appointmentId]);

  // ================= PEER =================
  const createPeer = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("webrtc-ice-candidate", {
          appointmentId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ================= MEDIA =================
  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
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

  // ================= START CALL =================
  const startCall = async () => {
    if (callBlockedRef.current) {
    toast.info("Please wait before retrying");
    return;
  }

     if (!peerReady) {
    toast.info("Doctor is not in consultation room yet");
    return;
  }
  callBlockedRef.current = true;
  try{
    const stream = await startMedia();
    const pc = createPeer();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit("webrtc-offer", {
      appointmentId,
      offer,
    });

    setInCall(true);}
    catch (err) {
    callBlockedRef.current = false;
  }
  };
  // adding universal hendler
  const notifyLeaving = () => {
  if (!socketRef.current || !appointmentId) return;

  socketRef.current.emit("webrtc-end-call", {
    appointmentId,
    reason: "peer-left"
  });
};

useEffect(() => {
  const handleUnload = () => {
    notifyLeaving();
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
    notifyLeaving(); // also fires on route change
  };
}, [appointmentId]);

  // ================= END CALL =================
  const endCallLocal = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setInCall(false);
  };

 const endCall = () => {
  notifyLeaving();
  endCallLocal();
};

  // ================= JOIN ROOM =================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !appointmentId) return;

    const token = localStorage.getItem("token") || localStorage.getItem("dToken");
    if (!token) return;



    

   
// call blocked 
socket.off("call-blocked");

socket.on("call-blocked", ({ reason }) => {

  if (callBlockedRef.current === "shown") return; // HARD GUARD
  callBlockedRef.current = "shown";

  const messages = {
    TOO_EARLY: "⏰ Consultation hasn't started yet",
    EXPIRED: "🕒 Consultation time is over",
    APPOINTMENT_INACTIVE: "❌ Appointment cancelled or completed",
    INVALID_SLOT_DATA: "⚠️ Server time configuration error"
  };

  toast.error(messages[reason] || "Call not allowed");

  endCallLocal?.();

  // allow retry after cooldown
  setTimeout(() => {
    callBlockedRef.current = false;
  }, 4000);
});

    // ===== OFFER RECEIVED =====
    socket.on("webrtc-offer", async ({ offer }) => {
      const stream = await startMedia();
      const pc = createPeer();

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { appointmentId, answer });
      setInCall(true);
    });

    // ===== ANSWER RECEIVED =====
    socket.on("webrtc-answer", async ({ answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // ===== ICE RECEIVED =====
    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    });

    // ===== CALL ENDED =====
    socket.on("webrtc-end-call", ({ reason }) => {

  if (!inCall) return;

  const msgMap = {
    "peer-left": "Other participant left the consultation",
    "disconnect": "Connection lost",
    "manual": "Call ended"
  };

  toast.info(msgMap[reason] || "Call ended");

  endCallLocal();
});

    return () => {
      socket.off("room-ready");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("webrtc-end-call");
      socket.off("call-blocked");
    };
  }, [appointmentId]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current.emit("chat-message", { message: text });
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const shareTwinTelemetry = () => {
    if (!savedTwin || !socketRef.current || !canChat) return;
    const { vitals, twinMetrics } = savedTwin;
    const message = `[🧬 Patient Digital Twin Telemetry]: BP: ${vitals?.systolicBP || 138}/${vitals?.diastolicBP || 88} mmHg | Fasting Sugar: ${vitals?.fastingGlucose || 114} mg/dL | HbA1c: ${vitals?.hba1c || 6.2}% | 5-Yr Risk: ${twinMetrics?.baselineCvRisk || 14.8}% (Simulated: ${twinMetrics?.simulatedCvRisk || 7.2}% -${twinMetrics?.riskReductionPct || 51}% reduction)`;
    socketRef.current.emit("chat-message", { message });
    toast.success("Digital Twin Telemetry shared with Doctor!");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6 bg-gray-50 min-h-screen">
      {/* STATUS */}
      <h2 className="text-xl font-semibold text-gray-800">{status}</h2>

      {/* VIDEOS */}
      <div className="flex gap-6 flex-wrap justify-center">
        {/* Remote */}
        <div className="relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[380px] h-[280px] bg-black rounded-lg object-cover shadow"
          />
          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Doctor
          </span>
        </div>

        {/* Local */}
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-[380px] h-[280px] bg-black rounded-lg object-cover shadow"
          />
          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            You (Patient)
          </span>
        </div>
      </div>

      {/* CONTROLS */}
      {!inCall ? (
        <button
          onClick={startCall}
          className={`px-5 py-2 rounded text-white ${peerReady ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Start Call
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded text-white ${micOn ? "bg-gray-700" : "bg-yellow-500"}`}
            >
              {micOn ? "Mute Mic" : "Unmute Mic"}
            </button>

            <button
              onClick={toggleCamera}
              className={`px-4 py-2 rounded text-white ${camOn ? "bg-gray-700" : "bg-yellow-500"}`}
            >
              {camOn ? "Turn Camera Off" : "Turn Camera On"}
            </button>

            <button
              onClick={endCall}
              className="bg-red-600 text-white px-5 py-2 rounded"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* TABS: CHAT vs DIGITAL TWIN */}
      <div className="flex gap-2 w-[420px]">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
            activeTab === "chat"
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          💬 Consultation Chat
        </button>
        <button
          onClick={() => setActiveTab("twin")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
            activeTab === "twin"
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🧬 Patient Digital Twin
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* CHAT */}
          <div className="w-[420px] h-[280px] border rounded p-3 overflow-y-auto bg-white">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`my-1 flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[85%] text-xs leading-relaxed ${
                    m.from === "patient"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 w-[420px]">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="border px-3 py-2 rounded flex-1 text-sm outline-none"
              placeholder="Type message..."
            />
            <button
              disabled={!canChat}
              onClick={sendMessage}
              className={`px-4 py-2 rounded text-white text-sm ${canChat ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"}`}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        /* DIGITAL TWIN PANEL */
        <div className="w-[420px] h-[330px] border rounded p-4 bg-white flex flex-col justify-between text-xs shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-2 border-b mb-3">
              <span className="font-bold text-gray-800 text-sm">
                Patient Digital Twin Telemetry
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium text-[10px]">
                Active Sync
              </span>
            </div>

            {savedTwin ? (
              <div className="space-y-2 text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Blood Pressure</span>
                    <span className="font-bold text-gray-800">
                      {savedTwin.vitals?.systolicBP}/{savedTwin.vitals?.diastolicBP} mmHg
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Glycemic Markers</span>
                    <span className="font-bold text-gray-800">
                      {savedTwin.vitals?.hba1c}% | {savedTwin.vitals?.fastingGlucose} mg/dL
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Biological Twin Vitality</span>
                  <div className="flex items-center justify-between font-bold text-gray-800">
                    <span>Score: {savedTwin.twinMetrics?.baselineScore}/100</span>
                    <span className="text-emerald-600">
                      Simulated: {savedTwin.twinMetrics?.simulatedScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200">
                  <span className="block text-[10px] text-amber-700 font-semibold">
                    5-Yr Chronic Risk Trajectory
                  </span>
                  <div className="flex items-center justify-between font-bold mt-1">
                    <span>Baseline: {savedTwin.twinMetrics?.baselineCvRisk}%</span>
                    <span className="text-emerald-700">
                      Forecast: {savedTwin.twinMetrics?.simulatedCvRisk}% (-{savedTwin.twinMetrics?.riskReductionPct}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No twin profile loaded. Visit /digital-twin to generate one.
              </p>
            )}
          </div>

          <button
            onClick={shareTwinTelemetry}
            disabled={!canChat}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition text-xs cursor-pointer"
          >
            📤 Transmit Twin Telemetry to Doctor
          </button>
        </div>
      )}
    </div>
  );
}

export default Consultation;