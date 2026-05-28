import { Schedule } from "../models/schedules.model.js";
import { User } from "../models/user.model.js";

const normalizeScheduleType = (value = "") => String(value).trim().toLowerCase();
const normalizeScheduleDay = (value = "") => String(value).trim().toLowerCase();
const VALID_TYPES = new Set(["lab", "lecture"]);
const VALID_DAYS = new Map([
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
]);
const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TIME_24H_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

const normalizeTime = (time = "") => {
  const trimmed = String(time).trim();
  const match = trimmed.match(TIME_24H_RE);
  if (!match) return "";

  return `${String(Number(match[1])).padStart(2, "0")}:${match[2]}`;
};

const timeToMinutes = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const parseTimeRange = (timeRange) => {
  const [rawStart, rawEnd] = String(timeRange || "").split("-").map((t) => t.trim());
  const start = normalizeTime(rawStart);
  const end = normalizeTime(rawEnd);

  if (!start || !end) return null;

  return {
    start,
    end,
    startMinutes: timeToMinutes(start),
    endMinutes: timeToMinutes(end),
  };
};

const buildTimeRange = ({ start, end }) => `${start} - ${end}`;

const findOverlappingSchedule = async ({ username, day, time, excludeId }) => {
  const parsedTime = parseTimeRange(time);
  if (!parsedTime) return null;

  const query = { username };
  if (excludeId) query._id = { $ne: excludeId };

  const schedules = await Schedule.find(query);
  const normalizedDay = normalizeScheduleDay(day);

  return schedules.find((schedule) => {
    if (normalizeScheduleDay(schedule.day) !== normalizedDay) return false;

    const parsedExistingTime = parseTimeRange(schedule.time);
    if (!parsedExistingTime) return false;

    return (
      parsedTime.startMinutes < parsedExistingTime.endMinutes &&
      parsedTime.endMinutes > parsedExistingTime.startMinutes
    );
  });
};

const validateScheduleDetails = ({ time, day, type }) => {
  const normalizedType = normalizeScheduleType(type);
  const normalizedDay = normalizeScheduleDay(day);
  const parsedTime = parseTimeRange(time);

  if (!VALID_TYPES.has(normalizedType)) {
    return { error: "Type must be either lab or lecture" };
  }

  if (!VALID_DAYS.has(normalizedDay)) {
    return { error: "Day must be a valid weekday" };
  }

  if (!parsedTime) {
    return { error: "Invalid time format. Use HH:mm - HH:mm" };
  }
  const duration = parsedTime.endMinutes - parsedTime.startMinutes;
  if (duration < 30) {
   return { error: "Schedule must be at least 30 minutes long" };
 }

  if (parsedTime.startMinutes >= parsedTime.endMinutes) {
    return { error: "Start time must be earlier than end time" };
  }

  return {
    normalizedType,
    day: VALID_DAYS.get(normalizedDay),
    time: buildTimeRange(parsedTime),
  };
};

//create schedule

const createSchedule = async (req, res) => {
    try {
        const { subject, room, time, day, type } = req.body;
        const trimmedSubject = String(subject || "").trim();
        const trimmedRoom = String(room || "").trim();
        const normalizedType = normalizeScheduleType(type);

        if (!trimmedSubject || !trimmedRoom || !time || !day || !normalizedType){
            return res.status(400).json({
                message: "all fields needs to be filled"
            });
        }

        const validation = validateScheduleDetails({ time, day, type });
        if (validation.error) {
          return res.status(400).json({
            message: validation.error,
          });
        }

        const overlappingSchedule = await findOverlappingSchedule({
          username: req.user.username,
          day: validation.day,
          time: validation.time,
        });

      if (overlappingSchedule) {
        return res.status(409).json({
          message: `Schedule overlaps with an existing schedule on ${validation.day} from ${overlappingSchedule.time}`,
        });
       }

        const schedule = await Schedule.create({
            username: req.user.username,
            createdBy: req.user._id,
            subject: trimmedSubject,
            room: trimmedRoom,
            time: validation.time,
            day: validation.day,
            type: validation.normalizedType,
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

        if (typeof updates.day === "string") {
            const normalizedDay = normalizeScheduleDay(updates.day);
            if (!VALID_DAYS.has(normalizedDay)) {
                return res.status(400).json({
                    message: "Day must be a valid weekday"
                });
            }
            updates.day = VALID_DAYS.get(normalizedDay);
        }

        if (typeof updates.time === "string") {
            const parsedTime = parseTimeRange(updates.time);
            if (!parsedTime) {
                return res.status(400).json({
                    message: "Invalid time format. Use HH:mm - HH:mm"
                });
            }
            if (parsedTime.startMinutes >= parsedTime.endMinutes) {
                return res.status(400).json({
                    message: "Start time must be earlier than end time"
                });
            }
            updates.time = buildTimeRange(parsedTime);
        }

        if(Object.keys(updates).length === 0){
            return res.status(400).json({
                message: "No data provided"
            });
        }

        const currentSchedule = await Schedule.findOne({ _id: req.params.id, username: req.user.username });
        if(!currentSchedule){
            return res.status(404).json({
            message: "schedule not found"
            });
        }

        const nextSchedule = {
            day: updates.day ?? currentSchedule.day,
            time: updates.time ?? currentSchedule.time,
            type: updates.type ?? currentSchedule.type,
        };
        const validation = validateScheduleDetails(nextSchedule);
        if (validation.error) {
            return res.status(400).json({
                message: validation.error
            });
        }

        const overlappingSchedule = await findOverlappingSchedule({
            username: req.user.username,
            day: validation.day,
            time: validation.time,
            excludeId: currentSchedule._id,
        });

        if (overlappingSchedule) {
            return res.status(409).json({
                message: `Schedule overlaps with an existing schedule on ${validation.day} from ${overlappingSchedule.time}`,
            });
        }

        updates.day = validation.day;
        updates.time = validation.time;
        updates.type = validation.normalizedType;

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
        message: "Please provide professor name",
      });
    }

    const users = await User.find().select(
      "firstName lastName username department status"
    );

    const user = users.find((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();

      return fullName === rawName.toLowerCase();
    });

    if (!user) {
      return res.status(404).json({
        message: "Professor not found",
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
        status: user.status,
      },
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
    });
  }
};

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
