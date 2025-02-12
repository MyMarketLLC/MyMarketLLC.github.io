// Track page load time
let pageLoadTime = new Date();

// Listen for page visibility changes to track time spent
let timeSpent = 0;
let lastActiveTime = new Date();

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        timeSpent += new Date() - lastActiveTime;
    } else {
        lastActiveTime = new Date();
    }
});

// Function to submit thoughts and tracking data
async function submitThoughts(pageType) {
    const thoughts = document.getElementById('thoughts').value;
    const currentTime = new Date();
    
    // Calculate total time spent (in seconds)
    const totalTimeSpent = Math.floor(
        (timeSpent + (document.hidden ? 0 : currentTime - lastActiveTime)) / 1000
    );

    // Format time in military format (HH:mm)
    const militaryTime = currentTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });

    const data = {
        pageType,
        thoughts,
        scanTime: militaryTime,
        timeSpent: totalTimeSpent,
    };

    try {
        const response = await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Thank you for sharing your thoughts!');
            document.getElementById('thoughts').value = '';
        } else {
            alert('There was an error submitting your thoughts. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your thoughts. Please try again.');
    }
}