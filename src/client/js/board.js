import { async } from 'regenerator-runtime';

const board = document.getElementById('board');
const floorAddBtn = document.getElementById('floor-addBtn');
const boardSaveBtn =
  document.getElementById('board-saveBtn');
const editModeBtn = document.getElementById(
  'board-edit__btn'
);

const createRoomName = (event, data) => {
  const roomName = document.createElement('span');
  roomName.className = 'room__name';
  if (data) {
    roomName.innerText = data.name;
    return roomName;
  }
  event.target.parentElement.children[0];
  roomName.innerText =
    parseInt(roomContainer.dataset.floorNum) * 100 +
    roomContainer.childElementCount +
    1;
  return roomName;
};

const createIsUsed = (event, data) => {
  const isUsed = document.createElement('span');
  isUsed.className = 'room-state__isUsed';
  if (data) {
    isUsed.innerText = data.state.isUsed
      ? '사용중'
      : '빈방';
    return isUsed;
  }
  isUsed.innerText = '빈방';
  return isUsed;
};

const createIsClean = (event, data) => {
  const isClean = document.createElement('span');
  isClean.className = 'room-state__isClean';
  if (data) {
    isClean.innerText = data.state.isClean
      ? '청소완료'
      : '청소필요';
    return isClean;
  }
  isClean.innerText = '청소완료';
  return isClean;
};

const createCheckInBtn = (event, data) => {
  const checkInBtn = document.createElement('button');
  checkInBtn.className = 'room__checkInBtn';
  if (data) {
    checkInBtn.innerText = data.state.isUsed
      ? '퇴실'
      : '입실';
    return checkInBtn;
  }
  checkInBtn.innerText = '입실';
  return checkInBtn;
};

const createRoom = (event, data) => {
  const room = document.createElement('div');
  const roomName = createRoomName(event, data);
  const isUsed = createIsUsed(event, data);
  const isClean = createIsClean(event, data);
  const checkInBtn = createCheckInBtn(event, data);
  room.className = 'room';

  if (event) {
    const roomContainer =
      event.target.parentElement.children[0];
    room.appendChild(roomName, isUsed, isClean, checkInBtn);
    roomContainer.appendChild(room);
    return room;
  }
  room.id = data._id;
  room.appendChild(roomName);
  room.appendChild(isUsed);
  room.appendChild(isClean);
  room.appendChild(checkInBtn);
  return room;
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

const createFloor = (event, data, floorNum) => {
  const floor = document.createElement('div');
  const roomContainer = document.createElement('div');
  const roomAddBtn = document.createElement('button');
  const roomRemoveBtn = document.createElement('button');
  floor.className = 'floor';
  roomContainer.className = 'room__container ';
  if (event) {
    roomContainer.dataset.floorNum =
      board.childElementCount + 1;
    roomRemoveBtn.style.display = 'inline';
    roomAddBtn.style.display = 'inline';
  }
  if (data) {
    roomContainer.dataset.floorNum = floorNum;
    data.map((room) => {
      if (floorNum === room.floor) {
        roomContainer.appendChild(createRoom(false, room));
      }
    });
  }
  roomAddBtn.className = 'room-addBtn board-edit__btn';
  roomAddBtn.innerText = '➕';
  roomAddBtn.addEventListener('click', createRoom);
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
  return floor;
};

const paintBoard = async () => {
  const res = await fetch(`/api/${board.dataset.id}/board`);
  const data = await res.json();
  if (!data) {
    return;
  }
  const floors = new Set(data.map((room) => room.floor));
  for (const floorNum of floors) {
    const floor = createFloor(false, data, floorNum);
    board.appendChild(floor);
  }
};

const handleBoardSaveBtn = async () => {
  const data = [];
  const rooms = board.querySelectorAll('.room');
  for (const room of rooms) {
    const roomData = {};
    roomData.name = room.children[0].innerText;
    roomData.floor = room.parentElement.dataset.floorNum;
    roomData.isUsed =
      room.querySelector('.room-state__isUsed')
        .innerText === '사용중'
        ? true
        : false;
    roomData.isClean =
      room.querySelector('.room-state__isClean')
        .innerText === '청소완료'
        ? true
        : false;
    data.push(roomData);
  }
  const response = await fetch(
    `/api/${board.dataset.id}/board`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }
  );
  if (response.status === 200) {
    const editBtn = document.querySelectorAll(
      '.board-edit__btn'
    );
    editBtn.forEach((btn) => {
      btn.style.display = 'none';
    });
  }
  editModeBtn.style.display = 'block';
  location.reload();
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
const handleAddFloorBtn = (event) => {
  const floor = createFloor(event);
  board.appendChild(floor);
};

floorAddBtn.addEventListener('click', handleAddFloorBtn);
boardSaveBtn.addEventListener('click', handleBoardSaveBtn);
editModeBtn.addEventListener('click', handleEditModeBtn);

paintBoard();
