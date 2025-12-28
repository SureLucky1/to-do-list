import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const regularReset = createAsyncThunk(
  'regular-reset',
  async (date, thunkAPI) => {
    const response = await fetch(`http://localhost:8080/regular-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  }
);

export const regularItemPost = createAsyncThunk(
  'regular-item-post',
  async (task, thunkAPI) => {
    const response = await fetch(`http://localhost:8080/regular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
      body: JSON.stringify({ task }),
    });
  }
)

export const regularItemPut = createAsyncThunk(
  'regular-item-put',
  async ({date, regularTask}, thunkAPI) => {

    const response = await fetch(`http://localhost:8080/regular`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
      body: JSON.stringify( {date, regularTask}),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
)
export const regularGet = createAsyncThunk(
  'regularGet',
  async (thunkAPI) => {
    const response = await fetch(`http://localhost:8080/regular`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
)

export const newlistGet = createAsyncThunk(
  'regular-get',
  async (thunkAPI) => {
    const response = await fetch(`http://localhost:8080/newlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
)


export const newlistItemPut = createAsyncThunk(
  'newlist-item',
  async (task, thunkAPI) => {
    const response = await fetch(`http://localhost:8080/newlist`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
      body: JSON.stringify({ task : task }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  })

export const updateNewListDetail = createAsyncThunk(
  "put-newlist-detail",
  async (myContent, newItemTitle, itemDate, thunkAPI) => {
    const response = await fetch(`http://localhost:8080/newlist-detail`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
      body: JSON.stringify({ content: myContent, title: newItemTitle, date: itemDate }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
)
const initialState = {
  regularTasks: [],
  newlistTasks: [],
}

const todosSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      addRegularTodo: (state, action) => {
        const itemList = state.regularTasks
        .find(item => item.date === action.payload.date)
        const exist = itemList.task.find(item=>
          item.name === action.payload.name
        )
        if(exist) return;
itemList.task.push({
  name: action.payload.name,
  completed: action.payload.completed,
  priority: action.payload.priority,
});
      },
      deleteRegularTodo: (state, action) => {
        const regularitemList = state.regularTasks.find(todo => todo.date === action.payload.date)
const exist = regularitemList.task.find(item => item.name === action.payload.task)
if (exist) {
  regularitemList.task.splice(regularitemList.task.indexOf(exist), 1)
}
      },
      regularItemChangeName:(state, action)=>{
        const {date, name, newName} = action.payload;
      const exist = state.regularTasks
      .find(item=>item.date === date).task.find(item => item.name === name)
      if(!exist) return;
      exist.name = newName;
      },
      toggleTodo: (state, action) => {
        const todo = state.find(todo => todo.id === action.payload.id)
        if (todo) {
          todo.completed = !todo.completed
        }
      },

      saveRegularItem:(state, action) => {
        const { combinedReItem } = action.payload
        const existingItem = state.find(item => item.date === "27/3/2025")
        if (existingItem) {
          existingItem.task.push(combinedReItem)
        }
        else {
          throw new Error('Item not found')
        }
      },
      setRegularItemPriority: (state, action)=>{
        const {date, name, priority} = action.payload
        console.log(date)
       const exist = state.regularTasks
       .find(item => item.date === date).task
       .find(item => item.name === name)
      exist.priority = priority
      },
      saveNewListItem:(state, action) => {
        const { task } = action.payload
        const { date, taskList } = task
        console.log(taskList)
        console.log(date)
        const existingItem = state.find(item => item.date === date)
        if (existingItem) {
          existingItem.task = taskList
        } else {
          state.push({ date, taskList })
        }
      },
      addnewListTodo: (state, action) => {
        const itemList = state.newlistTasks
        .find(item => item.date === action.payload.date);
        if(!itemList){
          state.newlistTasks.push({
            date: action.payload.date,
            task: [{
            name: action.payload.name,
            completed: action.payload.completed,
            priority: action.payload.priority,
            }]

          });
        }else{
          const exist = itemList.task.find(item=>
          item.name === action.payload.name
        )
        if(exist) return;
itemList.task.push({
  name: action.payload.name,
  completed: action.payload.completed,
  priority: action.payload.priority,
});
        }

      },
deleteNewListItem: (state, action)=>{
  const newlistTasks = state.newlistTasks.find(todo => todo.date === action.payload.date)
  const exist = newlistTasks.task.find(item => item.name === action.payload.task)
  if (exist) {
    newlistTasks.task.splice(newlistTasks.task.indexOf(exist), 1)
  }
},
newListItemChangeName:(state, action)=>{
  const {date, name, newName} = action.payload;
  console.log(date, name, newName);
const exist = state.newlistTasks
.find(item=>item.date === date).task.find(item => item.name === name)
if(!exist) return;
exist.name = newName;
},
      itemCompleted: (state, action)=>{
        const taskName = action.payload.task;
        state.regularTasks = state.regularTasks.map(item =>{
        return {...item, task: item.task.map(item => item.name === taskName? {...item, completed: true} : item)};
        })
      },
      setDailyItemPriority: (state, action)=>{
        const {date, name, priority} = action.payload
        console.log(priority, date, name)
       const exist = state.newlistTasks.find(item => item.date === date).task
       .find(item => item.name === name)
      console.log(exist)
       exist.priority = priority
      }
    },
    extraReducers: builder => {
      builder
        // regularGet 成功時，把 data 放到 tasks
        .addCase(regularGet.pending, state => {
          state.status = 'loading';
        })
        .addCase(regularGet.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.regularTasks = action.payload;
        })
        .addCase(regularGet.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        // newlistGet 同理
        .addCase(newlistGet.pending, state => {
          state.status = 'loading';
        })
        .addCase(newlistGet.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.newlistTasks = action.payload;
        })
        .addCase(newlistGet.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(regularItemPut.fulfilled, (state, action) => {
          state.status = 'succeeded';  
        })
        .addCase(regularItemPut.rejected, (state, action) => {
          console.error("PUT error payload:", action.payload, action.error);
        });
    }
  })

  export const { setRegularItemPriority, setDailyItemPriority, regularItemChangeName, newListItemChangeName, addnewListTodo, deleteNewListItem, itemCompleted, addRegularTodo, deleteRegularTodo, toggleTodo, saveRegularItem, saveNewListItem } = todosSlice.actions
  
  export default todosSlice.reducer