import { Schedule } from "../models/schedules.model.js";
import { User } from "../models/user.model.js";

const normalizeScheduleType = (value = "") => String(value).trim().toLowerCase();
const VALID_TYPES = new Set(["lab", "lecture"]);
const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//create schedule

const createSchedule = async (req, res) => {
    try {
        const { subject, room, time, day, type } = req.body;
        const normalizedType = normalizeScheduleType(type);

        if (!subject || !room || !time || !day || !normalizedType){
            return res.status(400).json({
                message: "all fields needs to be filled"
            });
        }

        if (!VALID_TYPES.has(normalizedType)) {
            return res.status(400).json({
                message: "Type must be either lab or lecture"
            });
        }

        const schedule = await Schedule.create({
            username: req.user.username,
            createdBy: req.user._id,
            subject,
            room,
            time,
            day,
            type: normalizedType,
        });

        const populated = await schedule.populate("createdBy", "firstName lastName username");

        res.status(201).json({
            message: "Schedule created successfully",
            schedule: populated
        });
    } catch (error) {
        res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}

const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find({ username: req.user.username })
            .populate("createdBy", "firstName lastName username");
        res.status(200).json(schedules);
    } catch (error) {
          res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}

const getScheduleByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const normalizedUsername = username.toLowerCase();

        if (normalizedUsername !== req.user.username.toLowerCase()) {
            return res.status(403).json({
                message: "You can only access your own schedules"
            });
        }

        const schedules = await Schedule.find({ username: normalizedUsername })
            .populate("createdBy", "firstName lastName username");

        if (!schedules || schedules.length === 0) {
            return res.status(404).json({
                message: "No schedules found for this username"
            });
        }
        
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}

const updateSchedule = async (req, res) => {
    try {
        const allowedFields = ["subject", "room", "time", "day", "type"];
        const updates = {};

        for (const field of allowedFields) {
            if (typeof req.body[field] === "string") {
                updates[field] = req.body[field].trim();
            }
        }

        if (typeof updates.type === "string") {
            updates.type = normalizeScheduleType(updates.type);
            if (!VALID_TYPES.has(updates.type)) {
                return res.status(400).json({
                    message: "Type must be either lab or lecture"
                });
            }
        }

        if(Object.keys(updates).length === 0){
            return res.status(400).json({
                message: "No data provided"
            });
        }

        const updatedSchedule = await Schedule.findOneAndUpdate(
            { _id: req.params.id, username: req.user.username },
            { $set: { ...updates, createdBy: req.user._id } },
            { new: true, runValidators: true }
        );

        if(!updatedSchedule){
            return res.status(404).json({
            message: "schedule not found"
            });
        } 

        res.status(200).json({
            message: "schedule updated successfully", schedule: updatedSchedule
        });
    } catch (error){ 
        if (error?.name === "CastError") {
            return res.status(400).json({
                message: "Invalid schedule ID"
            });
        }
        if (error?.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}

const searchProfessorSchedules = async (req, res) => {
    try {
        const rawName = String(req.query?.name || "").trim();
        if (!rawName) {
            return res.status(400).json({
                message: "Please provide firstName and lastName"
            });
        }

        const nameParts = rawName.split(/\s+/).filter(Boolean);
        if (nameParts.length < 2) {
            return res.status(400).json({
                message: "Please provide both firstName and lastName"
            });
        }

        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        const user = await User.findOne({
            firstName: { $regex: `^${escapeRegExp(firstName)}$`, $options: "i" },
            lastName: { $regex: `^${escapeRegExp(lastName)}$`, $options: "i" },
        }).select("firstName lastName username department");

        if (!user) {
            return res.status(404).json({
                message: "Professor not found"
            });
        }

        const schedules = await Schedule.find({ username: user.username })
            .populate("createdBy", "firstName lastName username")
            .sort({ createdAt: 1 });

        res.status(200).json({
            professor: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                department: user.department,
            },
            schedules,
        });
    } catch (error) {
        res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const deleted = await Schedule.findOneAndDelete({ _id: req.params.id, username: req.user.username });
        if (!deleted){
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule deleted successfully"
        });
    } catch (error) {
         res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}
export {
    createSchedule,
    getSchedules,
    getScheduleByUsername,
    searchProfessorSchedules,
    updateSchedule,
    deleteSchedule
};
