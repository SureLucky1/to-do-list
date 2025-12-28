  import React from 'react';
  import './App.css';
  import ShowContext from './index.js';


class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw to allow calling code to handle it
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  async delete(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
}

const myApiClient = new ApiClient('http://localhost:8080');


  class RegularTaskItem extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        itemDate:"2/8/2025",
        searchItem:"",
         items: [],
         open:{},
         regularNewItem:"",
         priority:"",
         prioritize:"Normal"
      }
          this.addRegularItem = this.addRegularItem.bind(this);
    this.enterNewItem = this.enterNewItem.bind(this);
    // this.fetchData = this.fetchData.bind(this);
    }
//     async fetchData() {
//   try {
//     const posts = await myApiClient.get('regular');
//     this.setState(
//       { items: posts },
//       () => {
//         this.props.reportItems(this.state.items);
//       }
//     );
//   } catch (error) {
//     console.error('An error occurred during API operations:', error);
//   }
// }
  componentDidUpdate(prevProps) {
    if (prevProps.regularItems !== this.props.regularItems) {
      this.setState({ items: this.props.regularItems });
    }
  }
  toggleOpen = (index) => {

  this.setState(prevState => ({
    open: {
      ...prevState.open,
      [index]: !prevState.open[index]
    }
  }));
};

setPriority = (index) => {
this.setState({priority: index});
};
      completeFunction = async (event) => {
      event.stopPropagation(); 
      event.target.innerText = `Done-Yes`;
        let taskName = event.target.parentNode.querySelector('.para').innerText;
await myApiClient.post('regular', { task: taskName });
    };

prioritizeFunction = (prioritize, idx) => {
  this.setState(prev => {
    const newitems = prev.items.map((it, i) =>
      i === 0
        ? { 
            ...it, 
            task: it.task.map((sub, index) =>
              index === idx ? { ...sub, priority: prioritize } : sub
            )
          }
        : it
    );
    return { items: newitems };
  }, () => this.props.reportItems(this.state.items));
};
searchPrioritizeFunction = (prioritize, idx) => {
  this.setState(prev => {
    const newitems = prev.items.map((it, i) =>
      i === 0
        ? { 
            ...it, 
            task: it.task.map((sub, index) =>
              index === idx ? { ...sub, priority: prioritize } : sub
            )
          }
        : it
    );
    return { items: newitems };
  }, () => this.props.reportItems(this.state.items));
};

async addRegularItem (taskName) {
  console.log()
if(this.state.items.length > 0){
  const updateArray = [...this.state.items[0].task, {name: taskName, 
  completed: false,
   priority: this.state.prioritize}]   
   this.setState(prev => {
  const newItems = prev.items.map((item, i) =>
    i === 0
      ? { ...item, task: [...item.task, { name: taskName, completed: false, priority: prev.prioritize }] }
      : item
  );
  return { items: newItems, regularNewItem: "" };
}, () => {
  this.props.reportItems(this.state.items);
});

console.table(this.state.items);
      if (!taskName) return;
const task ={ 
  date: this.state.itemDate,
  regularTask :updateArray
};
      this.setState({regularNewItem: ""}) 
}else{
    const updateArray = [{
  name: taskName, 
  completed: false,
  priority: this.state.prioritize
}]   

  const task ={ 
  date: this.state.itemDate,
  regularTask :updateArray
};
  await myApiClient.put('regular', task)
  return this.setState({items: task})
}
    };

deleteFunction = (event, idx) => {
  event.stopPropagation();
  this.setState(prev => {
    const newitems = prev.items.map((item, i) =>
      i === 0
        ? { ...item, task: item.task.filter((_, index) => index !== idx) }
        : item
    );
     return { items: newitems}
  }, () => {
  this.props.reportItems(this.state.items);
    });
};

    reNameFunction = (event) => {
      const newtitle = prompt('請輸入新名字');
      if (!newtitle) return;
      const oldName = event.target.parentNode.parentNode.querySelector('.para').innerText
  this.setState((prev) => {
   const newitems =  prev.items.map((item, i) =>
      i === 0
        ? { ...item, 
          task: item.task.map((item) => { 
            if(item.name === oldName){ 
              const newItem = {...item, name: newtitle}
              return newItem
            }
            return item;
          }) }
        : item
    );
    return {items: newitems}
  }, () => {
  this.props.reportItems(this.state.items);
    });
    };

    enterNewItem(e){
this.setState({regularNewItem: e.target.value})
    }

render(){
  const { searchResult, toggle } = this.props;
  console.log("regularItems", this.props.regularItems);
    console.log("regularItems", this.state.items);
      return (
      <div className="regular-items" 
      style={{ display: toggle ? 'block' : 'none' }}
      >
                  <div className="inputGroup">
              <input
                type="text"
                className="input"
                onChange={(e)=>{this.enterNewItem(e)}}
                placeholder="add New Task"
              /> 
              <button className="create" onClick={() => {this.addRegularItem(this.state.regularNewItem)}}>add Todo</button>
            </div>
      {!(searchResult.length > 0 ) ? this.state.items.length>0? this.state.items.map((item, index) => {

        return (
          <div className="regular-item" key={index}>
            {item.task.map((task, idx) => {
              
              return (
                <div
                  className="toDo"
                  key={idx}
                  style={task.priority === "Urgent and Vital"
                    ? { backgroundColor: "red" }
                    : task.priority === "Important"
                      ? { backgroundColor: "orange" }
                      : {}
                  }
                >
                  <button className="complete"  
                  onClick={this.completeFunction}
                  >
                    {task.completed === false ? "Done-No" : "Done-Yes"}
                  </button>
                  <p
                    className="para"
                    style={task.priority === "Normal"
                      ? { color: "black" }
                      : { color: "white" }
                    }
                  >
                    {task.name}
                  </p>
                  <button className="dropdown"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.toggleOpen(idx);
                    }}
                  >
                    open List
                  </button>
                  {this.state.open[idx] && (
                    <div
                      className="buttonGroup"
                      onClick={() => { this.toggleOpen(idx); }}
                    >
                      <button
                        onClick={(event) => { event.stopPropagation(); this.deleteFunction(event, idx); }}
                        className="delete"
                      >
                        Delete
                      </button>
                      <button
                         onClick={(event) => { event.stopPropagation(); this.reNameFunction(event); }}
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          this.setPriority(idx);
                        }}
                      >
                        Prioritize
                      </button>
                    </div>
                  )}
                  {this.state.priority === idx && (
                    <div
                      className="priority-rating"
                      onClick={(event) => {
                        event.stopPropagation();
                        this.setPriority(null);
                      }}
                    >
                      <h1 
                      onClick={() => { this.prioritizeFunction("Urgent and Vital", idx); }}
                        >Urgent and Vital</h1>
                      <h1 
                      onClick={() => {  this.prioritizeFunction("Important", idx) }}
                        >Important</h1>
                      <h1 
                      onClick={() => {  this.prioritizeFunction("Normal", idx) }}
                        >Normal</h1>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }): [] : searchResult.map((item, index) => {
        return (
          <div
            className="toDo"
            key={index}
            style={item.priority === "Urgent and Vital"
              ? { backgroundColor: "red", color: "white" }
              : item.priority === "Important"
                ? { backgroundColor: "orange", color: "white" }
                : { color: "black" }
            }
            // onClick={(e) => { e.stopPropagation(); setNewItemTitle(item.name); setItemTime(item.time)}}
          >
            <button
              className="complete"
              onClick={this.completeFunction}
            >
              {item.completed === false ? "Done-No" : "Done-Yes"}
            </button>
            <p
              className="para"
              style={item.priority === "Normal"
                ? { color: "black" }
                : { color: "white" }
              }
            >
  
             {item.name}
            </p>
            <button
              className="dropdown"
              onClick={(e) => {
                e.stopPropagation();
                this.toggleOpen(index);
              }}
            >
              open List
            </button>
            {this.state.open[index] && (
              <div
                className="buttonGroup"
                onClick={() => {
                  this.toggleOpen(index);
                }}
              >
                <button
onClick={(event) => {
  event.stopPropagation();
  const idxInOriginal = this.state.items[0].task
    .findIndex(t => t.name === item.name);
  this.deleteFunction(event, idxInOriginal);
}}
                  className="delete"
                >
                  Delete
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    this.reNameFunction(event);
                  }}
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setPriority(index);
                  }}
                >
                  Prioritize
                </button>
              </div>
            )}
            {this.state.priority === index && (
              <div
                className="priority-rating"
                onClick={(event) => {
                  event.stopPropagation();
                  this.setPriority(null);
                }}
              >
                                            <h1
                      onClick={() => {
                        const idxInItems = this.state.items[0]?.task.findIndex(
                          (t) => t.name === item.name
                        );
                        if (idxInItems !== undefined && idxInItems !== -1) {
                          this.prioritizeFunction("Urgent and Vital", idxInItems);
                        }
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Urgent and Vital"
                        );
                      }}
                        >Urgent and Vital</h1>
                      <h1 
                                            onClick={() => {
                        const idxInItems = this.state.items[0]?.task.findIndex(
                          (t) => t.name === item.name
                        );
                        if (idxInItems !== undefined && idxInItems !== -1) {
                          this.prioritizeFunction("Important", idxInItems);
                        }
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Important"
                        );
                      }}
                        >Important</h1>
                      <h1 
                                            onClick={() => {
                        const idxInItems = this.state.items[0]?.task.findIndex(
                          (t) => t.name === item.name
                        );
                        if (idxInItems !== undefined && idxInItems !== -1) {
                          this.prioritizeFunction("Normal", idxInItems);
                        }
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Normal"
                        );
                      }}
                        >Normal</h1>
              </div>
            )}
          </div>
        );
      })}
    </div>
    );
}

  }

   class DailyTaskItem extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        itemDate:"",
         newItem:"",
         newListItem:this.props.newListItem,
         open:{},
         searchItem:"",
         priority:"",
         prioritize:"Normal"
      }
    }

//     async fetchData() {
//   try {
//     const posts = await myApiClient.get('newlist');
//     this.setState(
//       { newListItem: posts },
//       () => { 
//         this.props.reportItems(this.state.newListItem);
//       }
//     );
//   } catch (error) {
//     console.error('An error occurred during API operations:', error);
//   }
// }
    reNameFunction = (event) => {
      const newtitle = prompt('請輸入新名字');
      if (!newtitle) return;
      const date = event.target.parentNode.parentNode.parentNode.querySelector('.date').value;
      const oldName = event.target.parentNode.parentNode.querySelector('.para').innerText;
  this.setState(prev => ({
    newListItem: prev.newListItem.map((item) =>
      item.date === date
        ? { ...item, 
          task: item.task.map((item) => { 
            if(item.name === oldName){ 
              const newItem = {...item, name: newtitle}
              return newItem
            }
            return item;
          }) }
        : item
    )
  }), ()=>{
    this.props.reportItems(this.state.newListItem);
  });
    };

    deleteFunction = async (event, i, mainIndex) => { 
      event.stopPropagation();
        this.setState(prev => ({
    newListItem: prev.newListItem.map((item) =>
      i === mainIndex
        ? { ...item, task: item.task.filter((_, index) => index !== i) }
        : item
    )
  }), ()=>{
    this.props.reportItems(this.state.newListItem);
  });
await myApiClient.delete("newlist", {
            task: event.target.parentNode.parentNode.querySelector('.para').innerText,
            date: event.target.parentNode.parentNode.parentNode.querySelector('.date').value
          })
    };

upDatePrioritize=(event, newPrioritize)=>{
  // 想限定在“当前被点击的那条 .toDo 容器”里拿，得先把范围缩小到那个容器，再去找它下面的 .para
  const container = event.currentTarget.closest('.toDo');
const itemName = container.querySelector('.para').innerText;
        const itemDate = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('.date').value;
        this.setState({prioritize : newPrioritize}, ()=>{
  this.prioritizeFunction(itemName, itemDate);
});
}

  // componentDidMount() {    
  //   const day = new Date();
  //   const date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
  //   // 當組件首次掛載完成後，自動呼叫一次
  //   this.fetchData();
  //   this.setState({itemDate: date})
  // }

      prioritizeFunction = (itemName, itemDate) => {
        
       this.setState({newListItem: this.state.newListItem.map((item)=> 
        item.date === itemDate? {
          ...item,
          task: item.task.map((item)=>{
            if(item.name===itemName){
              item.priority=this.state.prioritize; 
              return item
            } 
            return item
          })
        }
          : item)})
        this.setPriority(null);
      
    };
  setNewItem(e){
this.setState({newItem: e.target.value})
  }


addNewItem = (newItem, itemDate) => {
  if (!newItem || !itemDate) return;

  this.setState((prev) => {
    const taskToAdd = {
      name: newItem,
      completed: false,
      priority: prev.prioritize,
    };

    const idx = prev.newListItem.findIndex(x => x.date === itemDate);

    // 已存在該 date：在該項的 task 陣列尾端加入新任務
    if (idx !== -1) {
      const nextList = prev.newListItem.map((it, i) =>
        i === idx
          ? { ...it, task: [...(it.task || []), taskToAdd] }
          : it
      );
      return { newListItem: nextList, itemDate };
    }

    // 不存在該 date：新增一個新的日期項目
    const nextList = [
      ...prev.newListItem,
      { date: itemDate, task: [taskToAdd] },
    ];
    return { newListItem: nextList, itemDate };
  }, () => {
    // callback：此時 state 已更新
    const { newListItem, itemDate: finalDate } = this.state;
    this.props.reportItems(newListItem);
    this.props.reportDate(finalDate);
  });
};


    completeFunction = async (event) => {
      event.stopPropagation();
      event.target.innerText = `Done-Yes`;
        const itemName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        const itemDate = event.target.parentNode.parentNode.querySelector('.date').value;
await myApiClient.post('newlistComplete', { task: itemName, date: itemDate });
    };

toggleOpen = (index) => {
  this.setState(prevState => ({
    open: {
      ...prevState.open,
      [index]: !prevState.open[index]
    }
  }));
};

setPriority = (index) => {
this.setState({priority: index});
};

  selectedDate=(e)=>{
const date = e.target.value;
this.setState(() => ({
  itemDate: date
}), ()=>{
  this.props.reportDate(this.state.itemDate);
});

  }
     render ()  
     {
const {searchResult, toggle} = this.props;
      return (<div className="new-items"  
     style={{ display: toggle ? 'none' : 'block' }}
     >
                   <div className="new-item">
                     <input
                        type="date"
                       className="date"
                       value={this.state.itemDate}
                       onChange={(e) => this.selectedDate(e)}
                     />
                     <div className="inputGroup">
                       <input
                         type="text"
                         className="input"
                         onChange={(e) => this.setNewItem(e)}
                         placeholder="add New Task"
                         value={this.state.newItem}
                       />
                       <button className="create" 
                       onClick={() => this.addNewItem(this.state.newItem, this.state.itemDate)}
                       >add Todo</button>
                     </div>
                    {!(searchResult.length > 0) ? this.state.newListItem.map((item, mainIndex) => {
                      if(item.date === this.state.itemDate){
                      return item.task.map((item, index)=>(
                        <div
                          className="toDo"
                          key={index}
                          style={item.priority === "Urgent and Vital"
                            ? { backgroundColor: "red", color: "white" }
                            : item.priority === "Important"
                              ? { backgroundColor: "orange", color: "white" }
                              : { color: "black" }
                          }
                          //onClick={(e) => { e.stopPropagation(); setNewItemTitle(item.name); setItemTime(item.time); setItemDate(itemDate)}}
                        >
                          <button
                            className="complete"
                            onClick={(e) => { this.completeFunction(e); }}
                          >
                            {item.completed === false ? "Done-No" : "Done-Yes"}
                          </button>
                          <p
                            className="para"
                            style={item.priority === "Normal"
                              ? { color: "black" }
                              : { color: "white" }
                            }
                          >
                            {item.name}
                          </p>
                          <button
                            className="dropdown"
                            onClick={(e) => {
                              e.stopPropagation();
                              this.toggleOpen(index);
                            }}
                          >
                            open List
                          </button>
                          {this.state.open[index] && (
                            <div
                              className="buttonGroup"
                              onClick={(e) => {
                                e.stopPropagation();
                                //toggleOpen(index);
                              }}
                            >
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.deleteFunction(event, index, mainIndex);
                                }}
                                className="delete"
                              >
                                Delete
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.reNameFunction(event);
                                }}
                              >
                                Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.setPriority(index);
                                }}
                              >
                                Prioritize
                              </button>
                            </div>
                          )}
                          {
                          this.state.priority === index && (
                            <div
                              className="priority-rating"
                              onClick={(event) => {
                                event.stopPropagation();
                                //this.prioritizeFunction(event);
                                this.setPriority(null);
                              }}
                            >
                              <h1 
                              onClick={(event) => { this.upDatePrioritize(event,"Urgent and Vital") }}
                              >Urgent and Vital</h1>
                              <h1 
                              onClick={(event) => { this.upDatePrioritize(event,"Important"); }}
                              >Important</h1>
                              <h1 
                              onClick={(event) => { this.upDatePrioritize(event,"Normal"); }}
                                >Normal</h1>
                            </div>
                          )}
                        </div>
                      ))}
                    }): searchResult.map((item, index) => {
                      return (
                        <div
                          className="toDo"
                          key={index}
                          style={item.priority === "Urgent and Vital"
                            ? { backgroundColor: "red", color: "white" }
                            : item.priority === "Important"
                              ? { backgroundColor: "orange", color: "white" }
                              : { color: "black" }
                          }
                          onClick={(e) => { e.stopPropagation(); 
                            //setNewItemTitle(item.name); 
                            //setItemTime(item.time)
                          }}
                        >
                          <button
                            className="complete"
                            //onClick={(e) => { completeFunction(e); }}
                          >
                            {item.completed === false ? "Done-No" : "Done-Yes"}
                          </button>
                          <p
                            className="para"
                            style={item.priority === "Normal"
                              ? { color: "black" }
                              : { color: "white" }
                            }
                          >
                            {item.name}
                          </p>
                          <button
                            className="dropdown"
                            onClick={(e) => {
                              e.stopPropagation();
                              this.toggleOpen(index);
                            }}
                          >
                            open List
                          </button>
                          {this.state.open[index] && (
                            <div
                              className="buttonGroup"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.toggleOpen(index);
                              }}
                            >
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.deleteFunction(event);
                                }}
                                className="delete"
                              >
                                Delete
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.reNameFunction(event);
                                }}
                              >
                                Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.setPriority(index);
                                }}
                              >
                                Prioritize
                              </button>
                            </div>
                          )}
                          {this.state.priority === index && (
                            <div
                              className="priority-rating"
                              onClick={(event) => {
                                event.stopPropagation();
                                //prioritizeFunction(event, index);
                                this.setPriority(null);
                              }}
                            >
                                            <h1
                      onClick={(event) => {
this.upDatePrioritize(event, "Urgent and Vital")
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Urgent and Vital"
                        );
                      }}
                        >Urgent and Vital</h1>
                      <h1 
                      onClick={(event) => {
this.upDatePrioritize(event, "Important")
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Important"
                        );
                      }}
                        >Important</h1>
                      <h1 
                      onClick={(event) => {
this.upDatePrioritize(event, "Normal")
                        this.props.updateSearchResultPriority(
                          item.name,
                          "Normal"
                        );
                      }}
                        >Normal</h1>
                            </div>
                          )}
                        </div>
                      );
                    })}
                   </div>
                 </div>)};
   }

   class TaskList extends React.Component {
constructor(props) {
  super(props);
  this.state = { regularItems:[], itemDate:"" };
  this.regularExercisesToggle = this.regularExercisesToggle.bind(this);
  this.priorityPanelToggle = this.priorityPanelToggle.bind(this);
}
  regularExercisesToggle = () => {
    const next = !this.props.toggle;
    this.props.reportToggle(next);
  };
  priorityPanelToggle(e){
    e.stopPropagation();
this.props.onTogglePriorityPanel(e);
    }

      handleReceiveDate = (itemsFromChild) => {
    this.setState({ itemDate: itemsFromChild }, ()=>{this.props.reportDate(this.state.itemDate);});
  };

      handleReceiveItems = (itemsFromChild) => {
    this.setState({ regularItems: itemsFromChild }, ()=>{this.props.reportRegularItems(this.state.regularItems);});
  };

      handleReceiveDayItems = (itemsFromChild) => {
    this.setState({ newListItem: itemsFromChild }, ()=>{this.props.reportDayItems(this.state.newListItem);});
  };

     render ()
     {            
      const {priority} = this.props;
      
      return (<div className="itemGroup">
       <button className='add' 
       onClick={this.priorityPanelToggle}
       >Priority</button>
               {this.props.toggle
                 ? <button onClick={this.regularExercisesToggle} className='add'>Go To Today</button>
                 : <button onClick={this.regularExercisesToggle} className='regular'>Go To Regular</button>
               }
                             <RegularTaskItem
               toggle={this.props.toggle}
               reportItems={this.handleReceiveItems}
               inputValue={this.props.inputValue}
               regularItems={this.props.regularItems}

               searchResult={this.props.searchResult}
               updateSearchResultPriority={this.props.updateSearchResultPriority}
               />
               <DailyTaskItem  
               newListItem={this.props.newListItem}
               searchResult={this.props.searchResult}
               toggle={this.props.toggle}
               reportItems={this.handleReceiveDayItems}
               reportDate={this.handleReceiveDate}
               updateSearchResultPriority={this.props.updateSearchResultPriority}
 />
             </div>)};
   }

class PriorityPanel extends React.Component{
constructor(props){
  super(props)
  this.state = {
  //         itemDate, 
  //     setItemDate,
  //     setMyContent, 
  //     newItemTitle,  
  //     setNewItemTitle, 
  //     setItemTime, 
newListItem:[],
  priorityList:[],
  filteredPriorityList:[],
  priorityParmeter : "",
  openPanelPriority:{},
  alterPriorityState:{},

  // timePriority :"Closer",
  }
} 

    reNameFunction = (event) => {
      const newtitle = prompt('請輸入新名字');
      if (!newtitle) return;
      const oldName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        console.log(this.state.newListItem);
        var existnewitemList = this.state.newListItem.map((item)=>({
  ...item,
task: item.task.map(subitem=> 
subitem.name === oldName? {...subitem, name: newtitle}: subitem)}));

console.log(existnewitemList);
this.setState({newListItem: existnewitemList}, ()=>{this.props.updateNewListItem(this.state.newListItem);});
    };

    deleteFunction = (event) => {
      const taskName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        console.log(this.state.newListItem);
        var filterednewitemList = this.state.newListItem.map((item)=>({
  ...item,
task: item.task.filter(subitem=> 
subitem.name !== taskName)}));
this.setState({newListItem: filterednewitemList}, ()=>{this.props.updateNewListItem(this.state.newListItem);});

    };

    alterStateFunction = (event, priorityState) => {
      const taskName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        console.log(this.state.newListItem);
        var existnewitemList = this.state.newListItem.map((item)=>({
  ...item,
task: item.task.map(subitem=> 
subitem.name === taskName? {...subitem, priority: priorityState}: subitem)}));  

console.log(existnewitemList);
this.setState({newListItem: existnewitemList}, ()=>{this.props.updateNewListItem(this.state.newListItem);});
    };

compareDate = (taskDate1, taskDate2) => {
  const d1 = new Date(taskDate1.date);
  const d2 = new Date(taskDate2.date);

  const takeDate1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const takeDate2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

    return takeDate1 - takeDate2;  // 早的在前

}

  panelOpen(index){
    console.log(index)
      this.setState(prevState => ({
        ...prevState,
        openPanelPriority: {
          ...prevState.openPanelPriority,
          [index]: !prevState.openPanelPriority[index],
        }
      }));
    };

  openStateChangePanel(index){
      this.setState(prevState => ({
        ...prevState,
        alterPriorityState: {
          ...prevState.alterPriorityState,
          [index]: !prevState.alterPriorityState[index],
        }
      }));
    };
    
parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;       // 沒時間就給 null
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

compareTime = (a, b) => {
  const t1 = this.parseTimeToMinutes(a.time);
  const t2 = this.parseTimeToMinutes(b.time);

  if (t1 == null && t2 == null) return 0;
  if (t1 == null) return 1;  // 沒時間排後面
  if (t2 == null) return -1; 

    return t1 - t2;          // 早的在前
}

 updatePriorityList =() =>{
  const priorityList = this.state.priorityList.map(item => ({ ...item }));
            for(let i=0; i<priorityList.length; i++){
              for(let j=0; j<this.state.newListItem.length; j++){
                for (let x=0; x<this.state.newListItem[j].task.length; x++) {
if(priorityList[i].name === this.state.newListItem[j].task[x].name){
  priorityList[i].date = this.state.newListItem[j].date
}
              }
            }}
          if(this.state.priorityParmeter === "Closer") {
            const filtered = this.state.priorityList
            .sort(this.compareDate)
            .sort(this.compareTime)
           this.setState({ filteredPriorityList: filtered });
            return;
          }else if(this.state.priorityParmeter === "Farther") {          
            const filtered = this.state.priorityList
            .sort(this.compareDate)
            .sort(this.compareTime)
            .reverse()
            this.setState({ filteredPriorityList: filtered });
            return;
          }
  
          const filtered = this.state.priorityList.filter((item) => {
            if(item.priority === this.state.priorityParmeter){
              return item
            }
          }
          );
          if (filtered) {
            this.setState({ filteredPriorityList: filtered });
          } else {
            this.setState({ filteredPriorityList: [] });
          }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regularItems !== this.props.regularItems || prevProps.newListItem !== this.props.newListItem) {
      let updatedNewListItem = this.props.newListItem;

      this.setState({ 
        priorityList: [...this.props.regularItems, ...this.props.newListItem].flatMap(item => item.task),
        filteredPriorityList: [...this.props.regularItems, ...this.props.newListItem].flatMap(item => item.task),
        newListItem: updatedNewListItem
       });
    }
  }

    changePriority = (event) => {
        this.setState({priorityParmeter: event.target.value}, this.updatePriorityList)
    };

        completeFunction = (event) => {
      event.stopPropagation();
      event.target.innerText = `Done-Yes`;
      if (this.props.toggle) {
        let taskName = event.target.parentNode.querySelector('.para').innerText;
        fetch(`http://localhost:8080/regular`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task: taskName })
        })
          .then(res => res.json())
          .then(data => console.log("✅ 來自伺服器的回應：", data))
          .catch(error => console.error("❌ 發生錯誤：", error));
      } else {
        const itemName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        const itemDate = event.target.parentNode.parentNode.querySelector('.date').value;
        fetch(`http://localhost:8080/newlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task: itemName, date: itemDate })
        })
          .then(res => res.json())
          .then(data => console.log("✅ 來自伺服器的回應：", data))
          .catch(error => console.error("❌ 發生錯誤：", error));
      }
    };
render(){

const {priority, onClose} = this.props;
  return(
            <div 
            className={priority ? "priority-panel show" : "priority-panel hide"}
            >
             <form className='priority-filter'>
                <select id="sel1" value={this.state.priorityParmeter} onChange={this.changePriority}>
                  <option value="Urgent and Vital">Urgent and Vital</option>
                  <option value="Important">Important</option>
                  <option value="Normal">Normal</option>
                  <option value="Closer">Closer</option>
                  <option value="Farther">Farther</option>
                </select>
              </form>

              <div className="priority-panel-toDo-container">
                {this.state.filteredPriorityList.map((item, index) => {
                  return (
                    <div
                      className="priority-panel-toDo"
                      key={index}
                      style={
                        item.priority === "Urgent and Vital"
                          ? { backgroundColor: "red", color: "white" }
                          : item.priority === "Important"
                            ? { backgroundColor: "orange", color: "white" }
                            : { color: "black" }
                      }
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   setNewItemTitle(item.name);
                      //   setItemTime(item.time);
                      //   setItemDate(item.date);
                      // }}
                    >
                      <button className="complete" onClick={this.completeFunction}>
                        {item.completed === false ? "Done-No" : "Done-Yes"}
                      </button>
                      <p
                        className="para"
                        style={
                          item.priority === "Normal"
                            ? { color: "black" }
                            : { color: "white" }
                        }
                      >
                        {item.name}
                      </p>
                      <button
                        className="dropdown"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.panelOpen(index);
                        }}
                      >
                        open List
                      </button>
                      {this.state.openPanelPriority[index] && (
                        <div
                          className="buttonGroup"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.panelOpen(index);
                          }}
                        >
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              this.deleteFunction(event, item.date);
                              this.panelOpen(index);
                            }}
                            className="delete"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              this.reNameFunction(event, item.date);
                              this.panelOpen(index);
                            }}
                          >
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              this.openStateChangePanel(index);
                            }}
                          >
                            Prioritize
                          </button>
                        </div>
                      )}
                      {this.state.alterPriorityState[index] && (
                        <div
                          className="selection-priority-rating"
                        >
                          <h1 onClick={(e) => {
        this.alterStateFunction(e, "Urgent and Vital");
       this.openStateChangePanel(index);
       this.panelOpen(index);
      }}>Urgent and Vital</h1>
                          <h1 onClick={(e) => {
        this.alterStateFunction(e, "Important");
        this.openStateChangePanel(index);
        this.panelOpen(index);
      }}>Important</h1>
                          <h1 onClick={(e) => {
        this.alterStateFunction(e, "Normal");
        // 關閉選單
        this.openStateChangePanel(index);
        this.panelOpen(index);
      }}>Normal</h1>
                          
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* <button onClick={() => { setShowPriorityPanel(false); }} className='close-btn'>Close</button>  */}
            </div>
  );
}}
  class App extends React.Component{
    constructor(){
      super();
      this.state = {
priority: false,
      inputValue : "",
      searchResult:[],
      result : "",
      regularItems: [],
      newListItem: [],
      toggle: true,
      itemDate:""
      }

    }
        async fetchData() {
  try {
    const regularPosts = await myApiClient.get('regular');   
    const newListposts = await myApiClient.get('newlist');
    console.log(regularPosts, newListposts);
    this.setState(
      {regularItems: regularPosts }
      // ,
      // () => {
      //   this.props.reportItems(this.state.regularItems);
      // }
    );
        this.setState(
      { newListItem: newListposts }
      // ,
      // () => { 
      //   this.props.reportItems(this.state.newListItem);
      // }
    );
  } catch (error) {
    console.error('An error occurred during API operations:', error);
  }
}
  componentDidMount() {
    this.fetchData();
  }
  handleToggle = (itemsFromChild) => {
    this.setState({ toggle: itemsFromChild });
  };
  updateNewListItem = (itemsFromChild) => {
    this.setState({ newListItem: itemsFromChild });
  }
  handleReceiveDate = (itemsFromChild) => {
        
    this.setState({ itemDate: itemsFromChild });
  };
  // handleReceiveItems = (itemsFromChild) => {
  //   this.setState({ regularItems: itemsFromChild });
  // };

  // handleReceiveDayItems = (itemsFromChild) => {

  //   this.setState({ newListItem: itemsFromChild });
  // };

getInputValue = (e)=>{
  if(e.target.value !==""){
    this.setState({inputValue : e.target.value})
  }else{
this.setState({searchResult:[]})
  }
}
  componentDidUpdate(prevProps, prevState) {
    const dataChanged =
      prevState.regularItems !== this.state.regularItems ||
      prevState.newListItem !== this.state.newListItem;
    if (dataChanged && this.state.inputValue) {
      this.searchItem();
    }
  }

priorityPanelToggle = (e) => {
  e.stopPropagation();
  this.setState(prev => ({ priority: !prev.priority }));
};


  closePriorityPanel = (e) => {
    if (!e.target.closest('.priority-panel')) {
      this.setState({ priority: false });
    }
  };
searchItem = () => {
  const allDayItems = this.state.newListItem.map((item)=>{return item.task}).flat()
  const searchItem = [...this.state.regularItems[0].task,...allDayItems]
  .filter(item => item.name.includes(this.state.inputValue));
  this.setState({
    searchResult: searchItem,
  });
};
updateSearchResultPriority = (name, newPriority) => {
  this.setState((prev) => {
    const updateTask = (task) =>
      task.name === name ? { ...task, priority: newPriority } : task;
    return {
      searchResult: prev.searchResult.map(updateTask),
      regularItems: prev.regularItems.map((item) => ({
        ...item,
        task: item.task.map(updateTask),
      })),
      newListItem: prev.newListItem.map((item) => ({
        ...item,
        task: item.task.map(updateTask),
      })),
    };
  }, ()=>{
  });
};
    save = async() => {
      if (this.state.toggle === true) {
    await myApiClient.put("regular", {regularTask: this.state.regularItems})
      } else if(this.state.toggle === false) {
for(let i=0; i<this.state.newListItem.length; i++){
if(this.state.newListItem[i].date === this.state.itemDate)
  await myApiClient.put("newlist", {date: this.state.itemDate, taskList:this.state.newListItem[i].task})
}

  
      }
    };

render (){
              const day = new Date();
      const date = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
      return (<ShowContext.Provider>
      <div className="App" 
      onClick={this.closePriorityPanel}
      >
        <div className='panel'>
          <h1>Hello</h1>
          <p>Time: {date}</p>
        </div>
        <div className='main'>
          <div className='to-do'>
            <h1>Todo List</h1>
            <div className='searchGroup'>
              <input onChange={this.getInputValue} placeholder='search' />
              <button onClick={this.searchItem} className='searchBtn'>search</button>
            </div>
<TaskList 
searchResult={this.state.searchResult}
regularItems={this.state.regularItems}
newListItem={this.state.newListItem}
inputValue={this.state.inputValue}
onTogglePriorityPanel={this.priorityPanelToggle}
// reportRegularItems={this.handleReceiveItems}
toggle={this.state.toggle}
reportToggle={this.handleToggle}
// reportDayItems={this.handleReceiveDayItems}
reportDate={this.handleReceiveDate}
updateSearchResultPriority={this.updateSearchResultPriority}
/>
<PriorityPanel 
// priorityList={priorityList}
priority={this.state.priority}
toggle={this.state.toggle}
// onClose={this.closePriorityPanel}
regularItems={this.state.regularItems}
newListItem={this.state.newListItem}
updateNewListItem={this.updateNewListItem}
// reportDayItems={this.handleReceiveDayItems}
// reportRegularItems={this.handleReceiveItems}
/>
            <button onClick={this.save} className='save-btn'>save</button>
          </div>

        </div>
      </div>
      </ShowContext.Provider>)
    }
  }

  export default App;