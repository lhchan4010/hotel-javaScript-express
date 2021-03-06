import { async } from 'regenerator-runtime';

const board = document.getElementById('board');
const floorAddBtn = document.getElementById('floor-addBtn');
const floorRemoveBtn = document.getElementById(
  'floor-removeBtn'
);
const boardSaveBtn =
  document.getElementById('board-saveBtn');
const editModeBtn = document.getElementById(
  'board-edit__btn'
);
const checkInForm = document.getElementById('checkIn-form');
const checkInBoxCloseBtn = document.getElementById(
  'checkInBox-close__btn'
);

const updateRoomName = (event) => {
  const room = event.target.parentElement;
  const roomName = event.target;
  const roomNameInput = document.createElement('input');
  roomNameInput.type = 'text';
  roomName.classList.add('displayNone');
  roomNameInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
      roomName.innerText = event.target.value;
      const response = await fetch(
        `/api/room/${room.id}/name`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: event.target.value,
            id: room.id,
          }),
        }
      );
      roomName.classList.remove('displayNone');
      event.target.remove();
    }
  });
  room.prepend(roomNameInput);
};

const createRoomName = (event, data) => {
  const roomName = document.createElement('span');
  roomName.className = 'room__name';
  roomName.addEventListener('click', updateRoomName);
  if (data) {
    roomName.innerText = data.name;
    return roomName;
  }
  const roomContainer =
    event.target.parentElement.children[0];
  roomName.innerText =
    parseInt(roomContainer.dataset.floorNum) * 100 +
    roomContainer.childElementCount +
    1;
  return roomName;
};

const toggleIsUsed = async (event) => {
  const room = event.target.parentElement;
  const isUsed = event.target;
  if (!room.id) {
    return;
  }
  const response = await fetch(
    `/api/room/${room.id}/isUsed`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { state } = await response.json();
  state
    ? (isUsed.innerText = '?????????')
    : (isUsed.innerText = '??????');
};

const createIsUsed = (event, data) => {
  const isUsed = document.createElement('span');
  isUsed.className = 'room-state__isUsed';
  isUsed.addEventListener('click', toggleIsUsed);
  if (data) {
    isUsed.innerText = data.state.isUsed
      ? '?????????'
      : '??????';
    return isUsed;
  }
  isUsed.innerText = '??????';
  return isUsed;
};

const toggleIsClean = async (event) => {
  const room = event.target.parentElement;
  const isClean = event.target;
  if (!room.id) {
    return;
  }
  const response = await fetch(
    `/api/room/${room.id}/isClean`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { state } = await response.json();
  state
    ? (isClean.innerText = '????????????')
    : (isClean.innerText = '????????????');
};

const createIsClean = (event, data) => {
  const isClean = document.createElement('span');
  isClean.className = 'room-state__isClean';
  isClean.addEventListener('click', toggleIsClean);
  if (data) {
    isClean.innerText = data.state.isClean
      ? '????????????'
      : '????????????';
    return isClean;
  }
  isClean.innerText = '????????????';
  return isClean;
};

const handleCheckInBtn = (event) => {
  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now() - offset);
  const checkInBox = document.getElementById('checkInBox');
  const room = event.target.parentElement;
  if (!room.id) {
    return;
  }
  const checkInInfo =
    checkInForm.querySelectorAll('.checkInInfo');
  checkInInfo[0].innerText =
    room.querySelector('.room__name').innerText;
  checkInInfo[0].id = room.id;
  checkInInfo[3].value = 30000;
  checkInInfo[4].value = today.toISOString().slice(0, 16);
  checkInBox.style.display = 'flex';
};

const createCheckInBtn = (event, data) => {
  const checkInBtn = document.createElement('button');
  checkInBtn.classList.add('room__checkInBtn', 'room__btn');
  checkInBtn.addEventListener('click', handleCheckInBtn);
  checkInBtn.innerText = '??????';
  if (data) {
    if (data.state.isCheckIn) {
      checkInBtn.classList.add('displayNone');
      return checkInBtn;
    }
  }
  return checkInBtn;
};

const handleCheckOutBtn = async (event) => {
  const room = event.target.parentElement;
  const isUsed = room.children[1];
  const checkInBtn = room.children[3];
  const checkOutBtn = room.children[4];
  const response = await fetch(
    `/api/room/${room.id}/checkOut`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.status === 200) {
    isUsed.innerText = '??????';
    checkInBtn.classList.remove('displayNone');
    checkOutBtn.classList.add('displayNone');
  }
};

const createCheckOutBtn = (event, data) => {
  const checkOutBtn = document.createElement('button');
  checkOutBtn.innerText = '??????';
  checkOutBtn.addEventListener('click', handleCheckOutBtn);
  checkOutBtn.classList.add(
    'room__checkOutBtn',
    'room__btn'
  );
  if (event) {
    checkOutBtn.classList.add('displayNone');
  }
  if (data) {
    console.log(data.state.isCheckIn);
    if (!data.state.isCheckIn) {
      checkOutBtn.classList.add('displayNone');
      return checkOutBtn;
    }
  }
  return checkOutBtn;
};

const createRoom = (event, data) => {
  const room = document.createElement('div');
  const roomName = createRoomName(event, data);
  const isUsed = createIsUsed(event, data);
  const isClean = createIsClean(event, data);
  const checkInBtn = createCheckInBtn(event, data);
  const checkOutBtn = createCheckOutBtn(event, data);
  room.className = 'room';

  if (event) {
    const roomContainer =
      event.target.parentElement.children[0];
    room.append(
      roomName,
      isUsed,
      isClean,
      checkInBtn,
      checkOutBtn
    );
    roomContainer.appendChild(room);
    return;
  }
  room.id = data._id;
  room.dataset.ischeckin = data.state.isCheckIn;
  room.append(
    roomName,
    isUsed,
    isClean,
    checkInBtn,
    checkOutBtn
  );
  return room;
};

const handleRemoveRoomBtn = (e) => {
  const rooms = e.target.parentElement.querySelectorAll(
    '.room__container .room'
  );
  if (rooms.length === 0) {
    e.target.parentElement.remove();
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
  roomAddBtn.innerText = '???';
  roomAddBtn.addEventListener('click', createRoom);
  roomRemoveBtn.className =
    'room-removeBtn board-edit__btn';
  roomRemoveBtn.innerText = '???';
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
  const floors = board.querySelectorAll('.floor');
  const rooms = board.querySelectorAll('.room');
  for (const room of rooms) {
    const roomData = {};
    roomData.name = room.children[0].innerText;
    roomData.floor = room.parentElement.dataset.floorNum;
    roomData.state = {
      isCheckIn: room.dataset.ischeckin,
      isUsed:
        room.querySelector('.room-state__isUsed')
          .innerText === '?????????'
          ? true
          : false,
      isClean:
        room.querySelector('.room-state__isClean')
          .innerText === '????????????'
          ? true
          : false,
    };
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
    for (const floor of floors) {
      floor.remove();
    }
    paintBoard();
    editModeBtn.style.display = 'block';
  }
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

const handleRemoveFloorBtn = (event) => {
  const floors = document.querySelectorAll('.floor');
  floors[floors.length - 1].remove();
};
const handlecheckInForm = async (event) => {
  event.preventDefault();
  const checkInInfo =
    checkInForm.querySelectorAll('.checkInInfo');
  const roomId = checkInInfo[0].id;
  const response = await fetch(
    `/api/room/${roomId}/checkIn`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room: checkInInfo[0].innerText,
        type: checkInInfo[1].value,
        payment: checkInInfo[2].value,
        price: checkInInfo[3].value,
        time: { checkIn: checkInInfo[4].value },
      }),
    }
  );
  if (response.status === 200) {
    const roomData = await response.json();
    const room = document.getElementById(roomData._id);
    room.children[1].innerText = '?????????';
    room.children[2].innerText = '????????????';
    room.children[3].classList.add('displayNone');
    room.children[4].classList.remove('displayNone');
    checkInForm.parentElement.style.removeProperty(
      'display'
    );
  }
};
const handlecheckInBoxCloseBtn = () => {
  checkInForm.parentElement.style.removeProperty('display');
};

floorAddBtn.addEventListener('click', handleAddFloorBtn);
floorRemoveBtn.addEventListener(
  'click',
  handleRemoveFloorBtn
);
boardSaveBtn.addEventListener('click', handleBoardSaveBtn);
editModeBtn.addEventListener('click', handleEditModeBtn);
checkInForm.addEventListener('submit', handlecheckInForm);
checkInBoxCloseBtn.addEventListener(
  'click',
  handlecheckInBoxCloseBtn
);
paintBoard();

window.onclick = function (event) {
  if (event.target === checkInForm.parentElement) {
    checkInForm.parentElement.style.removeProperty(
      'display'
    );
  }
};
