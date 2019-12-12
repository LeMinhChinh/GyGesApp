import React, {Component} from 'react'

class App extends Component{
    render(){
        return (
            <div className="todoListMain">
                <div className="header">
                    <form>
                        <input
                            placeholder="Add task"
                        />
                        <button type="submit">Add Task</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default App

