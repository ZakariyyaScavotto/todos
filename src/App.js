import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import About from "./components/About"
import EditTask from "./components/EditTask"

const App = () => {
	const [showAddTask, setShowAddTask] = useState(false)
	const [showEditTask, setShowEditTask] = useState(false)
	const [tasks, setTasks] = useState([])

	useEffect(() => {
		const getTasks = async () => {
			const tasksFromServer = await fetchTasks()
			setTasks(tasksFromServer)
		}

		getTasks()
	}, [])

	// Fetch Tasks
	const fetchTasks = async () => {
		const res = await fetch("https://todo-mongobackend.herokuapp.com/tasks")
		const data = await res.json()

		return data
	}

	// Fetch Single Task
	const fetchTask = async (id) => {
		const res = await fetch(
			`https://todo-mongobackend.herokuapp.com/tasks/${id}`
		)
		const data = await res.json()

		return data
	}

	// Add Task
	const addTask = async (task) => {
		const res = await fetch(
			"https://todo-mongobackend.herokuapp.com/tasks/new",
			{
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(task)
			}
		)

		const data = await res.json()

		setTasks([...tasks, data])
		setShowEditTask(false) // for case of edit error
	}

	// Delete Task
	const deleteTask = async (id) => {
		const res = await fetch(
			`https://todo-mongobackend.herokuapp.com/tasks/delete/${id}`,
			{
				method: "DELETE"
			}
		)
		res.status === 200
			? setTasks(tasks.filter((task) => task._id !== id))
			: alert("Error Deleting This Task")
	}

	// Toggle Reminder
	const toggleReminder = async (id) => {
		const taskToToggle = await fetchTask(id)
		const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
		const res = await fetch(
			`https://todo-mongobackend.herokuapp.com/tasks/update/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(updTask)
			}
		)

		const data = await res.json()

		setTasks(
			tasks.map((task) =>
				task._id === id ? { ...task, reminder: data.reminder } : task
			)
		)
	}

	// Edit Task
	const editTask = async (task, id) => {
		const taskToEdit = await fetchTask(id)
		const updTask = {
			...taskToEdit,
			text: task.text,
			day: task.day,
			reminder: task.reminder
		}
		if (JSON.stringify(taskToEdit) === "{}") {
			alert("Error editing this task, will create as a new task instead")
			addTask(updTask)
		} else {
			const res = await fetch(
				`https://todo-mongobackend.herokuapp.com/tasks/update/${id}`,
				{
					method: "PUT",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify(updTask)
				}
			)
			if (res.status === 200) {
				const data = await res.json()

				setTasks(
					tasks.map((task) =>
						task._id === id
							? { text: data.text, day: data.day, reminder: data.reminder }
							: task
					)
				)

				setShowEditTask(false)
			} else {
				alert("Error editing this task")
			}
		}
	}

	return (
		<Router>
			<div className="container">
				<Header
					onAdd={() => setShowAddTask(!showAddTask)}
					showAdd={showAddTask}
					onEdit={() => setShowEditTask(!showEditTask)}
					showEdit={showEditTask}
				/>
				<Routes>
					<Route
						path="/"
						element={
							<>
								{showEditTask && <EditTask tasks={tasks} onEdit={editTask} />}
								{showAddTask && <AddTask onAdd={addTask} />}
								{tasks.length > 0 ? (
									<Tasks
										tasks={tasks}
										onDelete={deleteTask}
										onToggle={toggleReminder}
										onEdit={editTask}
									/>
								) : (
									"No Tasks To Show"
								)}
							</>
						}
					/>
					<Route path="/about" element={<About />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	)
}

export default App
