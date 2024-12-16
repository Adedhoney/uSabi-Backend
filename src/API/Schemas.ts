import { AIAvatarMentor, LearningSchedule, ResponseOption, UserLanguage, UserLearningStyle } from '@domain/Models';
import Joi from 'joi';

const emailSchema = Joi.string().email().required();
const nameSchema = Joi.string().min(1).max(50);
const passwordSchema = Joi.string().min(8);

export const SignUpSchema = Joi.object({
    email: emailSchema,
    firstName: nameSchema.required(),
    lastName: nameSchema.required(),
    password: Joi.string().min(8).required(),
});
export const JoinWaitlistSchema = Joi.object({
    email: emailSchema.required(),
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
});
export const LogInSchema = Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required(),
});

export const GoogleSignInSchema = Joi.object({
    accessToken: Joi.string().required(),
});

export const UpdateInfoSchema = Joi.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
});
export const CreatorUpdateInfoSchema = Joi.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
});
export const UpdatePassWordSchema = Joi.object({
    password: passwordSchema.required(),
});
export const VerifyOtpSchema = Joi.object({
    email: emailSchema.required(),
    otp: Joi.string().required(),
});
export const ResetPasswordSchema = Joi.object({
    otpToken: Joi.string().required(),
    newPassword: passwordSchema.required(),
});
export const SavePostSchema = Joi.object({
    post: Joi.string().required(),
});
export const CreateMessageSchema = Joi.object({
    messageText: Joi.string().required(),
    messageReference: Joi.string().optional(),
    receiverId: Joi.string().required(),
});

export const OnboardingSchema = Joi.object({
    languagePreference: Joi.string()
        .valid(...Object.values(UserLanguage)).required(),
    learningStyle: Joi.string()
        .valid(...Object.values(UserLearningStyle)).required(),
    aiResponse: Joi.string()
        .valid(...Object.values(ResponseOption)).required(),
    learningDuration: Joi.string()
        .valid(...Object.values(LearningSchedule)).required(),
    avatar: Joi.string()
        .valid(...Object.values(AIAvatarMentor)).required(),
});

export const ChapterSchema = Joi.object({
    courseId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    position: Joi.number().required()
});

export const VideoSchema = Joi.object({
    chapterId: Joi.string().required(),
    title: Joi.string().optional(),
    duration: Joi.number().optional(),
    englishUrl: Joi.string().optional(),
    yorubaUrl: Joi.string().optional(),
    igboUrl: Joi.string().optional(),
    pidginUrl: Joi.string().optional()
}).or('englishUrl', 'yorubaUrl', 'igboUrl', 'pidginUrl');
