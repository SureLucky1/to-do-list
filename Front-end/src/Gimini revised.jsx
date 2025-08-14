// Refactored Page.jsx – FULL OOP / Class‑based rewrite
// -----------------------------------------------------------------------------
// 版本：2025‑07‑21
// 特色：
// 1. 完全移除 React Hooks 與 useContext，所有狀態改為 Class state。
// 2. 以 redux‑store 作為單一來源，透過 react‑redux connect HOC 注入。
// 3. 嚴格區分 Presentation 與 Container class，適度抽象公用邏輯。
// 4. 所有事件邏輯皆封裝為 instance 方法，符合封裝(Encapsulation)；
//    TaskItem 透過組合而非繼承重用邏輯，示範多型(Polymorphism)。
// 5. 確保程式碼可直接放回 create‑react‑app 進行 build。
// -----------------------------------------------------------------------------

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import store from './redux-component/store.jsx';
import {
  regularItemPut,
  saveRegularItem,
  saveNewListItem,
  newlistItemPut,
  regularGet,
  newlistGet,
  regularReset,
} from './redux-component/taskManagement.jsx';
import './App.css';

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */
const priorityStyle = (priority) => {
  switch (priority) {
    case 'Urgent and Vital':
      return { backgroundColor: 'red', color: 'white' };
    case 'Important':
      return { backgroundColor: 'orange', color: 'white' };
    default:
      return { color: priority === 'Normal' ? 'black' : 'white' };
  }
};

const PRIORITY_RANK = ['Urgent and Vital', 'Important', 'Normal'];

/* -------------------------------------------------------------------------- */
/* Detail Panel                                                               */
/* -------------------------------------------------------------------------- */
class Detail extends React.Component {
  static propTypes = {
    isRegular: PropTypes.bool.isRequired,
    selectedTitle: PropTypes.string,
    selectedDate: PropTypes.string, // yyyy-mm-dd
    tasksOfDate: PropTypes.array, // for newlist
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    content: '',
    time: '',
  };

  componentDidMount() {
    // 每日重置 regular completed 狀態
    const todayStr = new Date().toLocaleDateString('en-GB');
    this.props.dispatch(regularReset({ date: todayStr }));
  }

  handleSave = () => {
    const { isRegular, selectedTitle, selectedDate, dispatch, tasksOfDate } = this.props;
    const { content, time } = this.state;

    if (!selectedTitle) return;

    if (isRegular) {
      dispatch(regularItemPut({ title: selectedTitle, content }));
    } else {
      // 更新時間欄位
      const updatedList = tasksOfDate.map((t) =>
        t.name === selectedTitle ? { ...t, time } : t,
      );
      dispatch(newlistItemPut({ date: selectedDate, taskList: updatedList }));
    }
  };

  render() {
    const { selectedTitle } = this.props;
    const { time, content } = this.state;

    return (
      <div className="detail">
        <h1>Details</h1>
        <input
          type="time"
          className="time"
          value={time}
          onChange={(e) => this.setState({ time: e.target.value })}
        />
        <div className="content">
          <h2>標題: {selectedTitle || '—'}</h2>
          <textarea
            value={content}
            onChange={(e) => this.setState({ content: e.target.value })}
          />
          <button onClick={this.handleSave}>Save Detail</button>
        </div>
      </div>
    );
  }
}

const DetailConnected = connect((state) => ({
  // 確保 state.ui 和 state.ui.isRegular 存在，提供預設值以避免 undefined 錯誤
  tasksOfDate: state.tasks.newlistTasks.find((d) => d.date === state.ui.selectedDate)?.task || [],
  selectedTitle: state.ui?.selectedTitle ?? '', // 提供預設值為空字串
  // 確保 state.ui.selectedDate 存在，提供預設值為當前日期
  selectedDate: state.ui?.selectedDate ?? new Date().toISOString().slice(0, 10),
  isRegular: state.ui?.isRegular ?? true, // 提供預設值
}))(Detail);

/* -------------------------------------------------------------------------- */
/* TaskItem Component                                                          */
/* -------------------------------------------------------------------------- */
class TaskItem extends React.Component {
  static propTypes = {
    task: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
    onPrioritize: PropTypes.func.isRequired,
  };

  state = { menuOpen: false, priorityOpen: false };

  toggleMenu = (e) => {
    e.stopPropagation();
    this.setState((s) => ({ menuOpen: !s.menuOpen }));
  };

  togglePriorityPanel = (e) => {
    e.stopPropagation();
    this.setState((s) => ({ priorityOpen: !s.priorityOpen, menuOpen: false }));
  };

  render() {
    const { task, onClick, onToggleComplete, onDelete, onRename, onPrioritize } = this.props;
    const { menuOpen, priorityOpen } = this.state;

    return (
      <div className="toDo" style={priorityStyle(task.priority)} onClick={onClick}>
        <button className="complete" onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}>
          {task.completed ? 'Done‑Yes' : 'Done‑No'}
        </button>
        <p className="para" style={{ color: task.priority === 'Normal' ? 'black' : 'white' }}>{task.name}</p>
        <button className="dropdown" onClick={this.toggleMenu}>open List</button>

        {menuOpen && (
          <div className="buttonGroup" onClick={(e) => e.stopPropagation()}>
            <button className="delete" onClick={onDelete}>Delete</button>
            <button onClick={onRename}>Rename</button>
            <button onClick={this.togglePriorityPanel}>Prioritize</button>
          </div>
        )}

        {priorityOpen && (
          <div className="priority-rating" onClick={(e) => e.stopPropagation()}>
            {PRIORITY_RANK.map((p) => (
              <h1 key={p} onClick={() => { onPrioritize(p); this.setState({ priorityOpen: false }); }}>{p}</h1>
            ))}
          </div>
        )}
      </div>
    );
  }
}

/* -------------------------------------------------------------------------- */
/* RegularTaskList                                                             */
/* -------------------------------------------------------------------------- */
class RegularTaskListInner extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired, // [{ title, task: [...] }]
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    open: {},
    newItem: '',
    search: '',
  };

  handleAdd = (groupIndex) => {
    const { dispatch } = this.props;
    const { newItem } = this.state;
    if (!newItem.trim()) return;
    dispatch(saveRegularItem({ groupIndex, name: newItem }));
    this.setState({ newItem: '' });
  };

  render() {
    const { items, dispatch } = this.props;
    const { open, newItem, search } = this.state;

    const toggleOpen = (id) => this.setState((s) => ({ open: { ...s.open, [id]: !s.open[id] } }));

    const renameTask = (groupIdx, taskIdx) => {
      const name = prompt('Rename to:');
      if (name) dispatch(regularItemPut({ groupIdx, taskIdx, name }));
    };

    const prioritizeTask = (groupIdx, taskIdx, priority) => {
      dispatch(regularItemPut({ groupIdx, taskIdx, priority }));
    };

    const completeTask = (groupIdx, taskIdx) => {
      dispatch(regularItemPut({ groupIdx, taskIdx, completed: true }));
    };

    const deleteTask = (groupIdx, taskIdx) => dispatch(regularItemPut({ groupIdx, taskIdx, remove: true }));

    const filtered = search.trim()
      ? items.flatMap((g) => g.task).filter((t) => t.name.includes(search))
      : null;

    return (
      <div className="regular-items">
        <input placeholder="search" value={search} onChange={(e) => this.setState({ search: e.target.value })} />
        {search.trim() === ''
          ? items.map((group, gIdx) => (
              <div className="regular-item" key={gIdx}>
                <h3>{group.title}</h3>
                <div className="inputGroup">
                  <input
                    type="text"
                    className="input"
                    value={newItem}
                    placeholder="add Task"
                    onChange={(e) => this.setState({ newItem: e.target.value })}
                  />
                  <button className="create" onClick={() => this.handleAdd(gIdx)}>
                    add Todo
                  </button>
                </div>
                {group.task.map((task, tIdx) => (
                  <TaskItem
                    key={tIdx}
                    task={task}
                    onClick={() => dispatch({ type: 'ui/selectTask', payload: { title: task.name, isRegular: true } })}
                    onToggleComplete={() => completeTask(gIdx, tIdx)}
                    onDelete={() => deleteTask(gIdx, tIdx)}
                    onRename={() => renameTask(gIdx, tIdx)}
                    onPrioritize={(p) => prioritizeTask(gIdx, tIdx, p)}
                  />
                ))}
              </div>
            ))
          : filtered.map((task, idx) => (
              <TaskItem
                key={idx}
                task={task}
                onClick={() => dispatch({ type: 'ui/selectTask', payload: { title: task.name, isRegular: true } })}
                onToggleComplete={() => {}}
                onDelete={() => {}}
                onRename={() => {}}
                onPrioritize={() => {}}
              />
            ))}
      </div>
    );
  }
}

const RegularTaskList = connect((state) => ({ items: state.tasks.regularTasks }))(RegularTaskListInner);

/* -------------------------------------------------------------------------- */
/* DailyTaskList                                                               */
/* -------------------------------------------------------------------------- */
class DailyTaskListInner extends React.Component {
  static propTypes = {
    dayTasks: PropTypes.array.isRequired, // [{name, ...}]
    dispatch: PropTypes.func.isRequired,
    selectedDate: PropTypes.string.isRequired,
  };

  state = {
    newItem: '',
    search: '',
    open: {},
  };

  addTask = () => {
    const { dispatch, selectedDate } = this.props;
    const { newItem } = this.state;
    if (!newItem.trim()) return;
    dispatch(saveNewListItem({ date: selectedDate, name: newItem }));
    this.setState({ newItem: '' });
  };

  render() {
    const { dayTasks, dispatch, selectedDate } = this.props;
    const { newItem, search, open } = this.state;

    const toggleOpen = (i) => this.setState((s) => ({ open: { ...s.open, [i]: !s.open[i] } }));

    const rename = (idx) => {
      const name = prompt('Rename:');
      if (name) dispatch(newlistItemPut({ date: selectedDate, taskIdx: idx, name }));
    };

    const prioritize = (idx, p) => dispatch(newlistItemPut({ date: selectedDate, taskIdx: idx, priority: p }));

    const complete = (idx) => dispatch(newlistItemPut({ date: selectedDate, taskIdx: idx, completed: true }));

    const deleteFn = (idx) => dispatch(newlistItemPut({ date: selectedDate, taskIdx: idx, remove: true }));

    const list = search.trim()
      ? dayTasks.filter((t) => t.name.includes(search))
      : dayTasks;

    return (
      <div className="new-items">
        <div className="new-item">
          <input
            type="date"
            className="date"
            value={selectedDate}
            onChange={(e) => dispatch({ type: 'ui/setDate', payload: e.target.value })}
          />
          <div className="inputGroup">
            <input
              type="text"
              className="input"
              value={newItem}
              placeholder="add New Task"
              onChange={(e) => this.setState({ newItem: e.target.value })}
            />
            <button className="create" onClick={this.addTask}>add Todo</button>
          </div>
          <input placeholder="search" value={search} onChange={(e) => this.setState({ search: e.target.value })} />
        </div>

        {list.map((task, idx) => (
          <TaskItem
            key={idx}
            task={task}
            onClick={() => dispatch({ type: 'ui/selectTask', payload: { title: task.name, date: selectedDate, isRegular: false } })}
            onToggleComplete={() => complete(idx)}
            onDelete={() => deleteFn(idx)}
            onRename={() => rename(idx)}
            onPrioritize={(p) => prioritize(idx, p)}
          />
        ))}
      </div>
    );
  }
}

const DailyTaskList = connect((state) => ({
  dayTasks: state.tasks.newlistTasks.find((d) => d.date === state.ui.selectedDate)?.task || [],
  selectedDate: state.ui.selectedDate,
}))(DailyTaskListInner);

/* -------------------------------------------------------------------------- */
/* PriorityPanel – 即時篩選所有任務                                           */
/* -------------------------------------------------------------------------- */
class PriorityPanelInner extends React.Component {
  static propTypes = {
    priorityList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = { filter: 'Urgent and Vital', panelOpen: false };

  render() {
    const { priorityList, dispatch } = this.props;
    const { filter, panelOpen } = this.state;
    // 確保 priorityList 在呼叫 filter 之前是一個陣列
    const filtered = (priorityList || []).filter((t) => t.priority === filter);

    return (
      <div>
        <button className="add" onClick={() => this.setState({ panelOpen: !panelOpen })}>Priority</button>
        {panelOpen && (
          <div className="priority-panel show">
            <form className="priority-filter">
              <select value={filter} onChange={(e) => this.setState({ filter: e.target.value })}>
                {PRIORITY_RANK.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </form>

            <div className="priority-panel-toDo-container">
              {filtered.map((item, i) => (
                <TaskItem
                  key={i}
                  task={item}
                  onClick={() => dispatch({ type: 'ui/selectTask', payload: { title: item.name, date: item.date, isRegular: false } })}
                  onToggleComplete={() => {}}
                  onDelete={() => {}}
                  onRename={() => {}}
                  onPrioritize={() => {}}
                />
              ))}
            </div>
            <button className="close-btn" onClick={() => this.setState({ panelOpen: false })}>Close</button>
          </div>
        )}
      </div>
    );
  }
}

const PriorityPanel = connect((state) => ({
  // 確保 state.tasks.allTasksFlat 存在，提供預設值以避免 undefined 錯誤
  priorityList: state.tasks?.allTasksFlat ?? [], // 提供預設值
}))(PriorityPanelInner);

/* -------------------------------------------------------------------------- */
/* TaskList – 切換 Regular / Daily                                             */
/* -------------------------------------------------------------------------- */
class TaskListInner extends React.Component {
  static propTypes = {
    isRegular: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  toggleMode = () => this.props.dispatch({ type: 'ui/toggleMode' });

  render() {
    const { isRegular } = this.props;
    return (
      <div className="itemGroup">
        {isRegular ? (
          <button className="add" onClick={this.toggleMode}>Go To Today</button>
        ) : (
          <button className="regular" onClick={this.toggleMode}>Go To Regular</button>
        )}
        {isRegular ? <RegularTaskList /> : <DailyTaskList />}
      </div>
    );
  }
}

const TaskList = connect((state) => ({
  // 確保 state.ui 和 state.ui.isRegular 存在，提供預設值以避免 undefined 錯誤
  isRegular: state.ui?.isRegular ?? true, // 提供預設值
}))(TaskListInner);

/* -------------------------------------------------------------------------- */
/* App Root                                                                    */
/* -------------------------------------------------------------------------- */
class App extends React.Component {
  render() {
    const dateStr = new Date().toLocaleDateString('en-GB');
    return (
      <Provider store={store}>
        <div className="App">
          <div className="panel">
            <h1>Hello, kiki</h1>
            <p>Time: {dateStr}</p>
          </div>
          <div className="main">
            <div className="to-do">
              <h1>Todo List</h1>
              <TaskList />
              <PriorityPanel />
            </div>
            <DetailConnected />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
