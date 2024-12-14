import { AIAvatarMentor, LearningSchedule, ResponseOption, UserLanguage, UserLearningStyle } from '@domain/Models';
import Joi from 'joi';

export const SignUpSchema = Joi.object({
    email: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
});
export const LogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const GoogleSignInSchema = Joi.object({
    accessToken: Joi.string().required(),
});

export const UpdateInfoSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
});
export const CreatorUpdateInfoSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
});
export const UpdatePassWordSchema = Joi.object({
    password: Joi.string().required(),
});
export const VerifyOtpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
});
export const ResetPasswordSchema = Joi.object({
    otpToken: Joi.string().required(),
    newPassword: Joi.string().required(),
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
})
