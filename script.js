// Connect to the WebSocket server
const socket = io(); // Establish a connection to the WebSocket server

// Function to display incident reports
function displayIncidentReports(data) {
    const reportList = document.getElementById('reportList');
    reportList.innerHTML = ''; // Clear existing reports

    data.forEach(report => {
        const listItem = document.createElement('li');
        listItem.className = 'bg-white p-4 rounded shadow';
        listItem.innerHTML = `
            <strong>Number of Injured:</strong> ${report.numPatients} <br>
            <strong>Severity:</strong> ${report.severity} <br>
            <strong>Description:</strong> ${report.description} <br>
            <strong>Reported At:</strong> ${new Date(report.timestamp).toLocaleString()}
        `;
        reportList.appendChild(listItem);
    });
}

//check for the socket connection:
socket.on('connect', () => {
    console.log('Websocket connected')
})

// Listen for emergency updates from the server
socket.on('emergencyUpdate', (data) => {
    console.log('New emergency data received:', data);
    displayIncidentReports(data); // Update the report list with new data
});

// Initial fetch of incident reports when the page loads
fetch('/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(displayIncidentReports)
    .catch(error => {
        console.error('Error fetching incident reports:', error);
    });


