const creationBtns = ["food", "energy", "enemy", "wall", "pacman"];
const onStart = () => {
  IS_CREATION_DATA = false;
  CREATION_ENABLED = false;
  toggleHide(
    ["#paused-msg", ".start-screen", ".gameover-screen"],
    [".pause-btn", ".restart-btn"]
  );
  $(".pause-btn").text("Pause");
  resetGame();
  loadGame();
};

loadGame = () => {
  let start = 3;
  $(".load-screen").show();
  (function loadCounter() {
    $("#load-msg").text(
      `Starting in ${start}${Array(start)
        .fill(".")
        .map((i) => i)
        .join("")}`
    );
    if (start === 0) {
      $(".load-screen").hide();
      loop();
      return;
    }
    setTimeout((_) => {
      noLoop();
      start -= 1;
      loadCounter();
    }, 1000);
  })();
};

function mainMenu() {
  toggleHide([".gameover-screen", "#paused-msg"], [".start-screen"]);
  hideAssetBtns();
  resetGame();
}

function hideAssetBtns() {
  // [...creationBtns, 'dragMode', 'reset'].forEach(i => $(`.${i}`).show())
  $(".assets-btns").hide();
}

function pause() {
  if ($(".pause-btn").text().trim().toLowerCase() == "pause") {
    noLoop();
    $("#paused-msg").show();
    $(".pause-btn").text("Continue");
    return;
  }
  $("#paused-msg").hide();
  $(".pause-btn").text("Pause");
  loop();
}

function updateFinalScore(score, lastedFor) {
  $("#score").text(score);
  $("#lastedFor").text(lastedFor);
}

function loadCreationCenter() {
  FREE_HAND = false;
  $("#score").text("");
  removeAndAddAssetClass("wall");
  resetAssetUsage();
  toggleHide([".start-screen", ".pause-btn", ".restart-btn", '.download-a'], [".assets-btns"]);
  setup();
  loop();
  CREATION_ENABLED = true;
  disableDragMode();
  creationBtns.forEach((b) =>
    $(`.${b}`).text(
      $(`.${b}`).text().split(" ")[0].trim() + " (" + assetLimit[b] + ")"
    )
  );
  ["dragMode", "reset", ...creationBtns].forEach((i) => $(`.${i}`).show());
  $(".testMode").text("Test Mode");
  setTimeout(() => (FREE_HAND = true), 200); 
}

function selectMapAsset(asset) {
  if (asset == "reset") {
    if (confirm("Are you sure ?")) {
      disableDragMode();
      resetAssetUsage();
      removeAndAddAssetClass("wall");
      creationBtns.forEach((b) =>
        $(`.${b}`).text(
          $(`.${b}`).text().split(" ")[0].trim() + " (" + assetLimit[b] + ")"
        )
      );
      return;
    }
    return;
  }
  removeAndAddAssetClass(asset);
  tileInHand = asset;
}

function removeAndAddAssetClass(currentAsset) {
  creationBtns.forEach((b) => $("." + b).removeClass("asset-selected"));
  $("." + currentAsset).addClass("asset-selected");
}

function updateAssetLimit() {
  setTimeout(_ => $('.download-a')[ Object.values(selectedTile).length == 0 ? 'hide' : 'show'](), 10)
  $(`.${tileInHand}`).text(
    $(`.${tileInHand}`).text().split(" ")[0].trim() +
      " (" +
      assetLimit[tileInHand] +
      ")"
  );
}

function disableDragMode() {
  dragMode = false;
  const val = $(".dragMode");
  val.text("Enable Drag Mode");
  val.removeClass("brown-bg");
}

function toggleDragMode() {
  const val = $(".dragMode");
  if (val.text().split(" ")[0].trim().toLowerCase() == "enable") {
    dragMode = true;
    val.text("Disable Drag Mode");
    $(".dragMode").addClass("brown-bg");
    return;
  }
  disableDragMode();
}

function toggleTestMap() {
  const toggleMap = $(".testMode");
  const isEditMode = toggleMap.text().trim().toLowerCase() == "map mode";
  if (!isEditMode) {
    const validate = validateCustomMap();
    if (!validate.isValid) {
      alert(
        `Invalid configuration${
          validate.message ? " : " + validate.message : ""
        }`
      );
      return;
    }
  }
  toggleMap.text(isEditMode ? "Test Mode" : "Map Mode");
  ["dragMode", "reset", ...creationBtns].forEach((i) =>
    $(`.${i}`)[isEditMode ? "show" : "hide"]()
  );
  CREATION_ENABLED = isEditMode ? true : false;
  IS_CREATION_DATA = true;
  setup();
  loop();
  frameRate(60);
}

function downloadConfig() {
  data = overwriteDefaultConfig(true);
  var dataStr = "data:text;charset=utf-8," + encodeURIComponent(data);
  var dlAnchorElem = $(".download-a");
  dlAnchorElem.attr("href", dataStr);
  dlAnchorElem.attr("download", `pacmanConfig_${new Date().valueOf()}`);
  dlAnchorElem.click();
}

function toggleHide(hideElements, showElements) {
  hideElements.forEach((hideElement) => $(hideElement).hide());
  showElements.forEach((showElement) => $(showElement).show());
}

function resizeCurrentCanvas(){
  if(screen.height > 800) return
   $('#defaultCanvas0').css('height', 580)
   $('#defaultCanvas0').css('width', 580)
}


$('.uploadConfig').on('change',function(evt){
    var f = evt.target.files[0]; 
    if (f){
        var r = new FileReader();
          r.onload = function(e){     
          renderConfig(e.target.result)
        };
        r.readAsText(f);
    } 
})