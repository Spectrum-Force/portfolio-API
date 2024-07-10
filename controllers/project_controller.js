import { projectModel } from "../models/project_model.js";


// Endpoints to post projects
export const postProject = async (req, res) => {
    try {

        const newProject = new projectModel(req.body);
        await newProject.save();
        res.status(201).json(newProject);


    } catch (error) {
        next(error);
    }
};

// Endpoint to get all projects
export const getProjects = async (req, res, next) => {
    try {
        const {
            filter = "{}",
            sort = "{}" } = req.query

        // get all projects from the database
        const allProjects = await projectModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
            .select(JSON.parse(select));

        res.status(200).json(allProjects);
    } catch (error) {
        next(error)
    }
}


// Endpoint to get an event with a unique id

export const getOneProject = async (req, res, next) => {
    try {
        const getOneProject = await projectModel.findById(req.params.id)
        console.log(`Project with ID ${req.params.id} has been retrieved`)
        res.status(200).json(getOneProject);

    } catch (error) {
        next(error)
    }
}

// Endpoint to update the details of a project

export const updateProject = async (req, res, next) => {
    try {

        const updateProject = await projectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateProject);

    } catch (error) {
        next(error)
    }
}


// Endpoint to delete an event with a unique id
export const deleteProjects = async (req, res, next) => {
    try {
        const deleteProject = await projectModel.findByIdAndDelete(req.params.id);
        if (!deleteProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({message: "Project deleted successfully"});
        
    } catch (error) {
        next(error)
    }
}