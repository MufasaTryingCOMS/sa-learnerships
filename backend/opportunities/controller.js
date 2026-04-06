const Opportunity = require('./Opportunity.js');

exports.createOpportunity = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Opportunity details are missing! Please provide the required opportunity details',
            });
        }

        const title = req.body.title;
        const description = req.body.description;
        const location = req.body.location;
        const closingDate = req.body.closingDate;
        const stipend = req.body.stipend;
        const duration = req.body.duration;

        if (!title) {
            return res.status(400).json({
                error: 'Title required! Please provide the title of the opportunity',
            });
        }

        if (!closingDate) {
            return res.status(400).json({
                error: 'Closing date required! Please provide the closing date of the opportunity',
            });
        }

        // TODO: Check if stipend and duration are numbers, the location is a valid location, the closing date is a valid date,

        const opportunity = await Opportunity.create({
            title,
            description,
            location,
            closingDate,
            stipend,
            duration,
        });

        if (!opportunity) {
            return res.status(500).json({
                error: "Couldn't create opportunity! Please try again later",
            });
        }

        res.status(201).json({
            id: opportunity._id,
            title: opportunity.title,
            location: opportunity.location,
            closingDate: opportunity.closingDate,
            stipend: opportunity.stipend,
            status: opportunity.status,
            createdAt: opportunity.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.getAllOpportunities = async (req, res) => {
    try {
        if (!req.query || !req.query.status) {
            return res.status(400).json({
                error: 'Status required! Please provide the status of the opportunities',
            });
        }

        const opportunities = await Opportunity.find({ status: req.query.status });
        // No need to perform any checks because the above query always returns an array

        res.status(200).json({ opportunities });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.getOpportunity = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        // TODO: Catch the mongoose cast / invalid id exception
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        res.status(201).json({
            id: opportunity._id,
            title: opportunity.title,
            location: opportunity.location,
            closingDate: opportunity.closingDate,
            stipend: opportunity.stipend,
            status: opportunity.status,
            createdAt: opportunity.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};
