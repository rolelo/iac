export enum EmailTypes {
  RoleloJobApplicationStatusUpdate = "RoleloJobApplicationStatusUpdate",
  RoleloNewApplicant = "RoleloNewApplicant",
}

export type EmailBody = {
  EmailAddress: string;
};

export type EnquirySubmissionEmail = EmailBody & {
  email: string;
} & Record<string, unknown>;
