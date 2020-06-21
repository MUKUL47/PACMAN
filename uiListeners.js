const creationBtns = ["food", "energy", "enemy", "wall", "pacman"];
const onStart = () => {
  IS_CREATION_DATA = loadSaveCreation ? true : loadSaveCreation;;
  CREATION_ENABLED = false
  toggleHide(
    ["#paused-msg", ".start-screen", ".gameover-screen", '.load-config'],
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
  loadSaveCreation = false;
  location.reload()
  toggleHide([".gameover-screen", "#paused-msg",'.load-config'], [".start-screen"]);
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

////////////////////////LOAD
loadType = false

function load(){
  loadSaveCreation = false;
  loadType = false
  IS_CREATION_DATA = false
  toggleHide([".start-screen", ".pause-btn", ".restart-btn", '.download-a'], [".load-config"]);
}

async function loadSystemOrCloudConfig(){
  if(confirm('Load Config : \nCancel = From system | OK = From server')){
    $('.api-loader').show()
    const resp = await getConfigs()
    if(Object.keys(resp).length == 0) {
      alert('No config(s) found')
      $('.api-loader').hide()
      return;
    }
    renderConfigFromServer(resp)
  }else{
    loadType = 'loadPlay'
    $('#uploadAndPlay').click()
  }
}

async function deleteServerConfig(configId){
 if(confirm('Are you sure ?')){
  console.log(configId)
  $('.api-loader').show()
  await deleteConfig(configId)
  renderConfigFromServer(await getConfigs())
 }
}

function renderConfigFromServer(configs){
  $('.api-loader').hide()
  if(Object.keys(configs).length == 0) {
    $('.config-server').hide()
    return;
  }
  const htmlObj = 
  [
    `<div class='close-config' onclick="$('.config-server').hide()">x</div>
    <table>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    `
  ]
  Object.values(configs).forEach((config, i) => {
    const innerHtml = 
    `<tr>
      <th>${i+1}</th>
      <th>${config.name}</th>
      <th>${new Date(config.storedAt).toDateString()}</th>
      <th style='background:#000'>
        <div id='${config.config}' class='config-data-${i}'>
          <button class='config-btns' id='play-11' onclick="playServerConfig('${i}')">Play</button>
          <button class='config-btns' onclick="deleteServerConfig('${Object.keys(configs)[i]}')">Delete</button>
        </div>
      </th>
    </tr>`
    htmlObj.push(innerHtml)
  })
  htmlObj.push('</table>')  
  $('.config-server').html(htmlObj.join(''))
  $('.config-server').show()
}

function playServerConfig(classId){
  const pacmanData = decodePacmanConfig($(`.config-data-${classId}`)[0].id)
  loadConfigAndPlay(pacmanData)
}

function loadConfigAndPlay(pacmanData){
  loadSaveCreation = true;
  $('.config-server').hide()
  manualWalls = pacmanData.walls
  manualEnergy = pacmanData.energyBar
  manualFood = pacmanData.foodItems
  manualEnemyDefaultLocations = pacmanData.DEFAULT_LOCATIONS
  manualPlayerStart = pacmanData.PLAYER_START
  onStart()
}

async function saveConfigToCloud(){
  loadType = 'saveConfig'
  $('.api-loader').show()
  const resp = await getConfigs()
  if(Object.values(resp).length >= 5){
    alert('You dont have any saves remaining')
  }else{
    $('#uploadAndPlay').click()
  }
  $('.api-loader').hide()
}

$('#uploadAndPlay').on('change',function(evt){
    var f = evt.target.files[0]; 
    if (f){
        var r = new FileReader();
          r.onload = async function(e){     
          const file = e.target.result//decodePacmanConfig(e.target.result)
          if(!file){
            alert('Config file is invalid')
            return
          }
          if(loadType == 'saveConfig'){
            const data = prompt('Enter config name',`pacman-${new Date().valueOf()}`)
          if(data != null){
            $('.api-loader').show()
            const resp = await storeConfigs(file, data)
            alert('Config saved, remaining saves : '+ (5 - Object.values(resp).length))
            $('.api-loader').hide()
          }
        }else{
          loadConfigAndPlay(decodePacmanConfig(file))
        }
      }
        r.readAsText(f);
    } 
})