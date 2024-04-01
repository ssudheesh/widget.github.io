(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(audioText) {
      try {
        // Set timeout duration for the recognition (in milliseconds)
        const recognitionTimeout = 5000; // Adjust as needed

        // Initialize a variable to track the last speech timestamp
        let lastSpeechTimestamp = Date.now();

        // Use the microphone as source for input
        console.log("Microphone is open now, say your prompt...");
        //System
        //const recognition = new webkitSpeechRecognition();
        //Mobile
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true; // Set to true for continuous recognition
        recognition.interimResults = false;

        // Wrap the recognition process in a Promise
        const recognitionResult = new Promise((resolve, reject) => {
          recognition.onresult = function(event) {
            // Extract the recognized text from the event
            const audio2 = event.results[0][0].transcript.toLowerCase();
            console.log("Did you say:", audio2);
            lastSpeechTimestamp = Date.now(); // Update the last speech timestamp
            resolve(audio2); // Resolve the promise with the recognized text
          };

          recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error);
            reject(event.error); // Reject the promise with the recognition error
          };

          // Add an end event listener to handle timeout
          recognition.onend = function() {
            const currentTime = Date.now();
            // Calculate the time difference since the last speech
            const timeDifference = currentTime - lastSpeechTimestamp;
            // If no speech has been detected for the specified timeout duration, stop recognition
            if (timeDifference >= recognitionTimeout) {
              console.log("Speech timeout reached. Stopping recognition.");
              recognition.stop();
            }
          };
        });

        recognition.start();

        // Wait for the recognition result
        return await recognitionResult;
      } catch (error) {
        console.error('An error occurred:', error);
        return error;
//        return 'An error occurred while processing the request.';
      }


    }
  }
  customElements.define("custom-widget_audio", MainWebComponent);
})();
