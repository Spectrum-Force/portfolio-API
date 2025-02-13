
import { userModel } from "../models/user_model.js";
import { educationModel } from "../models/education_model.js";
import { educationSchema } from "../schema/education_schema.js";

// Endpoints to post education
export const postEducation = async (req, res) => {
    try {

        const { error, value } = educationSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        //after, find the user with the id that you passed when creating the education
        console.log('userId',req.session)

        const userId = req.session?.user?.id || req?.user.id;

        const user = await userModel.findById(userId);
        // Find the user in the database using the user ID from the session
        if (!user) {
            return res.status(404).send('User not found');
        }

        const education = await educationModel.create({ ...value, user: user });
        user.education.push(education._id);

        // Add the ID of the newly created education document to the user's education array
        await user.save();

        res.status(201).json({
            message: 'Education has been added successfully',
            Education: education
        })

    } catch (error) {
        return res.status(500).send(error.message);
    }

}

// Endpoint to get all education
export const getEducation = async (req, res) => {
    try {


        const userId = req.session?.user?.id || req?.user.id;
        const alleducation = await educationModel.find({ user: userId });
        

        // if (alleducation.length === 0) {
        //     return res.status(200).json({ education: alleducation });
        // }
        res.status(200).json({ education: alleducation })

    } catch (error) {
        return res.status(500).json(error);
    }
};

// Endpoint to get a single education
export const getSingleEducation = async (req, res) => {
    try {
        const getSingleEducation = await educationModel.findById(req.params.id, req.body, { new: true });

        res.status(200).json(getSingleEducation);

    } catch (error) {
        next(error.message);
    }
}


// Endpoint to update the details of an education
export const updateEducation = async (req, res) => {
    try {

        const { error, value } = educationSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const userId = req.session?.user?.id || req?.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const Education = await educationModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!Education) {
            return res.status(404).send("Education not found");
        }

        res.status(201).json ({
            message: 'Education has been updated successfully',
            Education: Education
        })



    } catch (error) {
        return res.status(500).json(error.message)
    }
}


// Endpoint to delete an education
export const deleteEducation = async (req, res, next) => {
    try {


        const userSessionId = req.session?.user?.id || req?.user.id;
        const user = await userModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const education = await educationModel.findByIdAndDelete(req.params.id);
        if (!education) {
            return res.status(404).send("Education not found");
        }

        user.education.pull(req.params.id);
        await user.save();
        res.status(200).json("Education deleted ");


    } catch (error) {
        return res.status(500).json({ error })
    }
};
