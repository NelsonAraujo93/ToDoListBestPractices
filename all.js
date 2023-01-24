// Index
import './style.css';
import ToDoList from './toDoList.js';

const ToDoListArray = new ToDoList([]);

const init = () => {
  const toDoList = document.getElementById('to-do-list');
  const toDoHeader = document.createElement('div');
  toDoHeader.className = 'to-do-header';
  toDoHeader.innerHTML = `<h4>Today's To Do</h4>
    <div class="icon-container">
    <?xml version="1.0" encoding="utf-8"?>
    <svg fill="#000000" width="14px" height="14px" viewBox="0 0 24 24" id="update-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line">
      <path id="primary" d="M5.07,8A8,8,0,0,1,20,12" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
      <path id="primary-2" data-name="primary" d="M18.93,16A8,8,0,0,1,4,12" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
      <polyline id="primary-3" data-name="primary" points="5 3 5 8 10 8" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline>
      <polyline id="primary-4" data-name="primary" points="19 21 19 16 14 16" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline>
    </svg>
    </div>`;
  toDoList.append(toDoHeader);
  const inputToDoContainer = document.createElement('div');
  const inputToDo = document.createElement('input');
  inputToDo.id = 'to-do-input';
  inputToDo.setAttribute('type', 'text');
  inputToDo.setAttribute('placeholder', 'add to your list...');
  const clearAllBtn = document.createElement('div');
  clearAllBtn.classList.add('remove-btn', 'disabled');
  clearAllBtn.id = 'clear-all';
  clearAllBtn.innerHTML = 'Clear all completed';
  const ulList = document.createElement('ul');
  ulList.id = 'list';
  inputToDoContainer.id = 'to-do-input-container';
  inputToDoContainer.innerHTML = `
  <?xml version="1.0" encoding="utf-8"?>
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5a1 1 0 1 0-2 0v5.6a3.4 3.4 0 0 1-3.4 3.4H7.414l2.293-2.293a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L7.414 16H14.6a5.4 5.4 0 0 0 5.4-5.4V5Z" fill="#000000"/>
  </svg>`;
  inputToDo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      ToDoListArray.addToDo(event.currentTarget.value, ulList);
      event.currentTarget.value = '';
    }
  });
  clearAllBtn.addEventListener('click', () => {
    ToDoListArray.clearAllCompleted(ulList);
  });
  inputToDoContainer.prepend(inputToDo);
  toDoList.append(inputToDo);
  toDoList.append(ulList);
  toDoList.append(clearAllBtn);
  ToDoListArray.print(ulList);
};

init();

// Modules

export default class ToDoList {
  constructor(list) {
    this.toDoList = list;
  }

  addToDo(task, container) {
    const newTask = {
      description: task,
      completed: false,
      index: 0,
    };
    this.toDoList.push(newTask);
    this.update(container);
  }

  update(container) {
    this.toDoList.map((item, i) => {
      item.index = i;
      return item;
    });
    this.toLocalStorage();
    this.print(container);
  }

  toLocalStorage() {
    const stringToDoList = JSON.stringify(this.toDoList);
    localStorage.setItem('toDoList', stringToDoList);
  }

  getLocalStorage() {
    if (localStorage.toDoList) {
      const from = JSON.parse(localStorage.toDoList);
      this.toDoList = from;
    }
  }

  remove(index, container) {
    this.toDoList.splice(index, 1);
    this.update(container);
  }

  print(container) {
    container.innerHTML = '';
    let checked = 0;
    this.getLocalStorage();
    this.toDoList.map((item) => {
      const toDo = document.createElement('li');
      if (item.completed) {
        toDo.classList.add('item-to-do', 'checked');
        checked += 1;
      } else {
        toDo.className = 'item-to-do';
      }
      const checkBox = document.createElement('input');
      checkBox.setAttribute('type', 'checkbox');
      checkBox.id = `to-do-${item.index}`;
      checkBox.checked = item.completed;
      checkBox.addEventListener('change', () => {
        toDo.classList.toggle('checked');
        item.completed = checkBox.checked;
        this.update(container);
      });
      toDo.append(checkBox);
      const inputText = document.createElement('input');
      inputText.value = item.description;
      inputText.className = 'input-to-do';
      inputText.addEventListener('focusin', () => {
        toDo.classList.toggle('edit');
      });
      inputText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          toDo.classList.toggle('edit');
          item.description = event.currentTarget.value;
          this.update(container);
        }
      });
      toDo.append(inputText);
      const toDoListIcon = document.createElement('div');
      toDoListIcon.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 122.88">
        <defs>
          <style>.cls-1{fill-rule:evenodd;}</style>
        </defs>
        <title>3-vertical-dots</title>
        <path class="cls-1" d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"/>
        </svg>
      `;
      toDoListIcon.classList.add('to-do-icon', 'drag');
      toDo.append(toDoListIcon);
      const removeBtn = document.createElement('div');
      removeBtn.classList.add('to-do-icon', 'remove');
      removeBtn.innerHTML = `<?xml version="1.0" encoding="iso-8859-1"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
         width="24px" height="24px" viewBox="0 0 482.428 482.429"
         xml:space="preserve">
        <g>
          <g>
            <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
              c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
              h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
              C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
              C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
              c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
              c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
              V115.744z"/>
            <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
              c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
            <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
              c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
            <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
              c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
          </g>
        </g>
      </svg>
      `;
      removeBtn.addEventListener('click', () => {
        this.remove(item.index, container);
      });
      toDo.append(removeBtn);
      return container.append(toDo);
    });
    if (checked >= 1) {
      const clearAll = document.getElementById('clear-all');
      if (clearAll.classList.contains('disabled')) {
        clearAll.classList.remove('disabled');
      }
    } else {
      const clearAll = document.getElementById('clear-all');
      if (!clearAll.classList.contains('disabled')) {
        clearAll.classList.add('disabled');
      }
    }
  }

  clearAllCompleted(container) {
    container.innerHTML = '';
    const newArray = this.toDoList.filter((item) => !item.completed);
    this.toDoList = newArray;
    this.update(container);
  }
}