// Update the last updated timestamp
document.getElementById("lastUpdated").textContent =
  new Date().toLocaleDateString();

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
