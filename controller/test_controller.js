const TestScheme = require('../schemas/test_schema')
const Teacher = require('../schemas/teacher')



const createTest = async (req, res) => {
    try {
        const { classID,teacherID, testtitle, subject, participants, closedDate,   } = req.body;
        console.log('req.body closeDate: '+ closedDate)
        // Validate required fields
        if (!classID || !teacherID || !testtitle || !subject || !participants || !closedDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: classID, testtitle, participants, closedDate"
            });
        }

        const testdoc = new TestScheme({
            classID,
            teacherID,
            testtitle,
            subject,
            participants,
            closeDate:closedDate,
            status: 'ongoing'
        });

        await testdoc.save();

        return res.status(201).json({
            success: true,
            message: "Test created successfully",
            data: testdoc
        });

    } catch (error) {
        console.error("Error creating test:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getClassTest = async (req, res) => {
    try {
        const { teacherID } = req.params;
        console.log('=== Learning Service - getClassTest ===');
        console.log('Full params:', req.params);
        console.log('Extracted teacherID:', teacherID);
        console.log('Type:', typeof teacherID);
        
        if (!teacherID) {
            return res.status(400).json({
                success: false,
                message: "Missing teacherID in URL parameter"
            });
        }

        console.log('Querying TestScheme with teacherID:', teacherID);
        const tests = await TestScheme.find({ teacherID: teacherID });
        console.log(`Found ${tests.length} tests for teacher ${teacherID}`);
        console.log('Test data:', JSON.stringify(tests, null, 2));

        return res.status(200).json({
            success: true,
            message: "Fetched class tests successfully",
            data: tests
        });

    } catch (error) {
        console.error("=== Error fetching tests ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
const getTestData = async (req, res) => {
    try {
        const { testid } = req.params;

        if (!testid) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: testid"
            });
        }

        const testData = await TestScheme.findById(testid)
            .populate('classID', 'class_code')  // Populate class_code from Class
            .populate('teacherID', 'name');      // Populate name from Teacher

        if (!testData) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Test data fetched successfully",
            data: testData
        });

    } catch (error) {
        console.error("Get Test Data Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

const updateTest = async (req, res) => {
    try {
        const { testID } = req.params;  // /update/:testID
        const updateData = req.body;

        const updatedTest = await TestScheme.findByIdAndUpdate(
            testID,
            updateData,
            { new: true } // trả về document mới sau khi update
        );

        if (!updatedTest) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Test updated successfully",
            data: updatedTest
        });

    } catch (error) {
        console.error("Update Test Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
const deleteTest = async (req, res) => {
    try {
        const { testID } = req.params;  // /delete/:testID

        const deletedTest = await TestScheme.findByIdAndDelete(testID);

        if (!deletedTest) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Test deleted successfully",
            data: deletedTest
        });

    } catch (error) {
        console.error("Delete Test Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {createTest , deleteTest , updateTest , getClassTest, getTestData}