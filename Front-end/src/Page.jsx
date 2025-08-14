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
    console.log(data)
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
         items:[],
         open:{},
         regularNewItem:"",
         priority:"",
         prioritize:"Normal"
      }
          this.addRegularItem = this.addRegularItem.bind(this);
    this.enterNewItem = this.enterNewItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
    }
    async fetchData() {
  try {
    const posts = await myApiClient.get('regular');
    this.setState(
      { items: posts },
      () => {
        console.log(this.state.items)
        this.props.reportItems(this.state.items);
      }
    );
  } catch (error) {
    console.error('An error occurred during API operations:', error);
  }
}
  componentDidMount() {
    this.fetchData();
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
    const newitems = prev.items.map((item, i)=>
     i === 0 ?
      {...item, item: item.task.map((subitem, index) =>{
        if(index === idx){
          subitem.priority = prioritize;
        }
        return subitem;
      })} : item
    )
    return { items: newitems };
  }, () => {
  this.props.reportItems(this.state.items);
    });
};

    async addRegularItem (taskName) {
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
        console.log(item)
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
                  // onClick={() => {
                  //   setNewItemTitle(task.name);
                  // }}
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
                    this.deleteFunction(event, index);
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
                      onClick={() => { this.prioritizeFunction("Urgent and Vital", index); }}
                        >Urgent and Vital</h1>
                      <h1 
                      onClick={() => {  this.prioritizeFunction("Important", index) }}
                        >Important</h1>
                      <h1 
                      onClick={() => {  this.prioritizeFunction("Normal", index) }}
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
         newListItem:[],
         open:{},
         searchItem:"",
         priority:"",
         prioritize:"Normal"
      }
    }

    async fetchData() {
  try {
    const posts = await myApiClient.get('newlist');
    this.setState(
      { newListItem: posts },
      () => { // callback 確保 state 更新完成
        this.props.reportItems(this.state.newListItem);
        console.log("DailyTaskItem items after setState:", this.state.newListItem);
      }
    );
  } catch (error) {
    console.error('An error occurred during API operations:', error);
  }
}
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
  }));
    };

    deleteFunction = async (event, i, mainIndex) => { 
      event.stopPropagation();
        this.setState(prev => ({
    newListItem: prev.newListItem.map((item) =>
      i === mainIndex
        ? { ...item, task: item.task.filter((_, index) => index !== i) }
        : item
    )
  }));
await myApiClient.delete("newlist", {
            task: event.target.parentNode.parentNode.querySelector('.para').innerText,
            date: event.target.parentNode.parentNode.parentNode.querySelector('.date').value
          })
    };

upDatePrioritize=(event, newPrioritize, index)=>{
  // 想限定在“当前被点击的那条 .toDo 容器”里拿，得先把范围缩小到那个容器，再去找它下面的 .para
  const container = event.currentTarget.closest('.toDo');
const itemName = container.querySelector('.para').innerText;
        const itemDate = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('.date').value;
console.log(itemName, itemDate, index)
        this.setState({prioritize : newPrioritize}, ()=>{
  this.prioritizeFunction(itemName, itemDate, index);
});
}

  componentDidMount() {    
    const day = new Date();
    const date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    // 當組件首次掛載完成後，自動呼叫一次
    this.fetchData();
    this.setState({itemDate: date})
  }

      prioritizeFunction = (itemName, itemDate, idx) => {
        
       this.setState({newListItem: this.state.newListItem.map((item)=> 
        item.date === itemDate? {
          ...item,
          task: item.task.map((item, index)=>{
            console.log(this.state.prioritize)
            if(item.name===itemName && index===idx){
              item.priority=this.state.prioritize; 
              return item
            } 
            return item
          })
        }
          : item)})
console.log(this.state.newListItem)
        this.setPriority(null);
      
    };
  setNewItem(e){
this.setState({newItem: e.target.value})
  }


  addNewItem = async (newItem, itemDate)=>{
    this.setState((pre)=>{
      const newitems = pre.newListItem.map((item)=>
         item.date === itemDate?
      {...item, task: [...item.task,  { name: newItem, completed: false, priority: pre.prioritize }]}
      : item);
      return {newListItem: newitems}
    }, () => { // callback 確保 state 更新完成
        this.props.reportItems(this.state.newListItem);
        this.props.reportDate(this.state.itemDate);
        console.log("DailyTaskItem items after setState:", this.state.newListItem);
      })
// const task = [{
//   taskList:{name: newItem, completed: false, priority: this.state.prioritize}, 
//   date: itemDate}]

  }

    completeFunction = async (event) => {
      event.stopPropagation();
      event.target.innerText = `Done-Yes`;
        const itemName = event.target.parentNode.parentNode.querySelector('.para').innerText;
        const itemDate = event.target.parentNode.parentNode.querySelector('.date').value;
await myApiClient.post('newlist', { task: itemName, date: itemDate });
    };

toggleOpen = (index) => {
  console.log(index)
  this.setState(prevState => ({
    open: {
      /* 在這裡先展開 prevState.open */
      ...prevState.open,
      /* 然後設定或反轉當前這個 index */
      [index]: !prevState.open[index]
    }
  }));
};

setPriority = (index) => {
  console.log(index)
this.setState({priority: index});
};

  selectedDate=(e)=>{
const date = e.target.value;
console.log(date)
this.setState(() => ({
  itemDate: date
  // newListItem: pre.newListItem.map((item) => {
  //   if(item.date == date){
  //     return item.task
  //   }
  //    })
}), ()=>{console.log(this.state.newListItem)});

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
                              onClick={(event) => { this.upDatePrioritize(event,"Urgent and Vital", index) }}
                              >Urgent and Vital</h1>
                              <h1 
                              onClick={(event) => { this.upDatePrioritize(event,"Important", index); }}
                              >Important</h1>
                              <h1 
                              onClick={(event) => { this.upDatePrioritize(event,"Normal", index); }}
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
                              //toggleOpen(index);
                            }}
                          >
                            open List
                          </button>
                          {/* {open[index] && (
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
                                  //deleteFunction(event);
                                }}
                                className="delete"
                              >
                                Delete
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  //reNameFunction(event);
                                }}
                              >
                                Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  //setPriority(index);
                                }}
                              >
                                Prioritize
                              </button>
                            </div>
                          )} */}
                          {/* {priority === index && (
                            <div
                              className="priority-rating"
                              onClick={(event) => {
                                event.stopPropagation();
                                //prioritizeFunction(event, index);
                                //setPriority(null);
                              }}
                            >
                              <h1 onClick={() => { prioritize.current = "Urgent and Vital"; }}>Urgent and Vital</h1>
                              <h1 onClick={() => { prioritize.current = "Important"; }}>Important</h1>
                              <h1 onClick={() => { prioritize.current = "Normal"; }}>Normal</h1>
                            </div>
                          )} */}
                        </div>
                      );
                    })}
                   </div>
                 </div>)};
   }

   class TaskList extends React.Component {
constructor(props) {
  super(props);
  this.state = { toggle: true, priority: true, regularItems:[], itemDate:"" };
  this.regularExercisesToggle = this.regularExercisesToggle.bind(this);
  this.priorityPanelToggle = this.priorityPanelToggle.bind(this);
}
    regularExercisesToggle(){
      if(this.state.toggle !== false){
        this.setState({toggle : false}, ()=>{this.props.reportToggle(this.state.toggle);})
      }else{
        this.setState({toggle : true}, ()=>{this.props.reportToggle(this.state.toggle);})
      }
    }
    priorityPanelToggle(){
      if(this.state.priority !== false){
        this.setState({priority : false})
      }else{
        this.setState({priority : true})
      }
    }

      handleReceiveDate = (itemsFromChild) => {
            console.log(itemsFromChild)
    this.setState({ itemDate: itemsFromChild }, ()=>{this.props.reportDate(this.state.itemDate);});
  };
      handleReceiveItems = (itemsFromChild) => {
            console.log(itemsFromChild)
    this.setState({ regularItems: itemsFromChild }, ()=>{this.props.reportRegularItems(this.state.regularItems);});
  };
      handleReceiveDayItems = (itemsFromChild) => {
            console.log('TaskList 收到 newListItem:', itemsFromChild);
    this.setState({ newListItem: itemsFromChild }, ()=>{this.props.reportDayItems(this.state.newListItem);});
  };

     render ()
     {            return (<div className="itemGroup">
               <button className='add' onClick={this.priorityPanelToggle}>Priority</button>
               {this.state.toggle
                 ? <button onClick={this.regularExercisesToggle} className='add'>Go To Today</button>
                 : <button onClick={this.regularExercisesToggle} className='regular'>Go To Regular</button>
               }
               <RegularTaskItem toggle={this.state.toggle} reportItems={this.handleReceiveItems} inputValue={this.props.inputValue} searchResult={this.props.searchResult}/>
               <DailyTaskItem  
               searchResult={this.props.searchResult} 
               toggle={this.state.toggle} 
               reportItems={this.handleReceiveDayItems}
               reportDate={this.handleReceiveDate}
 />
             </div>)};
   }

  class App extends React.Component{
    constructor(){
      super();
      this.state = {
      inputValue : "",
      searchResult:[],
      result : "",
      regularItems: [],
      newListItem: [],
      toggle: true,
      itemDate:""
      }

    }
    
  handleToggle = (itemsFromChild) => {
        console.log("toggle", itemsFromChild)
    this.setState({ toggle: itemsFromChild });
  };
  handleReceiveDate = (itemsFromChild) => {
        
    this.setState({ itemDate: itemsFromChild });
  };
  handleReceiveItems = (itemsFromChild) => {
        console.log('App 收到 RegularItems:',itemsFromChild)
    this.setState({ regularItems: itemsFromChild });
  };

  handleReceiveDayItems = (itemsFromChild) => {

    this.setState({ newListItem: itemsFromChild });
  };

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

    // 只要底層資料變了且目前有關鍵字，就自動重跑搜尋
    if (dataChanged && this.state.inputValue) {
      this.searchItem();
    }
  }
searchItem = () => {
  const allDayItems = this.state.newListItem.map((item)=>{return item.task}).flat()
  const searchItem = [...this.state.regularItems[0].task,...allDayItems]
  .filter(item => item.name.includes(this.state.inputValue));
  this.setState({
    searchResult: searchItem,
  });
};

    save = async() => {
      if (this.state.toggle === true) {
    await myApiClient.put("regular", {regularTask: this.state.regularItems})
console.log("App saved regularItem", this.state.regularItems)
      } else {
        console.log("App newlist", this.state.newListItem)
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
      <div className="App">
        <div className='panel'>
          <h1>hello, kiki</h1>
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
inputValue={this.state.inputValue}
reportRegularItems={this.handleReceiveItems}
reportToggle={this.handleToggle}
reportDayItems={this.handleReceiveDayItems}
reportDate={this.handleReceiveDate}
//updatelist={updatelist}
/>
            <button onClick={this.save} className='save-btn'>save</button>
          </div>

        </div>
      </div>
      </ShowContext.Provider>)
    }
  }

  export default App;