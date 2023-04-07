const Document = require('../models/document');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);

function save(req, res) {
    const { name, content, userId } = req.body.data;
    const newDocument = new Document(name, content, userId);

    Document.create(newDocument, (doc) => {
        if (doc) {
            res.status(200).json({ message: 'Document saved successfully' });
        } else {
            res.status(500).json({ "message": 'failed' });
        }
    });
}

function getAllByUserId(req, res) {
    const userId = req.params.userId;

    Document.getAllByUserId(userId, (documents) => {
        if (documents) {
            res.status(200).json({ documents });
        } else {
            res.status(204);
        }
    })
}

function deleteById(req, res) {

    const id = req.params.id;

    Document.delete(id, (affectedRows) => {
        if (affectedRows > 0) {
            res.status(200).json({ "message": 'success' });
        } else {
            res.status(500).json({ "message": 'failed' });
        }
    })
}

async function generateEssay(req, res) {
    const topic = req.body.data.topic;
    const wordsAmount = req.body.data.wordsAmount;
    const eduLevel = req.body.data.eduLevel;

    const prompt = "write me a plagiarism free essay about " + topic + ". it should be " + wordsAmount + " words length. write it fully in human voice tone. It must be written according to " + eduLevel + " education level"

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 1,
        max_tokens: 709,
    });
    const response = completion.data.choices[0].text;
    res.status(200).json(response);
}

async function generateCoverLetter(req, res) {
    const fullName = req.body.data.fullName;
    const jobDescription = req.body.data.jobDescription;
    const cv = req.body.data.cv;

    const prompt = "write me a unique cover letter. here are some information that will help you to write it. my full name:  " + fullName + ". job description: " + jobDescription + ". Write it fully in human voice tone. And also my cv:  " + cv + ". write less than one paper."

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 1,
        max_tokens: 709,
    });
    const response = completion.data.choices[0].text;
    res.status(200).json(response);
}

module.exports = { save, getAllByUserId, deleteById, generateEssay, generateCoverLetter };