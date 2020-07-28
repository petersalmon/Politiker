const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
require("dotenv/config");

// Get contact form

router.get("/",function(req,res){
    res.render("contact");
});

// Send contact form

router.post("/", function(req, res) {
  // create reusable transporter object using the default SMTP transport

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_USER, // this should be YOUR GMAIL account
			pass: process.env.GMAIL_PASS // this should be your password
		}
	});

	var textBody = `FROM: ${req.body.name} EMAIL: ${req.body.email} SUBJECT: ${req.body.subject} MESSAGE: ${req.body.message}`;
	var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${req.body.name} <a href="mailto:${req.body.email}">${req.body.email}</a></p><p>${req.body.message}</p>`;
	var mail = {
		from: `${req.body.email}`, // sender address
		to: process.env.GMAIL_USER, // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
		subject: `${req.body.subject}`, // Subject line
		text: textBody,
		html: htmlBody
	};

	// send mail with defined transport object
	transporter.sendMail(mail, function (err, info) {
		if(err) {
			console.log(err);
            res.json({ message: "An error occured, your message was not sent." });
            // alert("An error occured. Your message was not sent. Please try again.");
            // res.redirect("back");
            // res.status(200).json({ message: 'failed' });
		}
		else {
            res.json({ message: "Your message has been sent!" });
            // alert("Message sent successfuly!");
            // res.redirect("back");
            // res.status(200).json({ message: 'success' });
		}
	});
});

module.exports = router;