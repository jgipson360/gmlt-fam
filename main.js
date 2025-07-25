// Update the last updated timestamp
document.getElementById("lastUpdated").textContent =
  new Date().toLocaleDateString();

// Family Group Management System
const FAMILY_GROUPS = {
  adults: ["Dad", "Mom"],
  teens: ["DJ", "Q", "K"],
  children: ["E"],
};

const GROUP_DEFINITIONS = {
  "adults-only": {
    name: "Adults Only",
    emoji: "👨‍👩‍💼",
    members: ["Dad", "Mom"],
    description: "Tasks requiring adult responsibility and decision-making",
  },
  "teen-group": {
    name: "Teen Group",
    emoji: "🧑‍🎓",
    members: ["DJ", "Q", "K"],
    description: "Age-appropriate tasks for teenagers",
  },
  "child-safe": {
    name: "Child Safe",
    emoji: "👶",
    members: ["E"],
    description: "Tasks safe and appropriate for small children",
  },
  "all-family": {
    name: "All Family",
    emoji: "👨‍👩‍👧‍👦",
    members: ["Dad", "Mom", "DJ", "Q", "K", "E"],
    description: "Everyone can participate together",
  },
  "adults-lead": {
    name: "Adults Lead",
    emoji: "👨‍👩‍💼➡️",
    members: ["Dad", "Mom"],
    description: "Adults lead with family support",
  },
};

// Group utility functions
function getGroupForMember(member) {
  if (FAMILY_GROUPS.adults.includes(member)) return "adults";
  if (FAMILY_GROUPS.teens.includes(member)) return "teens";
  if (FAMILY_GROUPS.children.includes(member)) return "children";
  return null;
}

function canMemberParticipate(member, groupType) {
  if (!GROUP_DEFINITIONS[groupType]) return false;
  return GROUP_DEFINITIONS[groupType].members.includes(member);
}

function getGroupRecommendation(assignedTo) {
  const memberGroup = getGroupForMember(assignedTo);

  switch (memberGroup) {
    case "adults":
      return "adults-only";
    case "teens":
      return "teen-group";
    case "children":
      return "child-safe";
    default:
      return "all-family";
  }
}

// You can add interactive functionality here
// For example, updating progress bars, status indicators, etc.

// Example: Update progress based on actual data
function updateProgress() {
  // Updated with actual JIRA data from gmlt_jira_csv.txt - July 19, 2025
  const totalStories = 78;
  const storiesComplete = 8; // 7 PREP + 1 MSTR completed
  const storiesInProgress = 2; // 1 PREP + 1 MSTR in progress
  const weekProgress = 3; // entering week 3
  const totalWeeks = 8;

  // Calculate epic progress based on overall story completion
  // PREP epic is 78% complete (7 of 9 stories done), MSTR epic is 10% (1 of 10 stories done)
  // Overall epic progress = (8 completed stories / 78 total stories) * 100
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
  console.log(
    `PREP Epic: 78% complete (7/9 stories), MSTR Epic: 10% complete (1/10 stories)`
  );
}

// Call the update function on page load
updateProgress();

// Story Card Functions
function toggleDetails(detailsId) {
  const details = document.getElementById(detailsId);
  const button = event.target;

  if (details.classList.contains("show")) {
    details.classList.remove("show");
    button.textContent = "Add Details";
  } else {
    details.classList.add("show");
    button.textContent = "Hide Details";
  }
}

function toggleBlockedInput() {
  const blockedInput = document.getElementById("blockedInput");
  const blockedCheckbox = document.getElementById("blocked");

  if (blockedCheckbox.checked) {
    blockedInput.classList.add("show");
  } else {
    blockedInput.classList.remove("show");
  }
}

// Item Removal Tracker Functions
function updateItemStatus(checkbox, action) {
  const item = checkbox.closest(".item");
  const itemId = item.dataset.item;
  const statusElement = document.getElementById(itemId + "-status");
  const removedCheckbox = document.getElementById(itemId + "-removed");
  const returnedCheckbox = document.getElementById(itemId + "-returned");

  if (action === "removed" && checkbox.checked) {
    item.classList.add("removed");
    item.classList.remove("returned");
    statusElement.textContent = "Removed ✓";
    statusElement.className = "item-status status-removed";
    returnedCheckbox.disabled = false;
  } else if (action === "returned" && checkbox.checked) {
    if (removedCheckbox.checked) {
      item.classList.add("returned");
      item.classList.remove("removed");
      statusElement.textContent = "Returned ✓";
      statusElement.className = "item-status status-returned";
    } else {
      checkbox.checked = false;
      alert("Please mark item as removed first!");
    }
  } else if (action === "removed" && !checkbox.checked) {
    item.classList.remove("removed", "returned");
    statusElement.textContent = "Pending Removal";
    statusElement.className = "item-status status-pending";
    returnedCheckbox.checked = false;
    returnedCheckbox.disabled = true;
  }

  updateAreaProgress(item.closest(".area-section"));
  updateSummary();
}

function updateAreaProgress(areaSection) {
  const items = areaSection.querySelectorAll(".item");
  const processedItems = areaSection.querySelectorAll(
    ".item.removed, .item.returned"
  );
  const progressElement = areaSection.querySelector(".area-progress");
  progressElement.textContent = `${processedItems.length} of ${items.length} items processed`;
}

function updateSummary() {
  const totalItems = document.querySelectorAll(".item").length;
  const removedItems = document.querySelectorAll(".item.removed").length;
  const returnedItems = document.querySelectorAll(".item.returned").length;

  document.getElementById("total-items").textContent = totalItems;
  document.getElementById("removed-items").textContent = removedItems;
  document.getElementById("returned-items").textContent = returnedItems;
}

function addItem(areaSectionId, inputId) {
  const areaSection = document.getElementById(areaSectionId);
  const input = document.getElementById(inputId);
  const itemText = input.value.trim();

  if (!itemText) {
    alert("Please enter an item name");
    return;
  }

  const itemList = areaSection.querySelector(".item-list");
  const itemId = itemText.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const newItem = document.createElement("li");
  newItem.className = "item";
  newItem.dataset.item = itemId;
  newItem.innerHTML = `
    <input type="checkbox" class="item-checkbox" onchange="updateItemStatus(this, 'removed')" id="${itemId}-removed">
    <input type="checkbox" class="item-checkbox" onchange="updateItemStatus(this, 'returned')" id="${itemId}-returned">
    <div class="item-text">📦 ${itemText}</div>
    <div class="item-status status-pending" id="${itemId}-status">Pending Removal</div>
  `;

  itemList.appendChild(newItem);
  input.value = "";
  updateAreaProgress(areaSection);
  updateSummary();
}

function addNewArea() {
  const areaName = prompt("Enter the name of the new area/room:");
  if (!areaName) return;

  const areaId = areaName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const container = document.querySelector(
    ".item-tracker-summary-box"
  ).nextElementSibling;

  const newAreaHTML = `
    <div class="area-section" id="area-${areaId}">
      <div class="area-header">
        <h3 class="area-title">📦 ${areaName}</h3>
        <div class="area-progress">0 of 0 items processed</div>
      </div>

      <ul class="item-list">
      </ul>

      <div class="add-item">
        <input type="text" placeholder="Add new item for ${areaName}..." id="new-item-${areaId}">
        <button onclick="addItem('area-${areaId}', 'new-item-${areaId}')">+ Add Item</button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("afterend", newAreaHTML);
}

// Initialize item tracker when DOM is loaded
function initializeItemTracker() {
  const returnCheckboxes = document.querySelectorAll('[id$="-returned"]');
  returnCheckboxes.forEach((checkbox) => {
    checkbox.disabled = true;
  });
}

// Stories Page JavaScript Functions

// Group tab switching
function showGroup(groupName) {
  // Hide all group sections
  const sections = document.querySelectorAll(".group-section");
  sections.forEach((section) => section.classList.remove("active"));

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Show selected group
  const targetGroup = document.getElementById(groupName + "-group");
  if (targetGroup) {
    targetGroup.classList.add("active");
  }

  // Activate clicked tab
  const activeTab = document.querySelector(
    `[onclick="showGroup('${groupName}')"]`
  );
  if (activeTab) {
    activeTab.classList.add("active");
  }
}

// Open existing story card
function openStoryCard(storyId) {
  // Check if story card file exists, otherwise open template
  const storyCardUrl = `stories/${storyId}.html`;

  // Try to open the specific story card, fallback to template with ID
  fetch(storyCardUrl, { method: "HEAD" })
    .then((response) => {
      if (response.ok) {
        window.open(storyCardUrl, "_blank");
      } else {
        // Fallback to template with story ID
        window.open(`story-card-printable.html?story=${storyId}`, "_blank");
      }
    })
    .catch(() => {
      // If fetch fails, try direct navigation
      window.open(storyCardUrl, "_blank");
    });
}

// Create new story card
function createStoryCard(template) {
  window.open(`story-card-printable.html?template=${template}`, "_blank");
}

// Create new story for group
function createNewStory(group) {
  window.open(`story-card-printable.html?group=${group}`, "_blank");
}

// Modal functions
function closeModal() {
  const modal = document.getElementById("story-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("story-modal");
  if (modal && event.target == modal) {
    modal.style.display = "none";
  }
};

// Analytics dashboard JavaScript functionality
function initializeAnalytics() {
  // Update the last updated timestamp for analytics page
  const lastUpdatedElement = document.getElementById("lastUpdated");
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = new Date().toLocaleDateString();
  }

  // Add interactive functionality to epic cards
  document.querySelectorAll(".epic-card").forEach((card) => {
    card.addEventListener("click", function () {
      // Could expand to show detailed story breakdown
      console.log(
        "Epic card clicked:",
        this.querySelector(".epic-title").textContent
      );
    });
  });
}

// Initialize analytics if we're on the analytics page
if (window.location.pathname.includes("analytics.html")) {
  document.addEventListener("DOMContentLoaded", initializeAnalytics);
}
