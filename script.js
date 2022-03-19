let taskListElem;
let tasks = [];

window.addEventListener("load", function () {
  // リストを取得
  taskListElem = document.querySelector("ul");
  // ダウンロードボタンがクリックされたら「downloadCSV」を実行する
  document.getElementById("export").addEventListener("click", csvExport, false);
  // LocalStorageからタスクを読み込み
  loadTasks();
  renderTasks();
  renderNumOfTasks();
});

function addTask(taskName, taskDueDate) {
  if (!taskName) {
    window.alert("タスク名が入力されていません。");
    return;
  }
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
      // リストの項目をクリックされたときは、タスクを削除
      deleteTask(task.name);
    });

    // 項目をクリックされたときの動作を設定
    taskElem.addEventListener("click", function () {
      // リストの項目をクリックされたときは、タスクを削除
      toggleTaskComplete(task.name);
    });

    // タスクの完了状況に応じ、項目の取り消し線を設定
    if (task.isCompleted) {
      taskElem.style.textDecorationLine = "line-through";
    } else {
      taskElem.style.textDecorationLine = "none";
    }

    let color;

    // 期限表示を作成
    let taskDueDateParentElem = document.createElement("span");
    taskDueDateParentElem.style.fontSize = "0.8rem";
    taskDueDateParentElem.style.fontStyle = "italic";
    taskDueDateParentElem.style.marginLeft = "1rem";
    let taskDueDateElem = document.createElement("span");
    if (task.dueDate) {
      taskDueDateElem.innerText = task.dueDate.replace(/-/g, "/");
      taskDueDateParentElem.appendChild(taskDueDateElem);
    } else {
      taskDueDateElem.innerText = "";
      taskDueDateParentElem.appendChild(taskDueDateElem);
    }

    let today = new Date();
    let target = new Date(task.dueDate);

    if (
      today.getFullYear() == target.getFullYear() &&
      today.getMonth() == target.getMonth() &&
      today.getDate() == target.getDate()
    ) {
      taskDueDateElem.style.color = "#eccc68";
      let taskDueDateDiffElem = document.createElement("span");
      taskDueDateDiffElem.innerText = `　本日が期限です！`;
      taskDueDateParentElem.appendChild(taskDueDateDiffElem);
    } else if (
      today.getFullYear() < target.getFullYear() ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() < target.getMonth()) ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() == target.getMonth() &&
        today.getDate() <= target.getDate())
    ) {
      taskDueDateElem.style.color = "#2f3542";
      let taskDueDateDiffElem = document.createElement("span");
      let date = parseInt((target.getTime() - today.getTime()) / 86400000) + 1;
      taskDueDateDiffElem.innerText = `　(残り: ${date}日)`;
      taskDueDateParentElem.appendChild(taskDueDateDiffElem);
    } else if (
      today.getFullYear() > target.getFullYear() ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() > target.getMonth()) ||
      (today.getFullYear() == target.getFullYear() &&
        today.getMonth() == target.getMonth() &&
        today.getDate() >= target.getDate())
    ) {
      taskDueDateElem.style.color = "#ff4757";
      let taskDueDateDiffElem = document.createElement("span");
      let date = parseInt((target.getTime() - today.getTime()) / 86400000);
      taskDueDateDiffElem.innerText = `　期限は ${-date}日前でした`;
      taskDueDateParentElem.appendChild(taskDueDateDiffElem);
    } else {
      console.log("humei");
    }

    taskElem.appendChild(taskDueDateParentElem);

    // リストに対し、項目を追加
    taskListElem.appendChild(taskElem);
  }
}

function renderNumOfTasks() {
  // 完了済みタスクの件数を更新
  let numOfCompletedTasksElem = document.querySelector("#numOfCompletedTasks");
  numOfCompletedTasksElem.innerText = tasks.filter(
    (task) => task.isCompleted
  ).length;

  // 全タスクの件数を更新
  let numOfTasksElem = document.querySelector("#numOfTasks");
  numOfTasksElem.innerText = tasks.length;
}

function saveTasks() {
  let jsonString = JSON.stringify(tasks);
  window.localStorage.setItem("tasks", jsonString);
}

function loadTasks() {
  let jsonString = window.localStorage.getItem("tasks");
  if (jsonString) {
    tasks = JSON.parse(jsonString);
  }
}

// CSV出力機能
function csvExport() {
  let fileName = "export.csv";
  let outputString = "タスク名,期日,進捗状況\n";
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);

  for (let task of tasks) {
    let completedString = "";
    if (task.isCompleted) {
      completedString = "済";
    } else {
      completedString = "未";
    }
    outputString =
      outputString +
      task.name +
      "," +
      task.dueDate +
      "," +
      completedString +
      "\n";
  }
  const blob = new Blob([bom, outputString], { type: "text/csv" });
  //IE10/11用(download属性が機能しないためmsSaveBlobを使用）
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    //BlobからオブジェクトURLを作成する
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    //ダウンロード用にリンクを作成する
    const download = document.createElement("a");
    //リンク先に上記で生成したURLを指定する
    download.href = url;
    //download属性にファイル名を指定する
    download.download = fileName;
    //作成したリンクをクリックしてダウンロードを実行する
    download.click();
    //createObjectURLで作成したオブジェクトURLを開放する
    (window.URL || window.webkitURL).revokeObjectURL(url);
  }
}

function csvImport() {
  console.log(event);
  const file = event.target.files[0]; // File オブジェクト
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result);
    let importTasks = reader.result.split(/\r\n|\r|\n/);
    for (let rawTask of importTasks) {
      let taskArray = rawTask.split(",");
      if (taskArray.length != 3) {
        continue;
      }
      let isCompleted = taskArray[2] == "済";
      let task = {
        name: taskArray[0],
        dueDate: taskArray[1],
        isCompleted: isCompleted,
      };
      if (task.name == "タスク名") {
        continue;
      }
      let taskIndex = getIndexTasks(task.name);
      if (taskIndex != -1) {
        tasks[taskIndex] = task;
      } else {
        tasks.push(task);
      }
    }
    saveTasks();
    renderTasks();
    renderNumOfTasks();
  };

  reader.readAsText(file);
}

function getIndexTasks(taskName) {
  let index = 0;
  for (let task of tasks) {
    if (task.name == taskName) {
      return index;
    }
    index++;
  }
  return -1;
}
