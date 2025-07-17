// Update the last updated timestamp
document.getElementById("lastUpdated").textContent =
  new Date().toLocaleDateString();

// You can add interactive functionality here
// For example, updating progress bars, status indicators, etc.

// Example: Update progress based on actual data
function updateProgress() {
  // Updated with actual JIRA data from gmlt_jira_csv.txt
  const totalStories = 78;
  const storiesComplete = 6;
  const storiesInProgress = 2;
  const weekProgress = 2; // completing week 2
  const totalWeeks = 8;

  // Calculate epic progress based on overall story completion
  // Since PREP epic is 67% complete (6 of 9 stories done), and other epics are 0%
  // Overall epic progress = (6 completed stories / 78 total stories) * 100
  const epicFill = document.querySelector(".epic-progress .progress-fill");
  const overallEpicPercentage = Math.round(
    (storiesComplete / totalStories) * 100
  );
  epicFill.style.width = overallEpicPercentage + "%";
  epicFill.textContent = `${storiesComplete} of ${totalStories} Stories Complete`;

  // Update timeline progress
  const timelineFill = document.querySelector(
    ".timeline-progress .progress-fill"
  );
  const timelinePercentage = (weekProgress / totalWeeks) * 100;
  timelineFill.style.width = timelinePercentage + "%";
  timelineFill.textContent = `Week ${weekProgress} of ${totalWeeks}`;

  // Update organization status
  const orgPercentage = Math.round((storiesComplete / totalStories) * 100);
  console.log(
    `Organization: ${orgPercentage}% complete (${storiesComplete}/${totalStories} stories)`
  );
}

// Call the update function on page load
updateProgress();
