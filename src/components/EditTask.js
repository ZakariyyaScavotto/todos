import { useState } from "react"

const EditTask = ({ tasks, onEdit }) => {
	const [taskBeingEdited, setTaskBeingEdited] = useState(null)
	const [text, setText] = useState("")
	const [day, setDay] = useState("")
	const [reminder, setReminder] = useState(false)

	const onSubmit = (e) => {
		e.preventDefault()

		if (!text) {
			alert("Please add a task")
			return
		}
		if (typeof taskBeingEdited._id === "string") {
			onEdit({ text, day, reminder }, taskBeingEdited._id)
		} else {
			onEdit(
				{ text, day, reminder },
				Math.floor(Math.random() * 1000000000 + 1)
			)
		}
	}

	return (
		<form className="add-form" onSubmit={onSubmit}>
			<div className="form-control form-control-check">
				<label>Edit:</label>
				{tasks.map((task, index) => (
					<>
						<label htmlFor={index}>{task.text}</label>
						<input
							type="radio"
							id={index}
							value={task.text}
							name="task-editing"
							onChange={(e) => {
								setTaskBeingEdited(task)
								setText(task.text)
								setDay(task.day)
								setReminder(task.reminder)
							}}
						/>
						<br />
					</>
				))}
			</div>
			<div className="form-control">
				<label>Task</label>
				<input
					type="text"
					placeholder="Edit Task"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
			</div>
			<div className="form-control">
				<label>Day & Time</label>
				<input
					type="text"
					placeholder="Edit Day & Time"
					value={day}
					onChange={(e) => setDay(e.target.value)}
				/>
			</div>
			<div className="form-control form-control-check">
				<label>Set Reminder</label>
				<input
					type="checkbox"
					checked={reminder}
					value={reminder}
					onChange={(e) => setReminder(e.currentTarget.checked)}
				/>
			</div>

			<input type="submit" value="Save Task" className="btn btn-block" />
		</form>
	)
}

export default EditTask
