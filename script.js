let taskListElem;
let tasks = [
  {
    name: "ライブの申し込み",
    dueDate: "2022/03/20",
    isCompleted: false,
  },
  {
    name: "セトリの予想",
    dueDate: "2022/03/20",
    isCompleted: false,
  },
  {
    name: "サイリウムの注文",
    dueDate: "2022/03/20",
    isCompleted: false,
  },
];

window.addEventListener("load", function () {
  // リストを取得
  taskListElem = document.querySelector("ul");
  // LocalStorageからタスクを読み込み
  loadTasks();
  // 配列からリストを出力　【変更点】
  renderTasks();
  renderNumOfTasks();
});

function addTask(taskName, taskDueDate) {
  if (tasks.find((task) => task.name == taskName)) {
    window.alert(`「${taskName}」は既に登録されているため登録できません。`);
    return;
  }
  // 配列に対し、項目を追加
  tasks.push({
    name: taskName,
    isCompleted: false,
    dueDate: taskDueDate,
  });
  // LocalStorageへタスクを保存
  saveTasks();
  // 配列からリストを再出力
  renderTasks();
  renderNumOfTasks();

  document.querySelector("form").reset();
}

/**
 * タスクを削除
 * @param {string}} deleteTaskName
 */
function deleteTask(taskName) {
  tasks = tasks.filter((task) => task.name != taskName);
  // LocalStorageへタスクを保存
  saveTasks();
  // 配列からリストを再出力
  renderTasks();
  renderNumOfTasks();
}

function toggleTaskComplete(taskName) {
  // 【変更点】
  // 現状の配列を反復
  for (let task of tasks) {
    if (task.name == taskName) {
      // 対象のタスク名ならば、完了状態をトグル
      task.isCompleted = !task.isCompleted;
    }
  }
  // 配列からリストを再出力
  renderTasks();
  renderNumOfTasks();
}

function renderTasks() {
  taskListElem.innerText = "";
  for (let task of tasks) {
    // リストの項目を作成
    let taskElem = document.createElement("li");
    taskElem.innerText = task.name;

    // 項目をクリックされたときの動作を設定
    taskElem.addEventListener("dblclick", function () {
      //　【変更点】
      // リストの項目をクリックされたときは、タスクを削除
      deleteTask(task.name);
    });

    // 項目をクリックされたときの動作を設定
    taskElem.addEventListener("click", function () {
      //　【変更点】
      // リストの項目をクリックされたときは、タスクを削除
      toggleTaskComplete(task.name);
    });

    // タスクの完了状況に応じ、項目の取り消し線を設定 【変更点】
    if (task.isCompleted) {
      taskElem.style.textDecorationLine = "line-through";
    } else {
      taskElem.style.textDecorationLine = "none";
    }

    let color;

    // 期限表示を作成
    let taskDueDateElem = document.createElement("span");
    taskDueDateElem.style.fontSize = "0.8rem";
    taskDueDateElem.style.fontStyle = "italic";
    taskDueDateElem.style.marginLeft = "1rem";
    if (task.dueDate) {
      taskDueDateElem.innerText = task.dueDate;
    } else {
      taskDueDateElem.innerText = "";
    }

    let today = new Date();
    let target = new Date(task.dueDate);

    if (
      today.getFullYear() == target.getFullYear() &&
      today.getMonth() == target.getMonth() &&
      today.getDate() == target.getDate()
    ) {
      taskDueDateElem.style.color = "#eccc68";
    } else if (
      today.getFullYear() < target.getFullYear() ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() < target.getMonth()) ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() == target.getMonth() &&
        today.getDate() <= target.getDate())
    ) {
      taskDueDateElem.style.color = "#2f3542";
      let date = parseInt((target.getTime() - today.getTime()) / 86400000) + 1;
      taskDueDateElem.innerText = `${taskDueDateElem.innerText} (残り: ${date}日)`;
    } else if (
      today.getFullYear() > target.getFullYear() ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() > target.getMonth()) ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() == target.getMonth() &&
        today.getDate() >= target.getDate())
    ) {
      taskDueDateElem.style.color = "#ff4757";
    } else {
      console.log("humei");
    }

    taskElem.appendChild(taskDueDateElem);

    // リストに対し、項目を追加
    taskListElem.appendChild(taskElem);
  }
}

function renderNumOfTasks() {
  // 完了済みタスクの件数を更新　【変更点】
  let numOfCompletedTasksElem = document.querySelector("#numOfCompletedTasks");
  numOfCompletedTasksElem.innerText = tasks.filter(
    (task) => task.isCompleted
  ).length;

  // 全タスクの件数を更新　【変更点】
  let numOfTasksElem = document.querySelector("#numOfTasks");
  numOfTasksElem.innerText = tasks.length;
}

function saveTasks() {
  // 【変更点】
  let jsonString = JSON.stringify(tasks);
  window.localStorage.setItem("tasks", jsonString);
}

function loadTasks() {
  // 【変更点】
  let jsonString = window.localStorage.getItem("tasks");
  if (jsonString) {
    tasks = JSON.parse(jsonString);
  }
}
