import { createProjectService,getAllProjectService ,getProjectByIDService,deleteProjectByIDService,rotateApiKeyService,updateProjectService} from "../services/project.service.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

export const createProject = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({message:"Project Name is required."})
        }
        if(name.trim().length<5){
            return res.status(400).json({message:"Name must be at least 5 characters." })
        }
        if(name.trim().length>60){
            return res.status(400).json({message:"Name must be at most 60 characters."})
        }

        const existingProject  =await Project.findOne({name:name.trim(),owner:req.user.id})
        if(existingProject){
            return res.status(400).json({message:"Project already exists."})
        } 

        const project = await createProjectService({name:name.trim(), owner:req.user.id});
        return res.status(201).json({
            message:"Project created successfully" ,
            project
        })


    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }

}

export const getProject = async(req,res)=>{
    try{

        const projects = await getAllProjectService(req.user.id);
        return res.status(200).json({
            message:"Project fetched successfully",
            projects
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error."})
    }
}

export const getProjectById = async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'projectid formalt is invlaid.' });
        }

        const project =await getProjectByIDService(req.params.id,req.user.id)
        if(!project){
            return res.status(404).json({message:"Project not found."})
        }
        return res.status(200).json({
            message:"Project by ID is fetched",
            project
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error."})
        
    }
}
export const deleteProjectByID = async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Project Id is invalid." });
        }
        const result = await deleteProjectByIDService(req.params.id, req.user.id);
        if(!result){
            return res.status(404).json({message:"Project not found"})
        }
        return res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}


export const rotateApiKey = async (req, res) => {
  try {

    const newApiKey = await rotateApiKeyService(req.params.id, req.user.id);

    if (!newApiKey) {
      return res.status(404).json({ message: "Project not found."});
    }

    return res.status(200).json({
      message: "API key rotated successfully. Update your SDK with the new key.",
      apiKey: newApiKey,
    });

  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error."});
  }
};
export const updateProject = async (req, res) => {
    try {
        const { name } = req.body

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID.' })
        }
        if (!name) {
            return res.status(400).json({ message: 'Project name is required.' })
        }
        if (name.trim().length < 5) {
            return res.status(400).json({ message: 'Name must be at least 5 characters.' })
        }
        if (name.trim().length > 60) {
            return res.status(400).json({ message: 'Name must be at most 60 characters.' })
        }

        const project = await updateProjectService(req.params.id, req.user.id, name)
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' })
        }

        return res.status(200).json({
            message: 'Project updated successfully',
            project
        })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error.' })
    }
}