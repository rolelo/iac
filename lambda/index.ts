import { SQSEvent } from "aws-lambda";
import AWS = require("aws-sdk");
import { EmailTypes, EnquirySubmissionEmail } from "./models/emailTypes";

const ses = new AWS.SES();

exports.handler = async function (event: SQSEvent) {
  let sourceEmail = "<info@rolelo.com>";
  if (!event.Records.length) throw Error("Records was empty");

  const queueInfo = event.Records[0];

  try {
    switch (queueInfo.attributes.MessageGroupId) {
     case EmailTypes.RoleloJobApplicationStatusUpdate:
        sourceEmail = "Rolelo - Job Application Status Update " + sourceEmail;
        await jobApplicationStatusUpdate(JSON.parse(queueInfo.body), sourceEmail);
        break;
      case EmailTypes.RoleloNewApplicant:
        sourceEmail = "Rolelo - New Applicant" + sourceEmail
        await newApplicant(JSON.parse(queueInfo.body), sourceEmail)
        break;
      default:
        throw Error("Invalid Message Group ID");
    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log(sourceEmail, JSON.stringify(queueInfo));
  }
};

async function newApplicant(
  body: EnquirySubmissionEmail,
  sourceEmail: string
) {
  try {
    await ses
      .sendTemplatedEmail({
        Destination: {
          ToAddresses: [body.email],
        },
        Source: sourceEmail,
        Template: EmailTypes.RoleloNewApplicant,
        TemplateData: JSON.stringify({
          name: body.name,
          listingTitle: body.listingTitle,
          listingUrl: body.listingUrl,
          cv: body.cv
        }),
      })
      .promise();
  } catch (e) {
    console.log(e)
  }
}

async function jobApplicationStatusUpdate(
  body: EnquirySubmissionEmail,
  sourceEmail: string
) {
  try {
    await ses
      .sendTemplatedEmail({
        Destination: {
          ToAddresses: [body.email],
        },
        Source: sourceEmail,
        Template: EmailTypes.RoleloJobApplicationStatusUpdate,
        TemplateData: JSON.stringify({
          name: body.name,
        }),
      })
      .promise();
  } catch (e) {
    console.log(e);
  }
}