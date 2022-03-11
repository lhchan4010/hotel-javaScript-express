import { async } from 'regenerator-runtime';

const board = document.getElementById('board');
const floorAddBtn = document.getElementById('floor-addBtn');
const boardSaveBtn =
  document.getElementById('board-saveBtn');
const editModeBtn = document.getElementById(
  'board-edit__btn'
);

const handleRemoveRoomBtn = (e) => {
  const rooms = e.target.parentElement.querySelectorAll(
    '.room__container .room'
  );
  if (rooms.length === 0) {
    return;
  }
  rooms[rooms.length - 1].remove();
};

const createRoom = (event, data) => {
  const room = document.createElement('div');
  const roomName = document.createElement('span');
  const isUsed = document.createElement('span');
  const isClean = document.createElement('span');
  const checkInBtn = document.createElement('button');

  room.className = 'room';
  roomName.className = 'room__name';
  isUsed.className = 'room-state__isUsed';
  isClean.className = 'room-state__isClean';
  checkInBtn.className = 'room__checkInBtn';
  if (event) {
    const roomContainer =
      event.target.parentElement.children[0];
    console.log('event');
    roomName.innerText =
      parseInt(roomContainer.dataset.floorNum) * 100 +
      roomContainer.childElementCount +
      1;
    isUsed.innerText = '빈방';
    isClean.innerText = '청소완료';
    checkInBtn.innerText = '입실';
    room.appendChild(roomName, isUsed, isClean, checkInBtn);
    roomContainer.appendChild(room);
  }
  if (data) {
    roomName.innerText = data.name;
    isUsed.innerText = data.state.isUsed
      ? '사용중'
      : '빈방';
    isClean.innerText = data.state.isClean
      ? '청소완료'
      : '청소필요';
    checkInBtn.innerText = data.state.isUsed
      ? '퇴실'
      : '입실';
  }

  room.appendChild(roomName);
  room.appendChild(isUsed);
  room.appendChild(isClean);
  room.appendChild(checkInBtn);
  return room;
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
  const rooms = board.querySelectorAll(
    '.floor .room__container .room'
  );
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
};

const handleEditModeBtn = (e) => {
  e.target.style.display = 'none';
  const editBtn = document.querySelectorAll(
    '.board-edit__btn'
  );
  editBtn.forEach((btn) => {
    btn.style.display = 'inline';
  });
  console.log(editBtn);
};
const handleAddFloorBtn = (event) => {
  const floor = createFloor(event);
  board.appendChild(floor);
};

floorAddBtn.addEventListener('click', handleAddFloorBtn);
boardSaveBtn.addEventListener('click', handleBoardSaveBtn);
editModeBtn.addEventListener('click', handleEditModeBtn);

paintBoard();
