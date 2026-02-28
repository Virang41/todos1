const Todo = require("../models/todoModel");

exports.baseRoot = (req, res) => {
	res
		.status(200)
		.send(
			`<h1> todo-list </h1><p>See live todo-list app - <a href="https://mern-todofy.netlify.app">https://mern-todofy.netlify.app</a></p>`
		);
};

exports.getTask = async (req, res) => {
	try {
		const alltask = await Todo.find();
		res.status(200).json(alltask);
	} catch (err) {
		res.status(500).json({ errorMessage: err.message });
	}
};

exports.createTask = async (req, res) => {
	try {
		const { task } = req.body;

		if (!task || typeof task !== "string") {
			return res.status(400).json({ errorMessage: "Task is nout ok." });
		}

		const newlist = await Todo.create({ task });
		res.status(201).json({ message: "Task creat done.", newlist });
	} catch (err) {
		res.status(500).json({ errorMessage: err.message });
	}
};

exports.deleteTask = async (req, res) => {
	try {
		const deleted = await Todo.findByIdAndDelete(req.params.id);
		if (!deleted) {
			return res.status(404).json({ errorMessage: "Task nout seen." });
		}
		res.status(200).json({ message: "Task deleted.", deleted });
	} catch (err) {
		res.status(500).json({ errorMessage: err.message });
	}
};

exports.updateTask = async (req, res) => {
	try {
		const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updated) {
			return res.status(404).json({ errorMessage: "Task not seen." });
		}

		res.status(200).json({ message: "Task updated.", updated });
	} catch (err) {
		res.status(500).json({ errorMessage: err.message });
	}
};
