let speech = null;

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  const femaleVoiceNames =
    /female|samantha|victoria|karen|zira|jenny|aria|ava|hazel|susan|google uk english female/i;

  return (
    voices.find(
      (voice) =>
        voice.lang.toLowerCase().startsWith("en") &&
        femaleVoiceNames.test(voice.name)
    ) ||
    voices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    ) ||
    voices[0]
  );
}

export function speak(text) {
  if (!("speechSynthesis" in window)) {
    console.warn(
      "Text-to-Speech is not supported in this browser."
    );
    return;
  }

  stopSpeaking();

  speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.voice = getPreferredVoice();

  speech.rate = 0.95;

  speech.pitch = 1.08;

  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.resume();
  }
}

export function isSpeaking() {
  if (!("speechSynthesis" in window)) {
    return false;
  }

  return window.speechSynthesis.speaking;
}
