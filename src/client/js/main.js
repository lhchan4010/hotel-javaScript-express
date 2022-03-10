import '../scss/styles.scss';
import 'regenerator-runtime';

const board = document.getElementById('board');
const floorAddBtn = document.getElementById('floor-addBtn');
const boardSaveBtn =
  document.getElementById('board-saveBtn');
const editModeBtn = document.getElementById(
  'board-edit__btn'
);

const handleCreateRoomBtn = (e) => {
  const roomContainer = e.target.parentElement.children[0];
  const room = document.createElement('div');
  const roomName = document.createElement('span');
  const isUsed = document.createElement('span');
  const isClean = document.createElement('span');
  const checkInBtn = document.createElement('button');
  room.className = 'room';

  roomName.className = 'room__name';
  roomName.innerText =
    parseInt(roomContainer.dataset.floorNum) * 100 +
    roomContainer.childElementCount +
    1;

  isUsed.className = 'room-state__isUsed';
  isUsed.innerText = '';

  isClean.className = 'room-state__isClean';

  checkInBtn.className = 'room__checkInBtn';
  checkInBtn.innerText = '입실';
  room.appendChild(roomName);
  room.appendChild(isUsed);
  room.appendChild(isClean);
  room.appendChild(checkInBtn);
  e.target.parentElement.children[0].appendChild(room);
};

const handleRemoveRoomBtn = (e) => {
  const rooms = e.target.parentElement.querySelectorAll(
    '.room__container .room'
  );
  if (rooms.length === 0) {
    return;
  }
  rooms[rooms.length - 1].remove();
};

const handleFloorAddBtn = () => {
  const floor = document.createElement('div');
  const roomContainer = document.createElement('div');
  const roomAddBtn = document.createElement('button');
  const roomRemoveBtn = document.createElement('button');
  floor.className = 'floor';

  roomContainer.className = 'room__container ';
  roomContainer.dataset.floorNum =
    board.childElementCount + 1;

  roomAddBtn.className = 'room-addBtn board-edit__btn';
  roomAddBtn.innerText = '➕';
  roomAddBtn.addEventListener('click', handleCreateRoomBtn);

  roomRemoveBtn.className =
    'room-removeBtn board-edit__btn';
  roomRemoveBtn.innerText = '➖';
  roomRemoveBtn.addEventListener(
    'click',
    handleRemoveRoomBtn
  );

  floor.appendChild(roomContainer);
  floor.appendChild(roomAddBtn);
  floor.appendChild(roomRemoveBtn);
  board.appendChild(floor);
};

const handleBoardSaveBtn = async () => {
  const data = [];
  const rooms = board.querySelectorAll(
    '.floor .room__container .room'
  );
  for (const room of rooms) {
    const roomData = {};
    roomData.name = room.children[0].innerText;
    roomData.floor = room.parentElement.dataset.floorNum;
    roomData.isUsed = room.querySelector(
      '.room-state__isUsed'
    ).innerText
      ? true
      : false;
    roomData.isClean = room.querySelector(
      '.room-state__isClean'
    ).innerText
      ? false
      : true;
    data.push(roomData);
  }
  const response = await fetch(`/api/board`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (response.status === 200) {
    const editBtn = document.querySelectorAll(
      '.board-edit__btn'
    );
    editBtn.forEach((btn) => {
      btn.style.display = 'none';
    });
  }
  editModeBtn.style.display = 'block';
};

const handleEditModeBtn = (e) => {
  e.target.style.display = 'none';
  const editBtn = document.querySelectorAll(
    '.board-edit__btn'
  );
  editBtn.forEach((btn) => {
    btn.style.display = 'inline';
  });
};

floorAddBtn.addEventListener('click', handleFloorAddBtn);
boardSaveBtn.addEventListener('click', handleBoardSaveBtn);
editModeBtn.addEventListener('click', handleEditModeBtn);
